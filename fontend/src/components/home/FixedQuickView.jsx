import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/storefront';

export default function FixedQuickView({ product, label = 'Xem nhanh cố định' }) {
  const [displayProduct, setDisplayProduct] = useState(product);
  const [isVisible, setIsVisible] = useState(Boolean(product));

  useEffect(() => {
    if (!product) {
      setIsVisible(false);
      const timeoutId = window.setTimeout(() => setDisplayProduct(null), 140);
      return () => window.clearTimeout(timeoutId);
    }

    if (!displayProduct) {
      setDisplayProduct(product);
      setIsVisible(true);
      return undefined;
    }

    if (displayProduct.id === product.id) {
      setIsVisible(true);
      return undefined;
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => {
      setDisplayProduct(product);
      requestAnimationFrame(() => setIsVisible(true));
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [displayProduct, product]);

  if (!displayProduct) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(100%-1rem,980px)] -translate-x-1/2">
      <div
        className={`rounded-[1.6rem] border border-slate-200 bg-white/96 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all duration-200 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <div key={displayProduct.id} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={displayProduct.img}
              alt={displayProduct.name}
              className="h-20 w-20 flex-none rounded-[1.2rem] bg-slate-100 object-contain p-2.5 md:h-24 md:w-24"
            />
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">{label}</div>
              <div className="truncate text-xl font-black text-slate-900 md:text-2xl">{displayProduct.name}</div>
              <div className="mt-1.5 text-sm text-slate-500">
                {displayProduct.category || 'Sản phẩm'} · {displayProduct.hasDiscount ? 'Đang giảm giá' : 'Giá niêm yết'}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {displayProduct.featured && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Nổi bật</span>
                )}
                {displayProduct.bestSeller && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Bán chạy</span>
                )}
                {displayProduct.hasDiscount && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Có ưu đãi</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Giá</div>
              <div className="text-xl font-black text-primary md:text-2xl">
                {displayProduct.discountPriceStatic ?? displayProduct.priceStatic ?? formatCurrency(displayProduct.rawPrice)}
              </div>
            </div>
            <Link
              to={`/product/${displayProduct.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary"
            >
              Xem chi tiết
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
