import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, TimerReset } from 'lucide-react';
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
  const progress = Math.min(1, Math.max(0, 1 - remaining.totalSeconds / (durationMs / 1000)));

  return (
    <section className="container mx-auto px-4 pb-10">
      <div className="theme-card tilt-card relative overflow-hidden rounded-[2.5rem] border border-rose-200/60 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),linear-gradient(135deg,#7f1d1d_0%,#be123c_38%,#1d4ed8_100%)] p-5 text-white shadow-[0_24px_80px_rgba(127,29,29,0.26)] md:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.14),transparent_30%,rgba(255,255,255,0.06)_60%,transparent_85%)] opacity-60" />
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-14 bottom-0 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] backdrop-blur">
              <Flame size={14} className="text-amber-200" />
              flash sale
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-balance md:text-5xl">
              Khung giờ vàng cho những sản phẩm đang được săn nhiều nhất
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-white/88 md:text-[15px]">
              Một khối ưu đãi có nhịp điệu rõ ràng hơn, nổi bật hơn và đủ sang để kéo mắt người xem ngay từ lần lướt đầu tiên.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Giờ', value: pad2(remaining.hours) },
                { label: 'Phút', value: pad2(remaining.minutes) },
                { label: 'Giây', value: pad2(remaining.seconds) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-white/15 bg-white/12 px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
                >
                  <div className="text-3xl font-black leading-none tracking-tight tabular-nums">{item.value}</div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.26em] text-white/75">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-white/12 bg-black/10 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                <span>Cường độ ưu đãi</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#fde68a,#fb7185,#f43f5e)] transition-[width] duration-700"
                  style={{ width: `${Math.max(8, progress * 100)}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
                <TimerReset size={15} className="text-amber-200" />
                Tự làm mới khi hết khung giờ, nên khu vực này luôn có cảm giác đang sống.
              </div>
            </div>

            <Link
              to="/products?sort=price-desc"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-950/10"
            >
              Xem tất cả ưu đãi
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {deals.length > 0 ? (
              deals.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group relative overflow-hidden rounded-[1.9rem] border border-white/12 bg-white/10 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/14 hover:shadow-2xl hover:shadow-slate-950/20"
                >
                  <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />
                  <div className="relative flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-rose-700 shadow-sm">
                      Deal {index + 1}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">hôm nay</span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[1.4rem] bg-white p-3 shadow-[inset_0_1px_0_rgba(15,23,42,0.06)]">
                    <div className="aspect-[4/3]">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.06]"
                      />
                    </div>
                  </div>

                  <h3 className="mt-4 min-h-[3.5rem] text-base font-black leading-6 text-white line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/75">{item.category || 'Sản phẩm nổi bật'}</p>

                  <div className="mt-4 rounded-[1.35rem] bg-black/12 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">Giá ưu đãi</div>
                    <div className="mt-2 flex items-end gap-3">
                      <div className="text-2xl font-black tracking-tight text-white">
                        {item.discountPriceStatic ?? item.priceStatic ?? item.price}
                      </div>
                      {item.hasDiscount ? (
                        <div className="pb-1 text-[13px] font-semibold text-amber-100/90">
                          <span className="opacity-80">Giá gốc </span>
                          <span className="line-through">
                            {item.originalPriceStatic ?? item.originalPrice}
                          </span>
                        </div>
                      ) : (
                        <div className="pb-1 text-[13px] text-white/70">
                          Giá tham khảo {formatCurrency(Math.round(item.rawPrice * 1.08))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/92 transition group-hover:translate-x-0.5">
                    Xem ngay
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.9rem] border border-white/12 bg-white/10 p-6 text-sm leading-7 text-white/85 backdrop-blur-xl md:col-span-3">
                Chưa có sản phẩm ưu đãi để hiển thị. Khi dữ liệu sản phẩm sẵn sàng, khu vực này sẽ tự động lấy từ API trang chủ.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
