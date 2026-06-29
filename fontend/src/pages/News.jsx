import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeInfo, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/home/NewsCard';
import { API_BASE_URL, fetchJson, getPageContent, normalizeNews } from '../utils/storefront';

const News = () => {
  const [news, setNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchJson(`${API_BASE_URL}/news`);
        setNews(getPageContent(data).map(normalizeNews));
      } catch (err) {
        setError(err.message || 'Không thể tải tin tức');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(new Set(news.map((item) => item.category).filter(Boolean)));
    return ['Tất cả', ...values];
  }, [news]);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'Tất cả') return news;
    return news.filter((item) => item.category === activeCategory);
  }, [activeCategory, news]);

  const featured = filteredNews[0];
  const secondary = filteredNews.slice(1);

  const stats = [
    { label: 'Bài viết', value: String(filteredNews.length || news.length || 0) },
    { label: 'Chuyên mục', value: String(categories.length - 1) },
    { label: 'Tư vấn nhanh', value: 'Có' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(225,29,72,0.09),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="container relative mx-auto px-4 py-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
              <Sparkles size={14} />
              Tin tức & tư vấn
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Tin mới, mẹo dùng máy và nội dung tư vấn được trình bày gọn hơn
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
              Trang này được thiết kế lại theo kiểu editorial hiện đại: có bài nổi bật, có lọc theo chuyên mục và có khối
              hỗ trợ nhanh để người dùng đi từ đọc thông tin tới hành động ngay.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[1.4rem] border border-white/80 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-2xl font-black text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeCategory === category
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
            <Search size={16} />
            <span>Tìm bài tư vấn, tin mới và mẹo sử dụng</span>
          </div>
        </div>

        {loading && <div className="py-16 text-center text-slate-600">Đang tải tin tức...</div>}
        {error && <div className="py-16 text-center text-red-500">Lỗi: {error}</div>}

        {!loading && !error && !filteredNews.length && (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm">
            Chưa có bài viết nào cho nhóm này.
          </div>
        )}

        {!loading && !error && featured && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative overflow-hidden">
                  <img src={featured.img} alt={featured.title} className="h-full min-h-[340px] w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.18)_45%,rgba(15,23,42,0.88)_100%)]" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-900 backdrop-blur">
                    <BadgeInfo size={12} className="text-primary" />
                    Bài nổi bật
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  <div className="w-fit rounded-full bg-primary/10 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
                    {featured.category}
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900">{featured.title}</h2>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{featured.date}</p>
                  <p className="mt-5 text-sm leading-8 text-slate-600">{featured.description}</p>

                  <div className="mt-7 rounded-[1.5rem] bg-slate-50 p-5">
                    <div className="text-sm font-black text-slate-900">Gợi ý đọc nhanh</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Bấm vào các nhóm chuyên mục phía trên để lọc nội dung hoặc sang trang liên hệ nếu cần được tư vấn
                      trực tiếp.
                    </p>
                  </div>

                  <Link
                    to="/contact"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary"
                  >
                    Nhận tư vấn liên quan
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#2563eb)] p-7 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
                <Sparkles size={14} />
                Bản tin nhanh
              </div>
              <h3 className="mt-4 text-2xl font-black">Nội dung mới được sắp xếp để đọc nhanh hơn</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200/90">
                Chuyên mục này giúp khách hàng nắm bắt xu hướng, kinh nghiệm chọn máy và nhận tư vấn khi cần hỗ trợ thêm.
              </p>

              <div className="mt-6 space-y-4">
                {filteredNews.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">{item.category}</div>
                    <div className="mt-2 text-sm font-semibold leading-6 text-white">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-300">{item.date}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Chat tư vấn nhanh
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && secondary.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {secondary.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default News;
