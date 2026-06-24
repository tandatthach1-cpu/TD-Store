import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Flame, Heart, Search, Star } from 'lucide-react';
import fallbackProductImage from '../../assets/hero.png';
import { WISHLIST_CHANGE_EVENT, isWishlisted, toggleWishlistItem } from '../../utils/wishlist';

const ProductCard = ({
  product,
  variant,
  selected = false,
  onActivate,
  onDeactivate,
  onQuickView,
  activateOnHover = false,
  frameless = false,
}) => {
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(product.id));

  useEffect(() => {
    const sync = () => setWishlisted(isWishlisted(product.id));
    sync();
    window.addEventListener(WISHLIST_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [product.id]);

  const titleClass =
    variant === 'search'
      ? 'min-h-[3rem] text-base font-extrabold leading-6 transition-colors group-hover:text-primary line-clamp-2'
      : 'min-h-[2.8rem] text-sm font-extrabold leading-6 transition-colors group-hover:text-primary line-clamp-2';

  const priceClass = variant === 'search' ? 'text-2xl font-black leading-tight text-primary' : 'text-lg font-black leading-tight text-primary';
  const frameClass = frameless
    ? 'border-transparent ring-transparent bg-transparent shadow-none hover:shadow-none hover:bg-transparent'
    : selected
      ? 'border-primary ring-primary/30'
      : 'border-slate-100 ring-slate-100';
  const motionClass = frameless
    ? 'transition-all duration-500 ease-out hover:-translate-y-0.5'
    : 'transition-all duration-300';
  const imageClass = frameless
    ? 'h-full w-full object-contain px-3 py-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]'
    : 'h-full w-full object-contain px-3 py-4 transition-transform duration-300 group-hover:scale-110';

  return (
    <Link
      to={`/product/${product.id}`}
      onMouseEnter={activateOnHover ? onActivate : undefined}
      onMouseLeave={activateOnHover ? onDeactivate : undefined}
      onFocus={activateOnHover ? onActivate : undefined}
      onBlur={activateOnHover ? onDeactivate : undefined}
      className={`theme-card tilt-card group relative block h-full overflow-hidden rounded-[1.9rem] bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ${motionClass} hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] ${frameClass}`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlistItem(product);
          }}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
            wishlisted
              ? 'border-rose-300 bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'border-white/80 bg-white text-slate-500 shadow-sm hover:border-rose-300 hover:text-rose-500'
          }`}
          aria-label={wishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>
        {onQuickView && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onQuickView(product);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-slate-500 shadow-sm transition hover:border-primary/30 hover:text-primary"
            aria-label="Xem nhanh"
          >
            <Search size={16} />
          </button>
        )}
      </div>
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {product.bestSeller && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm shadow-orange-500/20">
            <Flame size={12} />
            Bán chạy
          </span>
        )}
        {product.featured && !product.bestSeller && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm shadow-primary/20">
            <Star size={12} />
            Nổi bật
          </span>
        )}
      </div>

      <div className="relative mb-4 overflow-hidden rounded-[1.5rem] bg-transparent">
        <div className="aspect-[4/3]">
          <img
            src={product.img}
            alt={product.name}
            className={imageClass}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = fallbackProductImage;
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0" />
        </div>
      </div>

      <h3 className={titleClass}>{product.name}</h3>

      <div className="mt-2 flex min-h-[2rem] flex-wrap gap-2">
        {product.category ? (
          <div className="inline-flex max-w-full rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            <span className="line-clamp-1">{product.category}</span>
          </div>
        ) : null}
        {product.hasDiscount && (
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
            <BadgeCheck size={12} />
            Có giảm giá
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <p className={priceClass}>
              {product.discountPriceStatic ?? product.priceStatic ?? product.price}
            </p>

            {product.hasDiscount && (
              <p className="pb-1 text-[12px] font-extrabold leading-tight text-amber-600/90">
                <span className="opacity-90">Giá gốc:&nbsp;</span>
                <span className="line-through">{product.originalPriceStatic ?? product.originalPrice}</span>
              </p>
            )}
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            {product.hasDiscount ? 'Ưu đãi tốt hơn đang hiển thị ở đây' : 'Sản phẩm chính hãng, bảo hành rõ ràng'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white transition group-hover:bg-primary">
        <span className="text-sm font-bold">Xem chi tiết</span>
        <ArrowRight className="transition group-hover:translate-x-1" size={16} />
      </div>
    </Link>
  );
};

export default ProductCard;
