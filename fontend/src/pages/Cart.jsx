import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Minus, Plus, TicketPercent, Trash2 } from 'lucide-react';
import ZaloPayButton from '../components/payment/ZaloPayButton';
import { notify } from '../utils/notifications';
import {
  API_BASE_URL,
  setCurrentUser,
  fetchJson,
  formatCurrency,
  formatPriceStaticDot000,
  getCurrentUser,
  getImageUrl,
  parseCurrency,
} from '../utils/storefront';

const makeEmptyAddressForm = (user) => ({
  receiverName: user?.fullName || user?.username || '',
  receiverPhone: user?.numphone || '',
  street: '',
  ward: '',
  district: '',
  city: 'Ho Chi Minh',
  country: 'Viet Nam',
});

const cleanAddressPart = (part) => {
  const value = String(part || '').trim();
  if (!value) return '';
  if (/^Location$/i.test(value)) return '';
  if (/^Auto$/i.test(value)) return '';
  if (/^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/.test(value)) return '';
  if (/Vị trí hiện tại/i.test(value)) return '';
  return value;
};

const uniqueAddressParts = (parts) => {
  const seen = new Set();
  return parts.filter((part) => {
    const value = cleanAddressPart(part);
    if (!value) return false;
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildAddressLabel = (address) =>
  uniqueAddressParts([address.street, address.ward, address.district, address.city, address.country]).join(', ');

const isPlaceholderAddressText = (text) => {
  const value = String(text || '').trim();
  if (!value) return false;
  if (/Vị trí hiện tại/i.test(value)) return true;
  if (/\b(Location|Auto)\b/i.test(value)) return true;
  if (/\(-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?\)/.test(value)) return true;
  return false;
};

const reverseGeocodeAddress = async (lat, lng) => {
  const parseBigDataCloud = (data) => {
    const locality = data?.locality || data?.city || data?.principalSubdivision || data?.province || '';
    const localityInfo = data?.localityInfo || {};
    const addressLine = data?.localityInfo?.administrative || data?.principalSubdivision || data?.locality || data?.city || '';
    const displayLabel = data?.displayName || data?.label || addressLine || `${lat}, ${lng}`;

    return {
      street: data?.locality || data?.address || addressLine || displayLabel,
      ward: localityInfo?.informal || data?.locality || '',
      district: data?.principalSubdivision || data?.province || '',
      city: locality || '',
      country: data?.countryName || 'Việt Nam',
      raw: data,
      addressLine,
      displayLabel,
    };
  };

  try {
    const bdcUrl = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    bdcUrl.searchParams.set('latitude', String(lat));
    bdcUrl.searchParams.set('longitude', String(lng));
    bdcUrl.searchParams.set('localityLanguage', 'vi');

    const bdcResponse = await fetch(bdcUrl.toString(), { headers: { Accept: 'application/json' } });
    if (bdcResponse.ok) {
      const data = await bdcResponse.json();
      const parsed = parseBigDataCloud(data);
      if (parsed.city || parsed.district || parsed.street) return parsed;
    }
  } catch {
    // Fallback below.
  }

  const nominatimUrl = new URL('https://nominatim.openstreetmap.org/reverse');
  nominatimUrl.searchParams.set('format', 'jsonv2');
  nominatimUrl.searchParams.set('lat', String(lat));
  nominatimUrl.searchParams.set('lon', String(lng));
  nominatimUrl.searchParams.set('addressdetails', '1');
  nominatimUrl.searchParams.set('accept-language', 'vi');

  const response = await fetch(nominatimUrl.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể chuyển tọa độ thành địa chỉ');
  }

  const data = await response.json();
  const address = data?.address || {};
  const road = address.road || address.pedestrian || address.footway || address.path || '';
  const houseNumber = address.house_number || '';
  const ward = address.suburb || address.quarter || address.neighbourhood || address.village || '';
  const district = address.city_district || address.county || address.state_district || address.district || '';
  const city = address.city || address.town || address.municipality || address.province || address.state || '';
  const country = address.country || 'Việt Nam';
  const street = [houseNumber, road].filter(Boolean).join(' ').trim() || data?.display_name || `${lat}, ${lng}`;

  return {
    street,
    ward,
    district,
    city,
    country,
    raw: data,
    displayLabel: data?.display_name || [street, ward, district, city, country].filter(Boolean).join(', '),
  };
};

const normalizeCoupon = (coupon) => ({
  id: coupon.id,
  code: String(coupon.code || '').trim().toUpperCase(),
  title: coupon.title || 'Mã giảm giá',
  discountValue: Number(coupon.discountValue) || 0,
  discountType: String(coupon.discountType || 'PERCENT').toUpperCase(),
  minOrderValue: coupon.minOrderValue == null ? null : Number(coupon.minOrderValue),
  maxDiscountValue: coupon.maxDiscountValue == null ? null : Number(coupon.maxDiscountValue),
  quantity: coupon.quantity == null ? null : Number(coupon.quantity),
  active: Boolean(coupon.active),
  startAt: coupon.startAt || null,
  endAt: coupon.endAt || null,
});

const builtinCoupons = [
  { code: 'GIAM10', title: 'Giảm 10%', discountType: 'PERCENT', discountValue: 10, minOrderValue: 2000000 },
  { code: 'SALE50K', title: 'Giảm 50.000đ', discountType: 'AMOUNT', discountValue: 50000, minOrderValue: 1000000 },
  { code: 'PHONE15', title: 'Giảm 15%', discountType: 'PERCENT', discountValue: 15, minOrderValue: 5000000, maxDiscountValue: 500000 },
];

const Cart = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [cart, setCart] = useState(null);
  const [details, setDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(() => makeEmptyAddressForm(getCurrentUser()));
  const [saveAddress, setSaveAddress] = useState(true);
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (!response.ok) return;

        const freshUser = await response.json();
        const mergedUser = {
          ...user,
          ...freshUser,
          numphone: freshUser?.numphone || user?.numphone || '',
          fullName: freshUser?.fullName || user?.fullName || freshUser?.username || user?.username || '',
        };

        setUser(mergedUser);
        setCurrentUser(mergedUser);
        setAddressForm((current) => ({
          ...current,
          receiverName: current.receiverName || mergedUser.fullName || mergedUser.username || '',
          receiverPhone: current.receiverPhone || mergedUser.numphone || '',
        }));
      } catch {
        // Keep the cached profile if the refresh fails.
      }
    };

    syncUserProfile();
  }, [user?.id]);

  useEffect(() => {
    setAddressForm((current) => ({
      ...current,
      receiverName: current.receiverName || user?.fullName || user?.username || '',
      receiverPhone: current.receiverPhone || user?.numphone || '',
    }));
  }, [user?.fullName, user?.username, user?.numphone]);

  useEffect(() => {
    const loadCartData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [carts, couponsData] = await Promise.all([
          fetchJson(`${API_BASE_URL}/carts/user/${user.id}`),
          fetchJson(`${API_BASE_URL}/coupons?page=0&size=100`).catch(() => null),
        ]);

        setAvailableCoupons(
          couponsData ? (Array.isArray(couponsData) ? couponsData : couponsData.content || []).map(normalizeCoupon) : builtinCoupons
        );

        const firstCart = carts[0] || null;
        setCart(firstCart);

        try {
          const userAddresses = await fetchJson(`${API_BASE_URL}/users/${user.id}/addresses`);
          const normalizedAddresses = await Promise.all(
            (Array.isArray(userAddresses) ? userAddresses : []).map(async (address) => {
              const refreshed = await refreshAddressLabel(address);
              return {
                ...refreshed,
                label:
                  refreshed.label ||
                  refreshed.displayLabel ||
                  buildAddressLabel(refreshed) ||
                  'Địa chỉ đã lưu',
              };
            })
          );

          setAddresses(normalizedAddresses);
          if (normalizedAddresses.length) {
            setSelectedAddressId(normalizedAddresses[0].id);
          }
        } catch (e) {
          console.warn('[Cart] load addresses failed, continue without saved addresses', e);
          setAddresses([]);
          setSelectedAddressId(null);
        }

        if (!firstCart?.id) {
          setDetails([]);
          return;
        }

        try {
          const cartDetailsRes = await fetch(`${API_BASE_URL}/cartDetails/cart/${firstCart.id}`);
          if (cartDetailsRes.status === 404 || !cartDetailsRes.ok) {
            setDetails([]);
            return;
          }

          const cartDetails = await cartDetailsRes.json();
          const normalized = (Array.isArray(cartDetails) ? cartDetails : []).map((item) => {
            const product = item?.product || item?.Products || item?.productObj || null;

            return {
              id: item?.id,
              quantity: Number(item?.quantity) || 1,
              productId: product?.id ?? item?.productId ?? null,
              product: {
                id: product?.id ?? item?.productId ?? null,
                name: product?.title || product?.name || item?.productName || 'Sản phẩm',
                price: Number(product?.price ?? item?.price) || 0,
                priceLabel: formatCurrency(product?.price ?? item?.price),
                img: getImageUrl('products', product?.photo ?? item?.photo ?? product?.image ?? item?.image),
              },
            };
          });

          setDetails(normalized);
        } catch (e) {
          console.error('[Cart] load cartDetails error', e);
          setDetails([]);
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi tải giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    const handleCartUpdated = () => {
      loadCartData();
    };

    window.addEventListener('cart-updated', handleCartUpdated);
    loadCartData();

    return () => window.removeEventListener('cart-updated', handleCartUpdated);
  }, [user?.id]);

  const subtotal = useMemo(
    () => details.reduce((sum, item) => sum + parseCurrency(item.product.price) * item.quantity, 0),
    [details]
  );

  const totalQuantity = useMemo(
    () => details.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [details]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;

    const coupon = appliedCoupon;
    if (!coupon.active) return 0;
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0;

    if (coupon.discountAmount != null) {
      return Math.min(Math.max(Number(coupon.discountAmount) || 0, 0), subtotal);
    }

    let discount = 0;
    if (coupon.discountType === 'AMOUNT' || coupon.discountType === 'FIXED') {
      discount = coupon.discountValue;
    } else {
      discount = (subtotal * coupon.discountValue) / 100;
    }

    if (coupon.maxDiscountValue != null) {
      discount = Math.min(discount, coupon.maxDiscountValue);
    }

    return Math.min(Math.max(discount, 0), subtotal);
  }, [appliedCoupon, subtotal]);

  const grandTotal = useMemo(() => {
    if (appliedCoupon?.totalAmount != null) {
      return Math.max(Number(appliedCoupon.totalAmount) || 0, 0);
    }
    return Math.max(subtotal - discountAmount, 0);
  }, [appliedCoupon, subtotal, discountAmount]);
  const couponPreview = useMemo(() => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return null;

    return (availableCoupons.length ? availableCoupons : builtinCoupons).find((item) => item.code === code) || null;
  }, [availableCoupons, couponCode]);

  const formatCouponType = (coupon) => {
    if (!coupon) return '';
    if (coupon.discountType === 'AMOUNT' || coupon.discountType === 'FIXED') return `Giảm ${formatCurrency(coupon.discountValue)}`;
    return `Giảm ${coupon.discountValue}%`;
  };

  const couponPreviewStatus = useMemo(() => {
    if (!couponPreview) return null;

    const issues = [];
    if (couponPreview.active === false) issues.push('Mã đang ngừng sử dụng');
    if (couponPreview.quantity != null && couponPreview.quantity <= 0) issues.push('Đã hết lượt dùng');
    if (couponPreview.minOrderValue && subtotal < couponPreview.minOrderValue) {
      issues.push(`Cần đơn tối thiểu ${formatCurrency(couponPreview.minOrderValue)}`);
    }

    return issues;
  }, [couponPreview, subtotal]);

  const handleQuantityChange = async (detail, nextQuantity) => {
    if (!detail?.id || nextQuantity < 1) return;

    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/cartDetails/${detail.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: nextQuantity,
          product: { id: detail.productId },
          cart: { id: cart?.id },
        }),
      });

      if (!response.ok) {
      throw new Error('Cập nhật số lượng thất bại');
      }

      setDetails((current) => current.map((item) => (item.id === detail.id ? { ...item, quantity: nextQuantity } : item)));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Không thể cập nhật số lượng.' });
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (detailId) => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/cartDetails/${detailId}`, { method: 'DELETE' });
      if (!response.ok) {
      throw new Error('Xóa sản phẩm thất bại');
      }

      setDetails((current) => current.filter((item) => item.id !== detailId));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Không thể xóa sản phẩm.' });
    } finally {
      setUpdating(false);
    }
  };

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Vui lòng nhập mã giảm giá.');
      setAppliedCoupon(null);
      return;
    }

    setCouponLoading(true);
    setCouponMessage('');

    try {
      const response = await fetchJson(`${API_BASE_URL}/coupons/validate?code=${encodeURIComponent(code)}&amount=${subtotal}`);
      const validatedCoupon = response?.coupon ? normalizeCoupon(response.coupon) : null;

      if (!validatedCoupon) {
        setAppliedCoupon(null);
        setCouponMessage('Mã giảm giá không hợp lệ.');
        return;
      }

      setAppliedCoupon({
        ...validatedCoupon,
        discountAmount: Number(response.discountAmount) || 0,
        totalAmount: Number(response.totalAmount) || subtotal,
      });
      setCouponMessage(response.message || `Đã áp dụng mã ${validatedCoupon.code}.`);
      notify({ type: 'success', message: `Áp dụng mã ${validatedCoupon.code} thành công.` });
    } finally {
      setCouponLoading(false);
    }
  };

  async function refreshAddressLabel(address) {
    const text = buildAddressLabel(address);
    if (!text || !isPlaceholderAddressText(text)) return address;

    const coordsMatch = text.match(/\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/);
    if (!coordsMatch) return address;

    try {
      const resolved = await reverseGeocodeAddress(coordsMatch[1], coordsMatch[2]);
      const displayLabel = resolved.displayLabel || buildAddressLabel(resolved);
      return {
        ...address,
        street: resolved.street || address.street,
        ward: resolved.ward || address.ward,
        district: resolved.district || address.district,
        city: resolved.city || address.city,
        country: resolved.country || address.country,
        label: displayLabel,
        displayLabel,
      };
    } catch {
      return address;
    }
  }

  const clearCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponMessage('');
  };

  const resolveAddress = async () => {
    const receiverName = String(addressForm.receiverName || '').trim();
    const receiverPhone = String(addressForm.receiverPhone || '').trim();

    if (!receiverName) {
      throw new Error('Vui lòng nhập tên người nhận');
    }

    if (!receiverPhone) {
      throw new Error('Vui lòng nhập số điện thoại người nhận');
    }

    if (selectedAddressId) {
      const selectedAddress = addresses.find((item) => item.id === selectedAddressId) || null;
      if (!selectedAddress) {
        throw new Error('Vui lòng chọn địa chỉ nhận hàng');
      }

      return {
        ...selectedAddress,
        receiverName,
        receiverPhone,
      };
    }

    const requiredFields = ['street', 'ward', 'district', 'city'];
    const hasMissingField = requiredFields.some((field) => !String(addressForm[field] || '').trim());

    if (hasMissingField) {
      throw new Error('Vui lòng nhập đầy đủ địa chỉ nhận hàng');
    }

    if (!saveAddress) {
      return {
        ...addressForm,
        label: buildAddressLabel(addressForm),
        receiverName,
        receiverPhone,
      };
    }

    const response = await fetch(`${API_BASE_URL}/users/${user.id}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...addressForm,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Không thể lưu địa chỉ mới');
    }

    const savedAddress = await response.json();
    const normalizedAddress = {
      ...savedAddress,
      label: buildAddressLabel(savedAddress),
      receiverName,
      receiverPhone,
    };

    setAddresses((current) => [...current, normalizedAddress]);
    setSelectedAddressId(normalizedAddress.id);

    return normalizedAddress;
  };

  const createOrderAndSyncCart = async ({ shippingAddress, paymentStatus, orderStatus }) => {
    const couponNote = appliedCoupon ? `Mã giảm giá: ${appliedCoupon.code}` : '';

    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: { id: user.id },
        address: shippingAddress.label || buildAddressLabel(shippingAddress),
        status: orderStatus,
        paymentStatus,
        originalAmount: subtotal,
        discountAmount,
        totalAmount: grandTotal,
        customerName: shippingAddress.receiverName || null,
        customerPhone: shippingAddress.receiverPhone || null,
        couponCode: appliedCoupon?.code || null,
        couponTitle: appliedCoupon?.title || null,
        note: couponNote,
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Tạo đơn hàng thất bại');
    }

    const order = await orderResponse.json();

    await Promise.all(
      details.map(async (item) => {
        const createDetailResponse = await fetch(`${API_BASE_URL}/orderDetails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: item.quantity,
            product: { id: item.productId },
            order: { id: order.id },
          }),
        });

        if (!createDetailResponse.ok) {
          throw new Error('Không thể tạo chi tiết đơn hàng');
        }

        const deleteResponse = await fetch(`${API_BASE_URL}/cartDetails/${item.id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error('Không thể xóa giỏ hàng sau khi đặt');
        }
      })
    );

    return order;
  };


  const handleCheckout = async () => {
    if (!user?.id) {
      notify({ type: 'error', message: 'Vui lòng đăng nhập để đặt hàng.' });
      return;
    }

    if (!details.length) {
      notify({ type: 'error', message: 'Giỏ hàng đang trống.' });
      return;
    }

    try {
      const shippingAddress = await resolveAddress();

      if (paymentMethod === 'ZALOPAY') {
        const zalopayResponse = await fetch(`${API_BASE_URL}/zalopay/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(grandTotal),
            appUser: String(user.id),
            orderInfo: `Thanh toán đơn hàng của ${user.fullName || user.username || 'khách hàng'}`,
          }),
        });

        const zalopayData = await zalopayResponse.json().catch(() => null);
        if (!zalopayResponse.ok) {
          throw new Error(zalopayData?.message || zalopayData || 'Không tạo được thanh toán ZaloPay.');
        }

        const orderUrl = zalopayData?.order_url || zalopayData?.orderUrl;
        const transactionToken = zalopayData?.zp_trans_token || zalopayData?.transaction_token;
        if (orderUrl) {
          window.open(orderUrl, '_blank', 'noopener,noreferrer');
        } else if (!transactionToken) {
          throw new Error('ZaloPay không trả về link thanh toán.');
        }

        const order = await createOrderAndSyncCart({
          shippingAddress,
          paymentStatus: 'PENDING',
          orderStatus: 'Chờ thanh toán',
        });

        setLastOrder({
          id: order.id,
          address: shippingAddress.label || buildAddressLabel(shippingAddress),
          total: grandTotal,
        });
        setDetails([]);
        setAddressForm(makeEmptyAddressForm(user));
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponMessage('');
        window.dispatchEvent(new Event('cart-updated'));
        notify({ message: `Đã mở ZaloPay và tạo đơn hàng. Mã đơn #${order.id}` });
      } else {
        const order = await createOrderAndSyncCart({
          shippingAddress,
          paymentStatus: 'COD',
          orderStatus: 'Chờ xác nhận',
        });

        setLastOrder({
          id: order.id,
          address: shippingAddress.label || buildAddressLabel(shippingAddress),
          total: grandTotal,
        });
        setDetails([]);
        setAddressForm(makeEmptyAddressForm(user));
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponMessage('');
        window.dispatchEvent(new Event('cart-updated'));
        notify({ message: `Đặt hàng thành công. Mã đơn #${order.id}` });
      }
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Thanh toán thất bại.' });
    }
  };

  const handleZaloPayError = (error) => {
    notify({ type: 'error', message: error?.message || 'Không mở được ZaloPay sandbox.' });
  };


  if (loading) return <div className="py-10 text-center text-gray-600">Đang tải giỏ hàng...</div>;

  if (!user?.id) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-800">Giỏ hàng</h1>
        <p className="mb-6 text-gray-600">Vui lòng đăng nhập để xem giỏ hàng và thanh toán.</p>
        <Link
          to="/login"
          className="inline-flex rounded-full bg-primary px-6 py-2 font-bold text-white transition-all hover:bg-red-700"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (error) return <div className="py-10 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Giỏ hàng của bạn</h1>
            <p className="mt-1 text-gray-500">
              {totalQuantity} sản phẩm đang được giữ trong giỏ, sẵn sàng để tạo đơn hàng.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-red-50"
          >
            &larr; Tiếp tục mua hàng
          </Link>
        </div>

        {lastOrder && (
          <div className="mb-6 rounded-3xl border border-green-200 bg-green-50 p-5 text-green-800">
            <div className="text-lg font-bold">Đơn hàng mới đã được tạo thành công</div>
            <div className="mt-2 text-sm">
              Mã đơn: #{lastOrder.id} • Tổng tiền: {formatCurrency(lastOrder.total)} • Giao đến: {lastOrder.address}
            </div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {details.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="font-medium text-gray-600">Giỏ hàng hiện đang trống.</p>
                  <Link
                    to="/products"
                    className="mt-5 inline-flex rounded-full bg-primary px-6 py-2 font-bold text-white transition-all hover:bg-red-700"
                  >
                    Mua ngay
                  </Link>
                </div>
              ) : (
                details.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b p-5 last:border-b-0">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="h-28 w-28 rounded-2xl bg-gray-50 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Giá gốc: {item.product.priceLabel}</p>
                      <p className="mt-2 text-xl font-bold text-primary">
                        {formatCurrency(parseCurrency(item.product.price) * item.quantity)}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-50 disabled:opacity-50"
                          disabled={updating || item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-10 text-center font-semibold">{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-50 disabled:opacity-50"
                          disabled={updating}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 transition hover:text-red-700"
                      disabled={updating}
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" size={18} />
                <h2 className="text-xl font-bold text-gray-900">Địa chỉ nhận hàng</h2>
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">Địa chỉ hiện tại</div>
                <div className="mt-1 leading-7">
                  {buildAddressLabel(addressForm) || 'Chưa xác định. Hãy chọn địa chỉ đã lưu hoặc bấm lấy vị trí hiện tại.'}
                </div>
                <div className="mt-2 text-slate-500">
                  {addressForm.receiverName || user?.fullName || user?.username || 'Chưa có tên người nhận'} ·{' '}
                  {addressForm.receiverPhone || user?.numphone || 'Chưa có số điện thoại'}
                </div>
              </div>

              {addresses.length > 0 && (
                <div className="mt-5 grid gap-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        selectedAddressId === address.id ? 'border-primary bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{address.label}</div>
                          <div className="mt-1 text-sm text-gray-500">Địa chỉ đã lưu cho tài khoản này.</div>
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSelectedAddressId(null)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      selectedAddressId === null ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    Sử dụng địa chỉ mới
                  </button>
                </div>
              )}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      notify({ type: 'error', message: 'Trình duyệt không hỗ trợ định vị.' });
                      return;
                    }

                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;

                        reverseGeocodeAddress(lat, lng)
                          .then((resolved) => {
                            setSelectedAddressId(null);
                            setAddressForm((cur) => ({
                              ...cur,
                              street: resolved.street || cur.street,
                              ward: resolved.ward || cur.ward,
                              district: resolved.district || cur.district,
                              city: resolved.city || cur.city,
                              country: resolved.country || cur.country,
                            }));

                            notify({ type: 'success', message: 'Đã lấy địa chỉ từ vị trí hiện tại.' });
                          })
                          .catch(() => {
                            setSelectedAddressId(null);
                            setAddressForm((cur) => ({
                              ...cur,
                              street: `Vị trí hiện tại (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
                              ward: cur.ward || '',
                              district: cur.district || '',
                              city: cur.city || 'Ho Chi Minh',
                              country: cur.country || 'Việt Nam',
                            }));

                            notify({
                              type: 'error',
                              message: 'Không lấy được địa chỉ cụ thể, đã giữ lại tọa độ để bạn kiểm tra.',
                            });
                          });
                      },
                      (err) => {
                        notify({ type: 'error', message: err.message || 'Không thể lấy vị trí hiện tại.' });
                      },
                      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
                    );
                  }}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Lấy địa chỉ hiện tại
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Mã giảm giá</h2>
              <p className="mt-2 text-sm text-gray-500">Nhập mã để được áp dụng ưu đãi ngay trên tổng đơn.</p>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 text-sm font-semibold text-slate-700">Phương thức thanh toán</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      paymentMethod === 'COD'
                        ? 'border-primary bg-red-50 text-primary'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary'
                    }`}
                  >
                    <div className="font-bold">Thanh toán khi nhận hàng</div>
                    <div className="mt-1 text-xs font-normal text-slate-500">COD, xác nhận đơn ngay.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ZALOPAY')}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      paymentMethod === 'ZALOPAY'
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-sky-500'
                    }`}
                  >
                    <div className="font-bold">ZaloPay</div>
                    <div className="mt-1 text-xs font-normal text-slate-500">Thanh toán trực tuyến.</div>
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      className="auth-input pl-10"
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary disabled:opacity-60"
                    disabled={couponLoading}
                  >
                    {couponLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                </div>

                {couponPreview && (
                  <div
                    className={`rounded-2xl border p-4 ${
                      couponPreviewStatus?.length
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-sky-200 bg-sky-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{couponPreview.code}</div>
                        <div className="mt-1 text-sm text-slate-600">{couponPreview.title}</div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                        {formatCouponType(couponPreview)}
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-slate-700">
                      {couponPreview.minOrderValue != null && (
                        <div>Đơn tối thiểu: {formatCurrency(couponPreview.minOrderValue)}</div>
                      )}
                      {couponPreview.maxDiscountValue != null && (
                        <div>Giảm tối đa: {formatCurrency(couponPreview.maxDiscountValue)}</div>
                      )}
                      {couponPreview.quantity != null && <div>Lượt còn lại: {couponPreview.quantity}</div>}
                      {couponPreview.active === false && <div className="font-semibold text-amber-700">Mã hiện đang tạm khóa</div>}
                    </div>

                    {couponPreviewStatus?.length ? (
                      <div className="mt-3 rounded-xl bg-white/80 p-3 text-sm text-amber-800 ring-1 ring-amber-100">
                        {couponPreviewStatus.join(' • ')}
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl bg-white/80 p-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                        Mã này có thể áp dụng với giá trị đơn hiện tại.
                      </div>
                    )}
                  </div>
                )}

                {appliedCoupon ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-sm font-bold text-emerald-800">{appliedCoupon.code}</div>
                    <div className="mt-1 text-sm text-emerald-700">{appliedCoupon.title}</div>
                    <button
                      type="button"
                      onClick={clearCoupon}
                      className="mt-3 text-sm font-semibold text-emerald-800 underline"
                    >
                      Bỏ mã
                    </button>
                  </div>
                ) : null}

                {couponMessage && <div className="text-sm text-slate-600">{couponMessage}</div>}

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-700">Mã gợi ý</div>
                  <div className="flex flex-wrap gap-2">
                    {(availableCoupons.length ? availableCoupons : builtinCoupons).slice(0, 3).map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setCouponCode(item.code)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-primary hover:text-primary"
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{formatPriceStaticDot000(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Giảm giá</span>
                  <span className={`font-semibold ${discountAmount > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                    - {formatPriceStaticDot000(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Số lượng sản phẩm</span>
                  <span className="font-semibold">{totalQuantity}</span>
                </div>
                {paymentMethod === 'ZALOPAY' && (
                  <ZaloPayButton
                    amount={grandTotal}
                    orderInfo={`Thanh toán đơn hàng tạm - ${user?.id || 'guest'}`}
                    appUser={String(user?.id || 'guest')}
                    onError={handleZaloPayError}
                  />
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className={`block w-full rounded-2xl py-4 text-center font-semibold transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-primary text-white hover:bg-red-700'
                      : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  {paymentMethod === 'COD' ? 'Đặt hàng COD' : 'Mở thanh toán ZaloPay'}
                </button>

                <Link
                  to="/products"
                  className="block w-full rounded-2xl border border-red-600 py-4 text-center font-semibold text-red-600 transition-all hover:bg-red-50"
                >
                  Tiếp tục mua hàng
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                Đơn hàng sau khi tạo sẽ được lưu vào hệ thống backend qua các bảng: order, order_details và address.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;



