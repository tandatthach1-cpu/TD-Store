import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Headphones,
  LayoutDashboard,
  LogOut,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  User,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../utils/notifications';
import {
  API_BASE_URL,
  clearCurrentUser,
  fetchJson,
  getCurrentUser,
  getPageContent,
  normalizeProduct,
  AUTH_CHANGE_EVENT,
} from '../../utils/storefront';
import { WISHLIST_CHANGE_EVENT, getWishlistCount } from '../../utils/wishlist';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', href: '/products' },
  { label: 'Danh mục', href: '/category' },
  { label: 'Đánh giá', href: '/reviews' },
  { label: 'Đặt trước', href: '/preorder' },
  { label: 'Bảo hành', href: '/warranty' },
  { label: 'Liên hệ', href: '/contact' },
];

const quickTiles = [
  { label: 'Theo dõi đơn', href: '/orders', icon: LayoutDashboard },
  { label: 'Yêu thích', href: '/wishlist', icon: Heart },
  { label: 'Hỗ trợ nhanh', href: '/contact', icon: Headphones },
  { label: 'Mua ngay', href: '/products', icon: Sparkles },
];

const Header = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistCount());

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener('focus', syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);

    return () => {
      window.removeEventListener('focus', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setShowDropdown(false);
        setShowAccountMenu(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user?.id) {
        setCartCount(0);
        return;
      }

      try {
        const carts = await fetchJson(`${API_BASE_URL}/carts/user/${user.id}`);
        const firstCart = carts[0];

        if (!firstCart?.id) {
          setCartCount(0);
          return;
        }

        const detailsRes = await fetch(`${API_BASE_URL}/cartDetails/cart/${firstCart.id}`);
        if (detailsRes.status === 404 || !detailsRes.ok) {
          setCartCount(0);
          return;
        }

        const details = await detailsRes.json();
        const totalQuantity = (Array.isArray(details) ? details : []).reduce(
          (sum, item) => sum + (Number(item.quantity) || 0),
          0
        );
        setCartCount(totalQuantity);
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();
    window.addEventListener('cart-updated', fetchCartCount);
    window.addEventListener('focus', fetchCartCount);

    return () => {
      window.removeEventListener('cart-updated', fetchCartCount);
      window.removeEventListener('focus', fetchCartCount);
    };
  }, [user]);

  useEffect(() => {
    const syncWishlist = () => setWishlistCount(getWishlistCount());
    syncWishlist();
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
    window.addEventListener('storage', syncWishlist);
    window.addEventListener(AUTH_CHANGE_EVENT, syncWishlist);

    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncWishlist);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      const query = searchQuery.trim();
      if (!query) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const data = await fetchJson(`${API_BASE_URL}/products?page=0&size=100`, {
          signal: controller.signal,
        });
        const list = getPageContent(data).map(normalizeProduct);
        const keyword = query.toLowerCase();
        const filtered = list.filter((product) =>
          [product.name, product.category, product.description]
            .filter(Boolean)
            .some((text) => String(text).toLowerCase().includes(keyword))
        );

        setSearchResults(filtered.slice(0, 6));
        setShowDropdown(true);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    const timeoutId = window.setTimeout(loadProducts, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  const handleCartClick = (event) => {
    if (user?.id) return;

    event.preventDefault();
    notify({ type: 'error', message: 'Vui lòng đăng nhập để xem giỏ hàng.' });
    navigate('/login');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    setShowAccountMenu(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      <div className="border-b border-white/10 bg-white/5">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <Truck size={14} className="text-emerald-300" />
              Miễn phí vận chuyển từ 2 triệu
            </span>
            <span className="hidden items-center gap-2 md:inline-flex">
              <ShieldCheck size={14} className="text-sky-300" />
              Bảo hành chính hãng
            </span>
            <span className="hidden items-center gap-2 lg:inline-flex">
              <Star size={14} className="text-amber-300" />
              Hỗ trợ tận tâm 24/7
            </span>
          </div>

          <div className="flex items-center gap-4 normal-case tracking-normal">
            <Link to="/warranty" className="transition hover:text-white">
              Tra cứu bảo hành
            </Link>
            <Link to="/contact" className="transition hover:text-white">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-red-500/20 ring-1 ring-white/10">
                <img src="/logo.jpg" alt="TD PHONE" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-black leading-none tracking-wide">TD</div>
                <div className="-mt-0.5 text-xs uppercase tracking-[0.34em] text-slate-300">Phone</div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setShowMobileMenu((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
              aria-label="Mở menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <form className="relative order-3 lg:order-2" onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm sản phẩm, danh mục, thương hiệu..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowDropdown(true);
                }}
                className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-11 pr-14 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-primary/50 focus:bg-white/8 focus:ring-2 focus:ring-primary/20 lg:min-w-[420px]"
              />

              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-slate-200 transition hover:bg-white/15 hover:text-white"
                aria-label="Tìm kiếm"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 z-[60] mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/98 shadow-2xl shadow-black/30">
                <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  Gợi ý nhanh
                </div>
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 border-t border-white/5 px-4 py-3 transition hover:bg-white/5"
                  >
                    <img src={product.img} alt={product.name} className="h-11 w-11 rounded-xl object-contain bg-white/5 p-1.5" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{product.name}</div>
                      <div className="truncate text-xs text-slate-400">{product.category || 'Sản phẩm nổi bật'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {showDropdown && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 z-[60] mt-2 rounded-2xl border border-white/10 bg-slate-950/98 px-4 py-3 text-sm text-slate-300 shadow-2xl shadow-black/30">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            )}
          </form>

          <div className="order-2 hidden items-center justify-end gap-3 lg:flex">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <LayoutDashboard size={16} />
              Đơn hàng
            </Link>
            <Link
              to="/wishlist"
              className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <Heart size={16} />
              Yêu thích
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-slate-950">
                {wishlistCount}
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <Headphones size={16} />
              Hỗ trợ
            </Link>

            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                onClick={() => setShowAccountMenu((current) => !current)}
              >
                <User size={16} />
                <span className="max-w-28 truncate">{user ? user.username : 'Tài khoản'}</span>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
                  <div className="border-b border-white/5 px-5 py-4">
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Tài khoản</div>
                    <div className="mt-2 text-lg font-black text-white">{user ? user.username : 'Khách'}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {user?.numphone || user?.email || 'Đăng nhập để đồng bộ đơn hàng, địa chỉ và giỏ hàng.'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 px-4 py-4">
                    {quickTiles.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setShowAccountMenu(false)}
                          className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-3 py-4 text-center text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                        >
                          <Icon size={18} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/5 py-2">
                    {!user ? (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <User size={16} />
                          Đăng nhập
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <Sparkles size={16} />
                          Tạo tài khoản
                        </Link>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-white/5"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              onClick={handleCartClick}
              className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-rose-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:scale-[1.01]"
            >
              <ShoppingCart size={16} />
              Giỏ hàng
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-slate-950">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-primary/30 hover:bg-primary/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {showMobileMenu && (
          <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950 p-4 shadow-2xl shadow-black/30 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {quickTiles.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-3 py-4 text-center text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Đăng nhập
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setShowMobileMenu(false)}
                className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Yêu thích ({wishlistCount})
              </Link>
              <Link
                to="/cart"
                onClick={(event) => {
                  setShowMobileMenu(false);
                  handleCartClick(event);
                }}
                className="flex-1 rounded-2xl bg-primary px-4 py-3 text-center text-sm font-bold text-white"
              >
                Giỏ hàng ({cartCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
