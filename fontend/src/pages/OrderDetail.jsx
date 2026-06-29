import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL, fetchJson, formatCurrency, getCurrentUser } from '../utils/storefront';
import { notify } from '../utils/notifications';

const ORDER_STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

const PAYMENT_STATUS_LABELS = {
  COD: 'Thanh toán khi nhận hàng',
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  UNPAID: 'Chưa thanh toán',
  ZALOPAY: 'ZaloPay',
  VNPAY: 'VNPAY',
  BANK: 'Chuyển khoản',
  REFUNDED: 'Đã hoàn tiền',
};

const statusClassMap = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  CONFIRMED: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  PROCESSING: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  SHIPPING: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeStatusKey = (value) => String(value || '').trim().toUpperCase();

const getStatusLabel = (value) => {
  const key = normalizeStatusKey(value);
  return ORDER_STATUS_LABELS[key] || String(value || 'Chưa xác định');
};

const getPaymentLabel = (value) => {
  const key = normalizeStatusKey(value);
  return PAYMENT_STATUS_LABELS[key] || String(value || 'Thanh toán');
};

const getStatusClassName = (value) => {
  const key = normalizeStatusKey(value);
  return statusClassMap[key] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
};

const normalizeOrder = (value, fallbackId) => {
  const status = value?.status ?? '';
  const paymentStatus = value?.paymentStatus ?? '';

  return {
    ...value,
    id: value?.id ?? value?.orderId ?? fallbackId ?? null,
    orderId: value?.orderId ?? value?.id ?? fallbackId ?? null,
    orderCode: value?.orderCode || value?.code || `ORD-${value?.id ?? value?.orderId ?? fallbackId ?? ''}`,
    totalAmount: Number(value?.totalAmount ?? value?.total ?? 0),
    statusCode: normalizeStatusKey(status),
    paymentStatusCode: normalizeStatusKey(paymentStatus),
    statusLabel: getStatusLabel(status),
    paymentStatusLabel: getPaymentLabel(paymentStatus),
  };
};

const normalizeDetail = (item) => {
  const product = item?.product || {};
  const unitPrice = Number(item?.unitPrice ?? product?.price ?? item?.price ?? 0) || 0;

  return {
    ...item,
    quantity: Number(item?.quantity) || 0,
    unitPrice,
    lineTotal: unitPrice * (Number(item?.quantity) || 0),
    product: {
      ...product,
      price: unitPrice,
    },
  };
};

