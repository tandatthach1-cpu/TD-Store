import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import ProductCard from '../components/home/ProductCard';
import { notify } from '../utils/notifications';
import { getCurrentUser } from '../utils/storefront';
import { WISHLIST_CHANGE_EVENT, clearWishlist, getWishlistItems } from '../utils/wishlist';

const Wishlist = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getWishlistItems());
  const currentUser = getCurrentUser();

  useEffect(() => {
    const syncWishlist = () => setItems(getWishlistItems());
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
    window.addEventListener('storage', syncWishlist);
    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, []);

  useEffect(() => {
    if (!currentUser?.id) {
      notify({ type: 'error', message: 'Vui lòng đăng nhập để xem sản phẩm yêu thích của bạn.' });
      navigate('/login');
    }
  }, [currentUser?.id, navigate]);

  if (!currentUser?.id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#eef2ff)] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <Heart size={14} />
              Wishlist
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-950">Sản phẩm bạn đã lưu</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Danh sách yêu thích này chỉ hiển thị theo tài khoản đang đăng nhập.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {items.length} sản phẩm
            </div>
            <button
              type="button"
              onClick={() => clearWishlist()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
            >
              <Trash2 size={16} />
              Xóa hết
            </button>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto text-slate-300" size={44} />
            <h2 className="mt-4 text-2xl font-black text-slate-900">Chưa có sản phẩm nào trong wishlist</h2>
            <p className="mt-2 text-sm text-slate-500">Bấm biểu tượng trái tim trên sản phẩm để lưu lại.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Đi xem sản phẩm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
