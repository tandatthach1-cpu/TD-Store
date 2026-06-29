import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Share2, Sparkles } from 'lucide-react';
import { API_BASE_URL, fetchJson, normalizeNews } from '../utils/storefront';

/**
 * Chi tiết tin tức
 * Hiển thị một mục tin tức dựa trên id trong URL.
 * Sử dụng same styling pattern as other detail pages (ProductDetail).
 */
const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchJson(`${API_BASE_URL}/news/${id}`);
        // API may return object or wrapped content, normalize safely
        const normalized = normalizeNews(data);
        setNews(normalized);
      } catch (err) {
        setError(err.message || 'Không thể tải tin tức');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadNews();
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-gray-600">Đang tải tin tức...</div>;
  }
  if (error) {
    return <div className="py-12 text-center text-red-500">Lỗi: {error}</div>;
  }
  if (!news) {
    return <div className="py-12 text-center text-gray-500">Không tìm thấy tin tức.</div>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_38%,#ffffff_100%)] pb-16">
      {/* Breadcrumb */}
      <section className="border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-primary">
              Trang chủ
            </Link>
            <ArrowRight size={14} />
            <Link to="/news" className="transition hover:text-primary">
              Tin tức & tư vấn
            </Link>
            <ArrowRight size={14} />
            <span className="font-semibold text-gray-800">{news.title}</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Image & meta */}
          <div className="theme-card rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="relative mb-6 overflow-hidden rounded-[1.6rem]">
              <img src={news.img} alt={news.title} className="w-full h-[32rem] object-cover" />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_70%)]" />
              {/* Category badge */}
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
                <Sparkles size={12} />
                {news.category}
              </div>
              {/* Share button */}
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-700 shadow-sm hover:bg-white"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url).then(() => {
                    // could add toast notification later
                  });
                }}
              >
                <Share2 size={18} />
              </button>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-3xl bg-slate-950 px-5 py-4 text-white">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200">Bài viết</div>
                <div className="mt-1 text-lg font-black">{news.title}</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <CalendarDays size={16} />
                  <span>{news.date}</span>
                </div>
              </div>
              <Sparkles size={18} className="text-red-200" />
            </div>
            <div className="mt-6 text-sm leading-7 text-gray-700">
              {news.description}
            </div>
            <div className="mt-8">
              <Link to="/news" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary/90">
                <ArrowLeft size={14} />
                Quay lại danh sách tin tức
              </Link>
            </div>
          </div>

          {/* Sidebar quick info */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="theme-card overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="p-7 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  <Sparkles size={14} />
                  {news.category}
                </div>
                <h2 className="mt-4 text-2xl font-black">{news.title}</h2>
                <p className="mt-3 text-sm text-gray-600">{news.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetail;
