import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/storefront';

const pad2 = (value) => String(value).padStart(2, '0');

function getRemaining(targetMs) {
  const diff = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, totalSeconds };
}

export default function FlashSale({ items = [] }) {
  const durationMs = useMemo(() => 2 * 60 * 60 * 1000, []);
  const [targetMs, setTargetMs] = useState(() => Date.now() + durationMs);
  const [remaining, setRemaining] = useState(() => getRemaining(targetMs));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const next = getRemaining(targetMs);

      if (next.totalSeconds <= 0) {
        const newTarget = Date.now() + durationMs;
        setTargetMs(newTarget);
        setRemaining(getRemaining(newTarget));
        return;
      }

      setRemaining(next);
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [durationMs, targetMs]);

  const deals = items.slice(0, 3);

  return (
    <section className="container mx-auto px-4 pb-10">
      <div className="theme-card tilt-card overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#7f1d1d,#be123c_45%,#1d4ed8)] p-6 text-white shadow-2xl shadow-red-300/20 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur">
              Flash Sale
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
              Khung giờ săn giá tốt cho những mẫu đang được quan tâm
            </h2>
            <p className="mt-4 text-sm leading-8 text-red-50/90">
              Làm mới liên tục theo thời gian đếm ngược để tạo điểm nhấn rõ hơn trên trang chủ và thúc đẩy khám phá sản phẩm.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { label: 'Giờ', value: pad2(remaining.hours) },
                { label: 'Phút', value: pad2(remaining.minutes) },
                { label: 'Giây', value: pad2(remaining.seconds) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-[88px] rounded-2xl border border-white/18 bg-white/12 px-4 py-3 text-center backdrop-blur"
                >
                  <div className="text-3xl font-black leading-none">{item.value}</div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/products?sort=price-desc"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
            >
              Xem tất cả ưu đãi
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {deals.length > 0 ? (
              deals.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="rounded-[1.75rem] border border-white/12 bg-white/10 p-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/14"
                >
                  <div className="rounded-2xl bg-white p-3">
                    <img src={item.img} alt={item.name} className="h-44 w-full object-contain" />
                  </div>
                  <div className="mt-4 inline-flex rounded-full bg-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950">
                    Deal số {index + 1}
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-black text-white">{item.name}</h3>
                  <p className="mt-2 text-sm text-white/80">{item.category || 'Sản phẩm nổi bật'}</p>
                  {item.hasDiscount ? (
                    <div className="mt-4 flex items-end gap-3">
                      <div className="text-2xl font-black text-white">
                        {item.discountPriceStatic ?? item.priceStatic ?? item.price}
                      </div>
                      <div className="whitespace-nowrap text-[13px] font-extrabold leading-tight text-amber-200/95">
                        <span className="opacity-90">Giá gốc:&nbsp;</span>
                        <span className="line-through">{item.originalPriceStatic ?? item.originalPrice}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 text-2xl font-black text-white">
                        {item.discountPriceStatic ?? item.priceStatic ?? item.price}
                      </div>
                      <div className="mt-2 whitespace-nowrap text-xs text-white/70">
                        Gợi ý giá hiển thị lại: {formatCurrency(Math.round(item.rawPrice * 1.08))}
                      </div>
                    </>
                  )}
                </Link>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-6 text-sm text-white/85 backdrop-blur md:col-span-3">
                Chưa có sản phẩm ưu đãi để hiển thị. Khi dữ liệu sản phẩm sẵn sàng, khu vực này sẽ tự động lấy từ API trang
                chủ.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
