import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductSection({
  title,
  items,
  variant,
  description,
  onActivate,
  onDeactivate,
  onQuickView,
  activateOnHover = false,
  frameless = false,
}) {
  if (!items?.length) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-10 w-1.5 rounded-full bg-primary" />
          <div>
            <h2 className="display-serif text-[2rem] font-bold tracking-[-0.03em] text-gray-900 md:text-[2.5rem]">{title}</h2>
            {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">{description}</p>}
            <div className="mt-3 h-1.5 w-24 rounded-full bg-primary/15" />
          </div>
        </div>
        <Link to="/products" className="text-sm font-semibold text-gray-500 transition-colors hover:text-primary">
          Xem tất cả &rarr;
        </Link>
      </div>

      <div className={`grid gap-6 ${variant === 'search' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
        {items.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            variant={variant}
            onActivate={() => onActivate?.(item.id)}
            onDeactivate={() => onDeactivate?.()}
            onQuickView={onQuickView}
            activateOnHover={activateOnHover}
            frameless={frameless}
          />
        ))}
      </div>
    </section>
  );
}