const isDeliveredStatus = (value) => {
  const status = normalizeStatusKey(value);
  return status === 'DELIVERED' || status === 'COMPLETED';
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [user] = useState(() => getCurrentUser());
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rebuyingProductId, setRebuyingProductId] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      const resolvedOrderId = Number(orderId);
      if (!resolvedOrderId) {
        setError('Không có mã đơn hàng.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [orderRes, detailRes] = await Promise.all([
          fetch(`${API_BASE_URL}/orders/${resolvedOrderId}`)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
          fetch(`${API_BASE_URL}/orderDetails/orders/${resolvedOrderId}`),
        ]);

        if (!detailRes.ok) {
          throw new Error(`Không thể tải chi tiết đơn hàng (${detailRes.status})`);
        }

        const detailData = await detailRes.json();
        setDetails((Array.isArray(detailData) ? detailData : []).map(normalizeDetail));
        setOrder(orderRes ? normalizeOrder(orderRes, resolvedOrderId) : normalizeOrder({ id: resolvedOrderId }, resolvedOrderId));
      } catch (e) {
        setError(e.message || 'Lỗi khi tải chi tiết đơn hàng');
        setDetails([]);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [orderId]);

  const total = useMemo(
    () => details.reduce((sum, item) => sum + (Number(item?.lineTotal) || 0), 0),
    [details]
  );

  const statusCode = normalizeStatusKey(order?.status) || 'PENDING';
  const statusLabel = order?.statusLabel || getStatusLabel(order?.status);
  const paymentLabel = order?.paymentStatusLabel || getPaymentLabel(order?.paymentStatus);
  const statusClassName = getStatusClassName(statusCode);
  const orderDate = parseDate(order?.date || order?.orderDate);
  const canReviewOrRebuy = isDeliveredStatus(order?.status);

  const addProductAgain = async (detail) => {
    if (!user?.id || !detail?.product?.id) return;

    setRebuyingProductId(detail.product.id);
    try {
      const cartRes = await fetch(`${API_BASE_URL}/carts/user/${user.id}`);
      let cartId = null;

      if (cartRes.ok) {
        const cartsData = await cartRes.json();
        cartId = cartsData?.[0]?.id ?? null;
      }

      if (!cartId) {
        const createRes = await fetch(`${API_BASE_URL}/carts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!createRes.ok) {
          throw new Error('Không thể tạo giỏ hàng mới.');
        }

        const createdCart = await createRes.json();
        cartId = createdCart.id;
      }

      const existingCartDetails = await fetchJson(`${API_BASE_URL}/cartDetails/cart/${cartId}`).catch(() => []);
      const existingDetail = Array.isArray(existingCartDetails)
        ? existingCartDetails.find((item) => item?.product?.id === detail.product.id)
        : null;

      if (existingDetail?.id) {
        const nextQuantity = Number(existingDetail.quantity || 0) + Number(detail.quantity || 1);
        const updateRes = await fetch(`${API_BASE_URL}/cartDetails/${existingDetail.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...existingDetail,
            quantity: nextQuantity,
          }),
        });

        if (!updateRes.ok) {
          throw new Error('Không thể cập nhật số lượng trong giỏ.');
        }
      } else {
        const createRes = await fetch(`${API_BASE_URL}/cartDetails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: Number(detail.quantity || 1),
            product: { id: detail.product.id },
            cart: { id: cartId },
          }),
        });

        if (!createRes.ok) {
          throw new Error('Không thể thêm sản phẩm vào giỏ.');
        }
      }

      window.dispatchEvent(new Event('cart-updated'));
      notify({ message: 'Đã thêm sản phẩm này vào giỏ hàng.' });
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Không thể mua lại sản phẩm này.' });
    } finally {
      setRebuyingProductId(null);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-600">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Theo dõi đơn hàng
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-900">Chi tiết lịch sử đơn hàng</h1>
            <p className="mt-2 text-sm text-slate-600">
              Xem rõ sản phẩm đã mua, số lượng, tổng tiền, trạng thái và thông tin giao hàng của đơn này.
            </p>
          </div>

          <Link
            to={user?.id ? '/orders' : '/login'}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            &larr; Quay lại
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  #{order?.orderCode || orderId}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClassName}`}>
                  {statusLabel}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                  {paymentLabel}
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Mã đơn</div>
                  <div className="mt-2 text-lg font-black text-slate-900">#{order?.id ?? order?.orderId ?? orderId}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Ngày đặt</div>
                  <div className="mt-2 text-lg font-black text-slate-900">
                    {orderDate ? orderDate.toLocaleString('vi-VN') : 'Không rõ'}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Tổng tiền</div>
                  <div className="mt-2 text-lg font-black text-primary">{formatCurrency(order?.totalAmount || total)}</div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-100">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-2xl font-black text-slate-900">Danh sách sản phẩm</h2>
                <p className="mt-1 text-sm text-slate-500">{details.length} dòng sản phẩm trong đơn</p>
              </div>

              {details.length === 0 ? (
                <div className="p-10 text-center text-gray-600">Đơn hàng không có sản phẩm.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {details.map((item, idx) => {
                    const product = item?.product || {};
                    const unitPrice = Number(item?.unitPrice ?? product?.price) || 0;
                    const quantity = Number(item?.quantity) || 0;
                    const lineTotal = Number(item?.lineTotal) || unitPrice * quantity;
                    const imageUrl = product?.photo
                      ? `${API_BASE_URL}/image/products/${product.photo}`
                      : product?.image || '';

                    return (
                      <div key={item?.id || idx} className="flex gap-4 p-6">
                        <div className="h-24 w-24 flex-none overflow-hidden rounded-2xl bg-slate-50">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product?.title || product?.name || 'Sản phẩm'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                              Không có ảnh
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Sản phẩm</div>
                              <div className="mt-1 text-lg font-black text-slate-900">
                                {product?.title || product?.name || 'Sản phẩm'}
                              </div>
                              <div className="mt-2 text-sm text-slate-500 line-clamp-2">
                                {product?.description || 'Không có mô tả sản phẩm.'}
                              </div>
                            </div>

                            <div className="grid gap-2 text-left md:text-right">
                              <div>
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Số lượng</div>
                                <div className="mt-1 text-lg font-black text-slate-900">{quantity}</div>
                              </div>
                              <div>
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Đơn giá</div>
                                <div className="mt-1 font-semibold text-slate-900">{formatCurrency(unitPrice)}</div>
                              </div>
                              <div>
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Thành tiền</div>
                                <div className="mt-1 text-lg font-black text-primary">{formatCurrency(lineTotal)}</div>
                              </div>
                            </div>
                          </div>

                          {canReviewOrRebuy && (
                            <div className="mt-4 flex flex-wrap gap-3">
                              <Link
                                to={`/product/${product?.id}`}
                                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
                              >
                                Đánh giá
                              </Link>
                              <button
                                type="button"
                                onClick={() => addProductAgain(item)}
                                disabled={rebuyingProductId === product?.id}
                                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {rebuyingProductId === product?.id ? 'Đang thêm...' : 'Mua lại'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-xl font-black text-slate-900">Thông tin đơn hàng</h2>
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Trạng thái</span>
                    <span className={`rounded-full px-3 py-1 font-bold ${statusClassName}`}>{statusLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Thanh toán</span>
                    <span className="font-semibold text-slate-800">{paymentLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Người nhận</span>
                    <span className="font-semibold text-slate-800">{order?.customerName || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Điện thoại</span>
                    <span className="font-semibold text-slate-800">{order?.customerPhone || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Địa chỉ giao hàng</div>
                    <div className="mt-2 leading-7 text-slate-800">{order?.address || 'Chưa có địa chỉ'}</div>
                  </div>
                  {order?.note && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Ghi chú</div>
                      <div className="mt-2 leading-7 text-slate-800">{order.note}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
                <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Tổng kết</div>
                <div className="mt-4 grid gap-3">
                  <div className="flex justify-between gap-4 text-sm text-slate-300">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm text-slate-300">
                    <span>Vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-4 text-lg font-black">
                    <span>Tổng cộng</span>
                    <span className="text-emerald-300">{formatCurrency(order?.totalAmount || total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:border-primary hover:text-primary"
                >
                  Xem tất cả đơn hàng
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Mua tiếp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
