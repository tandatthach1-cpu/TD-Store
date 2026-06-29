import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ClipboardList, Package, Save, Search, ShoppingBag, Truck, Wallet } from 'lucide-react';
import { API_BASE_URL, formatCurrency, getCurrentUser } from '../utils/storefront';
import { notify } from '../utils/notifications';

const ORDER_STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
  PROCESSING: 'Đang xử lý',
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

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'COMPLETED', label: 'Hoàn tất' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

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

const normalizeOrder = (order) => {
  const rawStatus = order?.status ?? '';
  const rawPaymentStatus = order?.paymentStatus ?? '';
  const normalizedStatus = normalizeStatusKey(rawStatus);
  const normalizedPaymentStatus = normalizeStatusKey(rawPaymentStatus);

  return {
    ...order,
    id: order?.id ?? order?.orderId ?? null,
    orderId: order?.orderId ?? order?.id ?? null,
    orderCode: order?.orderCode || order?.code || `ORD-${order?.id ?? order?.orderId ?? ''}`,
    totalAmount: Number(order?.totalAmount ?? order?.total ?? 0),
    itemCount: Number(order?.itemCount ?? order?.totalItems ?? order?.detailCount ?? 0) || null,
    statusCode: normalizedStatus,
    paymentStatusCode: normalizedPaymentStatus,
    statusLabel: getStatusLabel(rawStatus),
    paymentStatusLabel: getPaymentLabel(rawPaymentStatus),
  };
};

const isAdminUser = (user) => {
  const role = String(user?.role || '').toUpperCase();
  return role.includes('ADMIN');
};

