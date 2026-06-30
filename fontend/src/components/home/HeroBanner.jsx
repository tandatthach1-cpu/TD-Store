import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import heroFallback from '../../assets/hero.png';
import { getImageUrl } from '../../utils/storefront';

const getStatCards = (stats) => [
  { label: 'Sản phẩm đang bán', value: `${stats?.totalProducts || 0}+` },
  { label: 'Danh mục nổi bật', value: `${stats?.totalCategories || 0}+` },
  { label: 'Sản phẩm nổi bật', value: `${stats?.featuredProducts || 0}+` },
  { label: 'Mẫu bán chạy', value: `${stats?.bestSellerProducts || 0}+` },
];

export default function HeroBanner({ slides = [], categories = [], stats }) {
  const heroRef = useRef(null);
  const normalizedSlides = useMemo(
    () =>
      slides.map((slide, index) => ({
        ...slide,
        title: slide.title || `Slide ${index + 1}`,
        subtitle: slide.description || slide.subtitle || '',
        imageUrl: slide.photo ? getImageUrl('slideShows', slide.photo) : heroFallback,
      })),
    [slides]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [motion, setMotion] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (normalizedSlides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [normalizedSlides.length]);

  const currentIndex = normalizedSlides.length ? activeIndex % normalizedSlides.length : 0;
  const currentSlide = normalizedSlides[currentIndex] || {
    title: 'Mua sắm công nghệ chính hãng',
    subtitle: 'Dữ liệu trình chiếu sẽ hiển thị tại đây khi bạn thêm slideshow từ quản trị.',
    imageUrl: heroFallback,
  };
  const statCards = getStatCards(stats);

  const moveSlide = (direction) => {
    if (!normalizedSlides.length) return;

    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return normalizedSlides.length - 1;
      if (next >= normalizedSlides.length) return 0;
      return next;
    });
  };

  const handlePointerMove = (event) => {
    const element = heroRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setMotion({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
  };

  const resetMotion = () => setMotion({ x: 0, y: 0 });

  return (
    <section
      ref={heroRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetMotion}
      className="hero-stage relative overflow-hidden bg-[#050816] text-white"
      style={{
        '--tilt-x': motion.x,
        '--tilt-y': motion.y,
      }}
    >
      <div className="hero-grid" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="absolute inset-0">
        <img
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="h-full w-full object-cover opacity-35 transition-opacity duration-700"
          onError={(event) => {
            event.currentTarget.src = heroFallback;
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(225,29,72,0.32),_transparent_38%),radial-gradient(circle_at_85%_20%,_rgba(59,130,246,0.22),_transparent_24%),linear-gradient(135deg,_rgba(5,8,22,0.96),_rgba(7,12,30,0.82)_55%,_rgba(25,11,26,0.9))]" />
      </div>

      <div className="relative container mx-auto px-4 pb-14 pt-12 md:pb-18 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-100 backdrop-blur">
              <Sparkles size={14} />
              Không gian mua sắm công nghệ
            </div>

            <h1 className="display-serif mt-6 max-w-3xl text-[3rem] font-bold leading-[0.98] tracking-[-0.03em] md:text-[5rem]">
              {currentSlide.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-200 md:text-base">{currentSlide.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-red-700"
              >
                Mua ngay
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/preorder"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/12"
              >
                Đặt trước sản phẩm mới
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/14"
                >
                  {category.title}
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-red-200">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Chính hãng</span>
                </div>
                <p className="mt-3 text-sm text-slate-100">Nguồn gốc rõ ràng, hỗ trợ bảo hành minh bạch.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200">
                  <Truck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Giao nhanh</span>
                </div>
                <p className="mt-3 text-sm text-slate-100">Ưu tiên giao sớm cho các đơn hàng nội thành.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-amber-200">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Tư vấn đúng nhu cầu</span>
                </div>
                <p className="mt-3 text-sm text-slate-100">So sánh nhanh theo tầm giá, tác vụ và thương hiệu.</p>
              </div>
            </div>
          </div>

          <div className="relative hero-tilt-wrapper">
            <div className="hero-tilt-card rounded-[2rem] border border-white/10 bg-black/18 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-red-200">Toàn cảnh trang chủ</div>
                  <div className="mt-2 text-2xl font-black text-white">Dễ khám phá, dễ chọn mua</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveSlide(-1)}
                    className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/16 disabled:opacity-40"
                    aria-label="Slide trước"
                    disabled={!normalizedSlides.length}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(1)}
                    className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/16 disabled:opacity-40"
                    aria-label="Slide tiếp theo"
                    disabled={!normalizedSlides.length}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="hero-media mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#09111f]">
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  className="h-64 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = heroFallback;
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {statCards.map((item) => (
                  <div key={item.label} className="stat-float rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="text-2xl font-black text-white">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>

              {normalizedSlides.length > 0 && (
                <div className="mt-5 flex gap-2">
                  {normalizedSlides.map((slide, index) => (
                  <button
                      key={`${slide.title}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-10 bg-white' : 'w-3 bg-white/35'}`}
                      aria-label={`Chuyển đến slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
