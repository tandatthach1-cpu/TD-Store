import { ArrowRight, BadgeInfo, Headphones, NotebookPen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';

const adviceItems = [
  {
    title: 'Chọn máy theo nhu cầu',
    description: 'Lọc nhanh theo pin, camera, hiệu năng hoặc ngân sách để rút ngắn thời gian chọn mua.',
  },
  {
    title: 'So sánh trước khi quyết định',
    description: 'Dựa trên bài viết tư vấn để đối chiếu cấu hình, điểm mạnh và giá trị sử dụng thực tế.',
  },
  {
    title: 'Nhận tư vấn trực tiếp',
    description: 'Chuyển sang liên hệ khi cần chốt model, hỏi thêm về bảo hành hoặc tình trạng hàng.',
  },
];

export default function NewsSection({ items }) {
  const list = items?.length ? items : [];
  const featured = list[0];
  const secondary = list.slice(1, 4);

  return (
    <section className="relative overflow-hidden py-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(225,29,72,0.09),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]" />
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
              <NotebookPen size={14} />
              Tin tức & tư vấn
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Nội dung gọn, đẹp và đủ thông tin để người mua ra quyết định nhanh hơn
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Khu vực này kết hợp tin mới, bài tư vấn và gợi ý hỗ trợ để khách có thể đọc nhanh, so sánh dễ và chuyển sang
              hành động ngay khi cần.
            </p>
          </div>

          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-primary">
            Xem tất cả
            <ArrowRight size={16} />
          </Link>
        </div>

        {!list.length ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm">
            Chưa có bài viết nào để hiển thị.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
            {featured && (
              <Link
                to="/news"
                className="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
              >
                <div className="grid h-full gap-0 md:grid-cols-[1.08fr_0.92fr]">
                  <div className="relative overflow-hidden">
                    <img
                      src={featured.img}
                      alt={featured.title}
                      className="h-full min-h-[340px] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.16)_42%,rgba(15,23,42,0.88)_100%)]" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-900 backdrop-blur">
                      <Sparkles size={12} className="text-primary" />
                      Bài nổi bật
                    </div>
                  </div>

                  <div className="relative p-7 md:p-8">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
                      <BadgeInfo size={14} />
                      {featured.category}
                    </div>
                    <h3 className="mt-4 text-3xl font-black leading-tight text-slate-900">
                      {featured.title}
                    </h3>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{featured.date}</p>
                    <p className="mt-5 text-sm leading-8 text-slate-600">{featured.description}</p>

                    <div className="mt-7 grid gap-3">
                      {adviceItems.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div className="text-sm font-black text-slate-900">{item.title}</div>
                          <div className="mt-1 text-sm leading-6 text-slate-600">{item.description}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition group-hover:bg-primary">
                      Đọc ngay
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="grid gap-6">
              <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#2563eb)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
                  <Headphones size={14} />
                  Tư vấn nhanh
                </div>
                <h3 className="mt-4 text-2xl font-black leading-tight">
                  Chưa biết chọn máy nào? Hãy để nội dung tư vấn giúp bạn thu hẹp lựa chọn.
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-200/90">
                  Đọc bài viết, xem so sánh cấu hình hoặc chuyển thẳng sang liên hệ để được hỗ trợ chi tiết hơn.
                </p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Nhận tư vấn
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-4">
                {secondary.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
