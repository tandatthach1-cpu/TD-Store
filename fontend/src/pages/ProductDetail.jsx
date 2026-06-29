import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  ChevronRight,
  Copy,
  CreditCard,
  Heart,
  Gift,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Store,
  Star,
  TicketPercent,
  Truck,
  Send,
} from 'lucide-react';
import ProductCard from '../components/home/ProductCard';
import { notify } from '../utils/notifications';
import {
  API_BASE_URL,
  AUTH_CHANGE_EVENT,
  fetchJson,
  formatCurrency,
  getCurrentUser,
  getImageUrl,
  normalizeProduct,
} from '../utils/storefront';
import { isWishlisted, toggleWishlistItem, WISHLIST_CHANGE_EVENT } from '../utils/wishlist';

const camKetMacDinh = [
  'Hàng chính hãng, nguồn gốc rõ ràng và có hỗ trợ xuất hóa đơn khi cần.',
  'Kiểm tra ngoại hình, kích hoạt cơ bản và hỗ trợ đồng bộ dữ liệu tại cửa hàng.',
  'Giao nhanh toàn quốc, có tư vấn trước và sau mua trong suốt quá trình sử dụng.',
];

const danhSachMauMacDinh = ['Đen', 'Bạc', 'Xanh'];
const dungLuongMacDinh = ['128GB', '256GB', '512GB'];

const chinhSachMuaHang = [
  {
    icon: <ShieldCheck size={18} />,
    title: 'Bảo hành minh bạch',
    description: 'Hỗ trợ bảo hành chính hãng và hướng dẫn tiếp nhận nhanh khi cần.',
  },
  {
    icon: <Truck size={18} />,
    title: 'Giao hàng toàn quốc',
    description: 'Kiểm tra sản phẩm trước khi nhận, ưu tiên giao nhanh nội thành.',
  },
  {
    icon: <CreditCard size={18} />,
    title: 'Thanh toán linh hoạt',
    description: 'Hỗ trợ chuyển khoản, COD và tư vấn trả góp theo nhu cầu.',
  },
];

const resolveProductImages = (product) => {
  const primaryImage = product?.photo ? getImageUrl('products', product.photo) : '';
  const galleryImages = Array.isArray(product?.images)
    ? product.images
        .map((item) => {
          if (typeof item === 'string') return getImageUrl('products', item);
          if (item?.imageUrl) return getImageUrl('products', item.imageUrl);
          return '';
        })
        .filter(Boolean)
    : [];

  return Array.from(new Set([primaryImage, ...galleryImages].filter(Boolean)));
};