const toSearchText = (order) =>
  [
    order?.orderCode,
    order?.statusLabel,
    order?.paymentStatusLabel,
    order?.address,
    order?.customerName,
    order?.customerPhone,
    order?.note,
    String(order?.id ?? ''),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const OrderHistory = () => {
  const [user] = useState(() => getCurrentUser());
  const adminMode = isAdminUser(user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savingOrderId, setSavingOrderId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const res = adminMode
          ? await fetch(`${API_BASE_URL}/orders?page=0&size=100`)
          : await fetch(`${API_BASE_URL}/orders/user/${user.id}`);

        if (!res.ok) {
          throw new Error(`Không thể tải danh sách đơn (${res.status})`);
        }

        const data = await res.json();
        const list = adminMode
          ? Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.orders)
              ? data.orders
              : Array.isArray(data)
                ? data
                : []
          : Array.isArray(data?.orders)
            ? data.orders
            : Array.isArray(data)
              ? data
              : [];

        const normalized = list.map(normalizeOrder);
        setOrders(normalized);
        setStatusDrafts(
          adminMode
            ? normalized.reduce((acc, order) => {
                if (order?.id != null) {
                  acc[order.id] = order.statusCode || 'PENDING';
                }
                return acc;
              }, {})
            : {}
        );
      } catch (e) {
        setError(e.message || 'Lỗi khi tải danh sách đơn hàng');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [adminMode, user?.id]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + (Number(order?.totalAmount) || 0), 0);
    const completed = orders.filter((order) => normalizeStatusKey(order?.status) === 'COMPLETED').length;
    const shipping = orders.filter((order) => normalizeStatusKey(order?.status) === 'SHIPPING').length;

    return [
      { label: 'Tổng đơn', value: totalOrders, icon: <ClipboardList size={18} /> },
      { label: 'Tổng chi tiêu', value: formatCurrency(totalAmount), icon: <Wallet size={18} /> },
      { label: 'Hoàn tất', value: completed, icon: <Package size={18} /> },
      { label: 'Đang giao', value: shipping, icon: <Truck size={18} /> },
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((order) => {
      const status = normalizeStatusKey(order?.status);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesKeyword = !keyword || toSearchText(order).includes(keyword);
      return matchesStatus && matchesKeyword;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = async (order) => {
    if (!adminMode || !order?.id) return;

    const nextStatus = String(statusDrafts[order.id] || order?.statusCode || 'PENDING');
    setSavingOrderId(order.id);

    try {
      const payload = {
        ...order,
        status: nextStatus,
      };

      const res = await fetch(`${API_BASE_URL}/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Không thể cập nhật trạng thái (${res.status})`);
      }

      const updated = await res.json().catch(() => null);
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? normalizeOrder(updated || payload) : item))
      );
    } catch (e) {
      setError(e.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setSavingOrderId(null);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-600">Đang tải danh sách đơn hàng...</div>;
  }

  if (!user?.id) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
        <p className="mb-6 text-gray-600">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
        <Link
          to="/login"
          className="inline-flex rounded-full bg-primary px-6 py-2 font-bold text-white transition-all hover:bg-red-700"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              {adminMode ? 'Admin demo' : 'Đơn hàng của bạn'}
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-900">
              {adminMode ? 'Quản lý đơn hàng' : 'Lịch sử đơn hàng'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {adminMode
                ? 'Xem toàn bộ đơn, cập nhật trạng thái ngay trên danh sách mà không cần vào trang chi tiết.'
                : 'Theo dõi đơn đã đặt, xem trạng thái, phương thức thanh toán, địa chỉ giao hàng và mở nhanh trang chi tiết từng đơn.'}
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            &larr; Tiếp tục mua hàng
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">{item.icon}</div>
                <div className="text-right text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {item.label}
                </div>
              </div>
              <div className="mt-5 text-3xl font-black text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo mã đơn, tên, số điện thoại, địa chỉ..."
                className="auth-input pl-11"
              />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="auth-input">
              <option value="all">Tất cả trạng thái</option>
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!filteredOrders.length ? (
          <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
            <ShoppingBag className="mx-auto text-slate-300" size={48} />
            <h2 className="mt-4 text-2xl font-black text-slate-900">Không có đơn hàng phù hợp</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {orders.length ? 'Thử đổi từ khóa hoặc bộ lọc trạng thái.' : 'Bạn chưa có đơn hàng nào.'}
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {filteredOrders
              .slice()
              .sort((a, b) => (parseDate(b?.date)?.getTime() || 0) - (parseDate(a?.date)?.getTime() || 0))
              .map((order) => {
                const orderDate = parseDate(order?.date || order?.orderDate);
                const statusCode = normalizeStatusKey(order?.status) || 'PENDING';
                const statusLabel = order?.statusLabel || getStatusLabel(order?.status);
                const statusClassName = getStatusClassName(statusCode);
                const paymentLabel = order?.paymentStatusLabel || getPaymentLabel(order?.paymentStatus);
                const orderCode = order?.orderCode || `ORD-${order?.id ?? order?.orderId}`;
                const itemCount =
                  order?.itemCount ||
                  order?.orderDetailsCount ||
                  order?.detailCount ||
                  order?.totalItems ||
                  null;
                const orderId = order?.id ?? order?.orderId;

                const card = (
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {orderCode}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClassName}`}>
                          {statusLabel}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                          {paymentLabel}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900">Đơn hàng #{orderId}</h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {orderDate ? orderDate.toLocaleString('vi-VN') : 'Không rõ ngày đặt'}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-sm text-slate-500">Tổng tiền</div>
                          <div className="text-2xl font-black text-primary">{formatCurrency(order?.totalAmount || 0)}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Địa chỉ giao hàng</div>
                          <div className="mt-2 line-clamp-2 text-sm font-semibold text-slate-700">
                            {order?.address || 'Chưa có địa chỉ'}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Người nhận</div>
                          <div className="mt-2 line-clamp-2 text-sm font-semibold text-slate-700">
                            {order?.customerName || 'Chưa cập nhật'}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Số sản phẩm</div>
                          <div className="mt-2 text-sm font-semibold text-slate-700">
                            {itemCount != null ? `${itemCount} sản phẩm` : 'Xem chi tiết'}
                          </div>
                        </div>
                      </div>

                      {order?.couponCode && (
                        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
                          <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-emerald-700">
                            Mã giảm giá
                          </span>
                          <span>{order.couponCode}</span>
                          {order?.couponTitle && <span className="text-emerald-700/80">- {order.couponTitle}</span>}
                          {Number(order?.discountAmount) > 0 && (
                            <span className="font-black">Giảm {formatCurrency(order.discountAmount)}</span>
                          )}
                        </div>
                      )}

                      {order?.note && (
                        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                          <span className="font-bold text-slate-800">Ghi chú: </span>
                          {order.note}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                      <div className="text-sm text-slate-500">
                        <div>Điện thoại</div>
                        <div className="mt-1 font-semibold text-slate-800">{order?.customerPhone || 'Chưa có'}</div>
                      </div>

                      {statusCode === 'DELIVERED' || statusCode === 'COMPLETED' ? (
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={`/orders/${orderId}`}
                            className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
                          >
                            Đánh giá
                          </Link>
                        </div>
                      ) : null}

                      {adminMode ? (
                        <div className="flex flex-col gap-2 lg:items-end">
                          <select
                            value={statusDrafts[orderId] || order?.statusCode || 'PENDING'}
                            onChange={(event) =>
                              setStatusDrafts((current) => ({
                                ...current,
                                [orderId]: event.target.value,
                              }))
                            }
                            className="auth-input min-w-48"
                          >
                            {ORDER_STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order)}
                              disabled={savingOrderId === orderId}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                              <Save size={16} />
                              {savingOrderId === orderId ? 'Đang lưu...' : 'Cập nhật trạng thái'}
                            </button>
                            <Link
                              to={`/orders/${orderId}`}
                              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                              Chi tiết
                              <ChevronRight size={16} />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={`/orders/${orderId}`}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-primary"
                        >
                          Xem chi tiết
                          <ChevronRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                );

                return adminMode ? (
                  <div
                    key={orderId}
                    className="group rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {card}
                  </div>
                ) : (
                  <div
                    key={orderId}
                    className="group rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {card}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
