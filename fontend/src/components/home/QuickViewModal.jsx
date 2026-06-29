import { X, Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AUTH_CHANGE_EVENT, formatCurrency, getCurrentUser } from '../../utils/storefront';
import { notify } from '../../utils/notifications';
import { isWishlisted, toggleWishlistItem } from '../../utils/wishlist';

const renderStars = (rating = 5) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star key={index} size={14} className={index < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
  ));

export default function QuickViewModal({ product, onClose }) {
  const wishlisted = product ? isWishlisted(product.id) : false;

  if (!product) return null;

  const price = product.discountPriceStatic ?? product.priceStatic ?? formatCurrency(product.rawPrice || product.price || 0);
  const originalPrice = product.originalPriceStatic ?? product.originalPrice;

  const handleWishlistClick = () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      notify({ type: 'error', message: 'Vui lòng đăng nhập để thêm sản phẩm yêu thích.' });
      window.location.href = '/login';
      return;
    }

    toggleWishlistItem(product);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Xem nhanh</div>
            <h3 className="mt-1 text-lg font-black text-slate-900">Thông tin rút gọn của sản phẩm</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-50 p-6">
            <div className="rounded-[1.75rem] bg-white p-4 shadow-sm">
              <img src={product.img} alt={product.name} className="h-72 w-full object-contain" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.featured && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Nổi bật</span>}
              {product.bestSeller && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Bán chạy</span>}
              {product.hasDiscount && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Có ưu đãi</span>}
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-3xl font-black leading-tight text-slate-950">{product.name}</h4>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{product.category || 'Sản phẩm'}</span>
              <span className="inline-flex items-center gap-1">
                {renderStars(5)}
                <span className="ml-1">Xem nhanh</span>
              </span>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Giá hiện tại</div>
              <div className="mt-2 text-3xl font-black text-white">{price}</div>
              {product.hasDiscount && originalPrice && (
                <div className="mt-2 text-sm text-slate-300">
                  Giá gốc: <span className="line-through">{originalPrice}</span>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  wishlisted
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
                {wishlisted ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
              <Link
                to={`/product/${product.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                onClick={onClose}
              >
                <ShoppingCart size={16} />
                Xem chi tiết
              </Link>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-600">
              {product.description || 'Thông tin nhanh về sản phẩm sẽ hiển thị ở đây.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