const tachNoiDung = (value) =>
  String(value || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const tachYChinh = (value) =>
  String(value || '')
    .split(/[.!?]\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeReview = (review) => ({
  ...review,
  id: review?.id ?? crypto.randomUUID(),
  orderId: review?.orderId ?? review?.order?.id ?? null,
  rating: Number(review?.rating) || 5,
  comment: review?.comment || '',
  createdAt: review?.createdAt || review?.created_at || null,
  userName: review?.user?.username || review?.user?.fullName || review?.username || 'Khách hàng',
  approved: review?.approved !== false,
});

const formatReviewDate = (value) => {
  if (!value) return 'Vừa xong';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Vừa xong' : date.toLocaleDateString('vi-VN');
};

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={index < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
    />
  ));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('tong-quan');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewEligibility, setReviewEligibility] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await fetchJson(`${API_BASE_URL}/products/${id}`);
        const images = resolveProductImages(data);
        const originalPrice = Number(data.originalPrice ?? data.price) || Number(data.price) || 0;
        const price = Number(data.price) || 0;

        const normalized = {
          id: data.id,
          name: data.title || data.name || 'Sản phẩm',
          description: data.description || '',
          detailedDescription: data.detailedDescription || '',
          price,
          originalPrice,
          priceLabel: formatCurrency(price),
          originalPriceLabel: formatCurrency(originalPrice),
          img: getImageUrl('products', data.photo),
          category: data.category?.title || '',
          categoryId: data.category?.id || data.categoryId || null,
          brand: data.brand?.name || '',
          brandId: data.brand?.id || data.brandId || null,
          stockQuantity: Number(data.stockQuantity) || 0,
          featured: Boolean(data.featured),
          bestSeller: Boolean(data.bestSeller),
          images,
        };

        setProduct(normalized);
        setMainImage(images[0] || normalized.img);
        setSelectedColor(danhSachMauMacDinh[0]);
        setSelectedStorage(dungLuongMacDinh[0]);
        setQuantity(1);
        setActiveTab('tong-quan');
        setWishlisted(isWishlisted(normalized.id));

        try {
          const suggestionData = await fetchJson(`${API_BASE_URL}/products/suggestions/${id}?limit=4`);
          setSuggestions(suggestionData.map(normalizeProduct));
        } catch {
          setSuggestions([]);
        }

        try {
          setReviewsLoading(true);
          const reviewData = await fetchJson(`${API_BASE_URL}/productReviews/product/${id}`);
          setReviews((Array.isArray(reviewData) ? reviewData : []).map(normalizeReview));
        } catch (reviewErr) {
          setReviews([]);
          setReviewsError(reviewErr.message || 'Không thể tải đánh giá');
        } finally {
          setReviewsLoading(false);
        }

        const currentUser = getCurrentUser();
        if (currentUser?.id) {
          try {
            const eligibility = await fetchJson(
              `${API_BASE_URL}/productReviews/product/${id}/eligibility?userId=${currentUser.id}`
            );
            const normalizedEligibilityReview = eligibility?.review ? normalizeReview(eligibility.review) : null;
            setReviewEligibility({
              canReview: Boolean(eligibility?.canReview ?? eligibility?.eligible),
              eligible: Boolean(eligibility?.eligible ?? eligibility?.canReview),
              message:
                eligibility?.message || 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.',
              orderId: eligibility?.orderId ?? null,
              review: normalizedEligibilityReview,
            });
            if (normalizedEligibilityReview) {
              setReviewForm({
                rating: Number(normalizedEligibilityReview.rating) || 5,
                comment: normalizedEligibilityReview.comment || '',
              });
            } else {
              setReviewForm({ rating: 5, comment: '' });
            }
          } catch {
            setReviewEligibility({
              canReview: false,
              eligible: false,
              message: 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.',
              orderId: null,
              review: null,
            });
            setReviewForm({ rating: 5, comment: '' });
          }
        } else {
          setReviewEligibility({
            canReview: false,
            eligible: false,
            message: 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.',
            orderId: null,
            review: null,
          });
          setReviewForm({ rating: 5, comment: '' });
        }
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const syncWishlist = () => {
      if (product?.id == null) return;
      setWishlisted(isWishlisted(product.id));
    };

    syncWishlist();
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
    window.addEventListener('storage', syncWishlist);
    window.addEventListener(AUTH_CHANGE_EVENT, syncWishlist);

    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncWishlist);
    };
  }, [product?.id]);

  const images = useMemo(() => {
    if (!product) return [];
    return product.images?.length ? product.images : [product.img].filter(Boolean);
  }, [product]);

  const mucTietKiem = useMemo(() => {
    if (!product) return 0;
    return Math.max(0, product.originalPrice - product.price);
  }, [product]);

  const phanTramGiam = useMemo(() => {
    if (!product || !product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product]);

  const mucNoiBat = useMemo(() => {
    if (!product) return camKetMacDinh;

    const danhSach = [
      ...tachYChinh(product.description),
      ...tachYChinh(product.detailedDescription),
      ...camKetMacDinh,
    ];

    return Array.from(new Set(danhSach)).slice(0, 4);
  }, [product]);

  const doanChiTiet = useMemo(() => {
    if (!product) return [];
    const danhSach = tachNoiDung(product.detailedDescription);
    if (danhSach.length) return danhSach;
    return tachNoiDung(product.description);
  }, [product]);

  const thongTinNhanh = useMemo(() => {
    if (!product) return [];

    return [
      { label: 'Mã sản phẩm', value: `SP-${String(product.id).padStart(4, '0')}` },
      { label: 'Danh mục', value: product.category || 'Đang cập nhật' },
      { label: 'Thương hiệu', value: product.brand || 'Đang cập nhật' },
      {
        label: 'Tình trạng',
        value: product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Tạm hết hàng',
      },
      { label: 'Màu đang chọn', value: selectedColor },
      { label: 'Dung lượng', value: selectedStorage },
    ];
  }, [product, selectedColor, selectedStorage]);

  const reviewStats = useMemo(() => {
    const visibleReviews = reviews.filter((item) => item?.approved !== false);
    const totalReviews = visibleReviews.length;
    const averageRating = totalReviews
      ? visibleReviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / totalReviews
      : 0;

    return {
      visibleReviews,
      totalReviews,
      averageRating,
    };
  }, [reviews]);

  const hasReviewPermission = Boolean(reviewEligibility?.canReview);
  const reviewFormLabel = reviewEligibility?.review?.id ? 'Cập nhật đánh giá' : 'Gửi đánh giá';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify({ message: 'Đã sao chép liên kết sản phẩm.' });
    } catch {
      notify({ type: 'error', message: 'Không thể sao chép liên kết lúc này.' });
    }
  };

  const handleWishlistToggle = () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      notify({ type: 'error', message: 'Vui lòng đăng nhập để thêm sản phẩm yêu thích.' });
      navigate('/login');
      return;
    }

    toggleWishlistItem(product);
    setWishlisted((current) => !current);
  };

  const handleAddToCart = async (goToCart = false) => {
    if (!product) return;

    const maxQuantity = Number(product.stockQuantity) || 0;
    const safeQuantity = maxQuantity > 0 ? Math.min(Math.max(1, Number(quantity) || 1), maxQuantity) : 0;

    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      notify({ type: 'error', message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.' });
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      const carts = await fetchJson(`${API_BASE_URL}/carts/user/${currentUser.id}`);
      let cartId = carts[0]?.id;

      if (!cartId) {
        const createRes = await fetch(`${API_BASE_URL}/carts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id }),
        });

        if (!createRes.ok) {
          throw new Error('Tạo giỏ hàng thất bại');
        }

        const newCart = await createRes.json();
        cartId = newCart.id;
      }

      let existingDetail = null;
      try {
        const detailList = await fetchJson(`${API_BASE_URL}/cartDetails/cart/${cartId}`);
        existingDetail = detailList.find((item) => item.product?.id === product.id) || null;
      } catch {
        existingDetail = null;
      }

      let response;
      if (existingDetail) {
        const currentInCart = Number(existingDetail.quantity || 0);
        const nextQuantity = Math.min(currentInCart + safeQuantity, maxQuantity || currentInCart + safeQuantity);
        response = await fetch(`${API_BASE_URL}/cartDetails/${existingDetail.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...existingDetail,
            quantity: nextQuantity,
          }),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/cartDetails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: safeQuantity,
            product: { id: product.id },
            cart: { id: cartId },
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Thêm vào giỏ hàng thất bại');
      }

      window.dispatchEvent(new Event('cart-updated'));
      notify({ message: 'Đã thêm sản phẩm vào giỏ hàng.' });

      if (goToCart) {
        navigate('/cart');
      }
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Không thể thêm vào giỏ hàng.' });
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!product?.id) return;

    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      notify({ type: 'error', message: 'Vui lòng đăng nhập để gửi đánh giá.' });
      navigate('/login');
      return;
    }

    if (!hasReviewPermission) {
      notify({
        type: 'error',
        message: reviewEligibility?.message || 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.',
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      notify({ type: 'error', message: 'Vui lòng nhập nội dung đánh giá.' });
      return;
    }

    setReviewSubmitting(true);
    try {
      const existingReviewId = reviewEligibility?.review?.id ?? null;
      const payload = {
        product: { id: product.id },
        productId: product.id,
        rating: Number(reviewForm.rating) || 5,
        comment: reviewForm.comment.trim(),
        approved: reviewEligibility?.review?.approved ?? true,
      };

      payload.user = { id: currentUser.id };
      payload.userId = currentUser.id;

      if (reviewEligibility?.orderId) {
        payload.order = { id: reviewEligibility.orderId };
        payload.orderId = reviewEligibility.orderId;
      }

      const response = await fetch(
        existingReviewId ? `${API_BASE_URL}/productReviews/${existingReviewId}` : `${API_BASE_URL}/productReviews`,
        {
          method: existingReviewId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Không thể gửi đánh giá (${response.status})`);
      }

      const created = await response.json();
      const normalizedReview = normalizeReview(created);
      setReviews((current) => [normalizedReview, ...current.filter((item) => item.id !== normalizedReview.id)]);
      setReviewEligibility((current) =>
        current
          ? {
              ...current,
              review: normalizedReview,
              canReview: true,
              eligible: true,
              message: 'Bạn đã gửi đánh giá cho đơn hàng này. Bạn có thể cập nhật lại nội dung.',
            }
          : current
      );
      setReviewForm({
        rating: Number(normalizedReview.rating) || 5,
        comment: normalizedReview.comment || '',
      });
      notify({ message: existingReviewId ? 'Đã cập nhật đánh giá của bạn.' : 'Đã gửi đánh giá của bạn.' });
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Không thể gửi đánh giá lúc này.' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-600">Đang tải dữ liệu sản phẩm...</div>;
  if (error) return <div className="py-12 text-center text-red-500">Lỗi: {error}</div>;
  if (!product) return <div className="py-12 text-center text-gray-500">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_38%,#ffffff_100%)] pb-16">
      <section className="border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={14} />
            <Link to="/products" className="transition hover:text-primary">
              Sản phẩm
            </Link>
            {product.category && (
              <>
                <ChevronRight size={14} />
                <Link to={product.categoryId ? `/category/${product.categoryId}` : '/products'} className="transition hover:text-primary">
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-800">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="theme-card relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {product.bestSeller && (
                  <span className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/20">
                    Bán chạy
                  </span>
                )}
                {product.featured && (
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow-lg shadow-primary/20">
                    Nổi bật
                  </span>
                )}
                {phanTramGiam > 0 && (
                  <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/20">
                    Giảm {phanTramGiam}%
                  </span>
                )}
              </div>

              <div className="rounded-[1.6rem] bg-transparent p-6">
                <img
                  src={mainImage || images[0]}
                  alt={product.name}
                  className="mx-auto aspect-square max-h-[560px] w-full object-contain bg-transparent"
                />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-3xl bg-slate-950 px-5 py-4 text-white">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200">Bộ ảnh sản phẩm</div>
                  <div className="mt-1 text-sm text-slate-200">Có {images.length} ảnh để xem chi tiết nhiều góc.</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/15"
                >
                  <Copy size={16} />
                  Sao chép liên kết
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setMainImage(image)}
                  className={`overflow-hidden rounded-[1.4rem] border bg-white p-2 shadow-sm transition ${
                    (mainImage || images[0]) === image
                      ? 'border-primary ring-2 ring-primary/15'
                      : 'border-gray-200 hover:border-primary/40'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="aspect-square w-full object-contain" />
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {chinhSachMuaHang.map((item) => (
                <div
                  key={item.title}
                  className="theme-card rounded-[1.7rem] border border-white/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-black text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="theme-card overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="bg-[linear-gradient(135deg,#0f172a,#1e1b4b,#7f1d1d)] px-7 py-7 text-white">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100">
                  <Sparkles size={15} />
                  Trang chi tiết sản phẩm
                </div>
                <h1 className="mt-4 text-3xl font-black leading-tight">{product.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                  {product.description || 'Thông tin mô tả ngắn đang được cập nhật thêm.'}
                </p>
              </div>

              <div className="space-y-7 px-7 py-7">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <div className="text-4xl font-black text-primary">{product.priceLabel}</div>
                    {product.originalPrice > product.price && (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="text-base text-gray-400 line-through">{product.originalPriceLabel}</span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          Tiết kiệm {formatCurrency(mucTietKiem)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <div className="font-bold">{product.stockQuantity > 0 ? 'Sẵn hàng' : 'Tạm hết hàng'}</div>
                    <div className="mt-1 text-xs">{product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Vui lòng liên hệ để được tư vấn thêm'}</div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-700">
                      <TicketPercent size={17} />
                      Ưu đãi hôm nay
                    </div>
                    <p className="mt-2 text-sm leading-6 text-rose-900">
                      Giữ giá tốt, có thể áp thêm mã giảm giá nếu đơn hàng đủ điều kiện.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-sky-100 bg-sky-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-700">
                      <Gift size={17} />
                      Hỗ trợ sau mua
                    </div>
                    <p className="mt-2 text-sm leading-6 text-sky-900">
                      Hướng dẫn thiết lập máy mới, sao lưu và đồng bộ cơ bản khi nhận hàng.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Chọn màu sắc</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {danhSachMauMacDinh.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedColor(item)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          selectedColor === item
                            ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Chọn dung lượng</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {dungLuongMacDinh.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedStorage(item)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          selectedStorage === item
                            ? 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-slate-400'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200">Tùy chọn đang chọn</div>
                      <div className="mt-2 text-lg font-bold">
                        {selectedColor} • {selectedStorage}
                      </div>
                    </div>
                    <Store size={18} className="mt-1 text-red-200" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {thongTinNhanh.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300">{item.label}</div>
                        <div className="mt-1 text-sm font-semibold text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Số lượng</div>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                        className="h-10 w-10 rounded-full bg-white text-lg font-bold text-gray-700 shadow-sm transition hover:bg-gray-100"
                        disabled={product.stockQuantity <= 0}
                      >
                        -
                      </button>
                      <span className="min-w-12 text-center text-base font-black text-gray-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((current) => Math.min(current + 1, Number(product.stockQuantity) || 1))}
                        className="h-10 w-10 rounded-full bg-white text-lg font-bold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={product.stockQuantity <= 0 || quantity >= product.stockQuantity}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      Tổng tạm tính:{' '}
                      <span className="font-bold text-gray-900">{formatCurrency(product.price * quantity)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(false)}
                    disabled={adding || product.stockQuantity <= 0}
                    className="rounded-[1.2rem] bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {product.stockQuantity <= 0 ? 'Hết hàng' : adding ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={adding || product.stockQuantity <= 0}
                    className="rounded-[1.2rem] border border-slate-950 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {product.stockQuantity <= 0 ? 'Hết hàng' : 'Mua ngay'}
                  </button>
                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`rounded-[1.2rem] px-6 py-4 text-sm font-bold transition ${
                      wishlisted
                        ? 'border border-rose-300 bg-rose-50 text-rose-700'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
                      {wishlisted ? 'Đã lưu' : 'Yêu thích'}
                    </span>
                  </button>
                </div>

                <div className="rounded-[1.8rem] border border-gray-100 bg-gray-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <BadgeCheck size={18} className="text-primary" />
                    Lý do nên chọn sản phẩm này
                  </div>
                  <div className="mt-4 space-y-3">
                    {mucNoiBat.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-7 text-gray-700">
                        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="theme-card mt-12 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap gap-3 border-b border-gray-100 pb-5">
            {[
              { id: 'tong-quan', label: 'Tổng quan' },
              { id: 'chi-tiet', label: 'Mô tả chi tiết' },
              { id: 'chinh-sach', label: 'Chính sách & hỗ trợ' },
              { id: 'danh-gia', label: 'Đánh giá' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'danh-gia') {
                    window.setTimeout(() => {
                      document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 0);
                  }
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'tong-quan' && (
            <div className="grid gap-6 pt-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Tổng quan sản phẩm</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
                  {product.description || 'Nội dung mô tả đang được cập nhật.'}
                </p>
              </div>

              <div className="theme-card rounded-[1.7rem] bg-[linear-gradient(135deg,#eff6ff,#ffffff)] p-5">
                <h3 className="text-lg font-black text-gray-900">Thông tin nhanh</h3>
                <div className="mt-4 divide-y divide-white/80 overflow-hidden rounded-3xl border border-white bg-white/80">
                  {thongTinNhanh.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                      <span className="font-medium text-gray-500">{item.label}</span>
                      <span className="text-right font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chi-tiet' && (
            <div className="grid gap-6 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Mô tả chi tiết</h2>
                <div className="mt-4 space-y-4">
                  {(doanChiTiet.length ? doanChiTiet : ['Thông tin chi tiết đang được cập nhật thêm.']).map((item) => (
                    <p key={item} className="text-sm leading-8 text-gray-600">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.7rem] bg-slate-950 p-6 text-white">
                <h3 className="text-xl font-black">Điểm nhấn nổi bật</h3>
                <div className="mt-5 space-y-4">
                  {mucNoiBat.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chinh-sach' && (
            <div className="grid gap-5 pt-6 md:grid-cols-2 xl:grid-cols-3">
              {[
                'Đổi trả theo điều kiện áp dụng của cửa hàng và tình trạng sản phẩm thực tế.',
                'Hỗ trợ xuất hóa đơn, tư vấn cấu hình và phụ kiện phù hợp nếu khách có nhu cầu.',
                'Có thể kết hợp mã giảm giá hoặc ưu đãi theo từng thời điểm bán hàng.',
                'Hỗ trợ kiểm tra máy, sao chép dữ liệu cơ bản và hướng dẫn sử dụng ban đầu.',
                'Đội ngũ tư vấn đồng hành trước mua, trong mua và sau mua.',
                'Liên hệ nhanh qua trang Liên hệ để được báo giá, tư vấn hoặc kiểm tra tồn kho thực tế.',
              ].map((item) => (
                <div
                  key={item}
                  className="theme-card rounded-[1.7rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BadgeCheck size={18} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="product-reviews" className="theme-card mt-12 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Đánh giá sản phẩm</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900">Bình luận từ khách hàng</h2>
            </div>
            <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              {reviewStats.totalReviews} đánh giá
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="theme-card rounded-[1.8rem] border border-slate-100 bg-[linear-gradient(180deg,#fffdf7,#ffffff)] p-6">
              <div className="flex items-end gap-3">
                <div className="text-5xl font-black text-slate-950">{reviewStats.averageRating.toFixed(1)}</div>
                <div className="pb-1 text-sm font-semibold text-slate-500">/ 5</div>
              </div>
              <div className="mt-3 flex items-center gap-1">{renderStars(Math.round(reviewStats.averageRating))}</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Điểm trung bình được tính từ các đánh giá đã được hiển thị công khai.
              </p>

              {hasReviewPermission ? (
                <form onSubmit={handleSubmitReview} className="theme-card mt-6 space-y-4 rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">Đánh giá của bạn</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rating = index + 1;
                        const selected = rating <= Number(reviewForm.rating || 0);
                        return (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewForm((current) => ({ ...current, rating }))}
                            className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition ${
                              selected
                                ? 'border-amber-400 bg-amber-400 text-white shadow-lg shadow-amber-200'
                                : 'border-slate-200 bg-white text-slate-300 hover:border-amber-300 hover:text-amber-400'
                            }`}
                            aria-label={`${rating} sao`}
                          >
                            <Star size={18} className={selected ? 'fill-current' : ''} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-slate-700">
                      Nội dung bình luận
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewForm.comment}
                      onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                      rows={5}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Chia sẻ cảm nhận của bạn về sản phẩm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={16} />
                    {reviewSubmitting ? 'Đang gửi...' : reviewFormLabel}
                  </button>
                </form>
              ) : (
                <div className="theme-card mt-6 rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-5 text-sm leading-7 text-amber-900">
                  <p>{reviewEligibility?.message || 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.'}</p>
                  {!getCurrentUser()?.id && (
                    <Link
                      to="/login"
                      className="mt-3 inline-flex rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
                    >
                      Đăng nhập để kiểm tra đơn hàng
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {reviewsLoading && (
                <div className="theme-card rounded-[1.6rem] border border-slate-100 bg-slate-50 px-5 py-6 text-center text-sm text-slate-500">
                  Đang tải đánh giá...
                </div>
              )}

              {reviewsError && (
                <div className="theme-card rounded-[1.6rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                  {reviewsError}
                </div>
              )}

              {!reviewsLoading && !reviewStats.visibleReviews.length && !reviewsError && (
                <div className="theme-card rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  Chưa có đánh giá nào cho sản phẩm này.
                </div>
              )}

              {reviewStats.visibleReviews.map((review) => (
                <article key={review.id} className="theme-card rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{review.userName}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {formatReviewDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(Number(review.rating) || 5)}</div>
                  </div>
                  {review.comment && <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {suggestions.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Gợi ý thêm</div>
                <h2 className="mt-2 text-3xl font-black text-gray-900">Sản phẩm liên quan</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Những lựa chọn gần với sản phẩm bạn đang xem để so sánh nhanh hơn.
                </p>
              </div>
              <Link to="/products" className="text-sm font-bold text-primary transition hover:text-red-700">
                Xem toàn bộ sản phẩm →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {suggestions.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
