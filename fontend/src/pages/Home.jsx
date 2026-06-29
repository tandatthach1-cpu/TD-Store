import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BadgeHelp, ClipboardCheck, Headphones, ShieldCheck } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import Services from '../components/home/Services';
import TrustStats from '../components/home/TrustStats';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FlashSale from '../components/home/FlashSale';
import QuickViewModal from '../components/home/QuickViewModal';
import NewsSection from '../components/home/NewsSection';
import ProductSection from '../components/home/ProductSection';
import {
  API_BASE_URL,
  fetchJson,
  getPageContent,
  normalizeCategory,
  normalizeNews,
  normalizeProduct,
} from '../utils/storefront';

const quickActions = [
  {
    title: 'So sánh theo tầm giá',
    description: 'Bắt đầu từ bộ lọc sản phẩm để nhanh chóng thu hẹp lựa chọn theo ngân sách.',
    href: '/products',
    icon: <ClipboardCheck size={18} />,
  },
  {
    title: 'Đặt trước sản phẩm mới',
    description: 'Giữ chỗ sớm cho các mẫu máy sắp mở bán cùng những ưu đãi đi kèm.',
    href: '/preorder',
    icon: <ArrowUpRight size={18} />,
  },
  {
    title: 'Tra cứu bảo hành',
    description: 'Kiểm tra nhanh tình trạng đơn, tiếp nhận bảo hành hoặc thông tin sau bán.',
    href: '/warranty',
    icon: <ShieldCheck size={18} />,
  },
];

const needStates = [
  {
    title: 'Cần máy chụp ảnh tốt',
    description: 'Ưu tiên các mẫu nổi bật có camera ổn định và quay video tốt cho nhu cầu hằng ngày.',
    href: '/reviews',
    accent: 'from-rose-50 to-white',
  },
  {
    title: 'Cần pin khỏe, dùng bền',
    description: 'Tập trung vào những model cân bằng giữa pin, hiệu năng và độ ổn định lâu dài.',
    href: '/products?sort=price-desc',
    accent: 'from-amber-50 to-white',
  },
  {
    title: 'Cần tư vấn trước khi chốt',
    description: 'Khi chưa chắc nên mua mẫu nào, hãy đi theo các nội dung tư vấn và FAQ trước.',
    href: '/faq',
    accent: 'from-sky-50 to-white',
  },
];

const Home = () => {
  const [homeData, setHomeData] = useState({
    slideShows: [],
    featuredCategories: [],
    featuredProducts: [],
    bestSellerProducts: [],
    newestProducts: [],
    news: [],
    stats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError('');

        try {
          const data = await fetchJson(`${API_BASE_URL}/home`);
          const featuredProducts = getPageContent(data.featuredProducts).map(normalizeProduct).filter((item) => item.featured).slice(0, 8);
          setHomeData({
            slideShows: getPageContent(data.slideShows),
            featuredCategories: getPageContent(data.featuredCategories).map(normalizeCategory),
            featuredProducts,
            bestSellerProducts: getPageContent(data.bestSellerProducts).map(normalizeProduct),
            newestProducts: getPageContent(data.newestProducts).map(normalizeProduct),
            news: getPageContent(data.news).map(normalizeNews),
            stats: data.stats || null,
          });
          return;
        } catch {
          const [productsData, slidesData, newsData, categoriesData] = await Promise.all([
            fetchJson(`${API_BASE_URL}/products?page=0&size=100`),
            fetchJson(`${API_BASE_URL}/slideShows?page=0&size=5`),
            fetchJson(`${API_BASE_URL}/news`),
            fetchJson(`${API_BASE_URL}/categories?page=0&size=8`),
          ]);

          const normalizedProducts = getPageContent(productsData).map(normalizeProduct);
          const normalizedCategories = getPageContent(categoriesData).map(normalizeCategory);
          const featuredProducts = normalizedProducts.filter((item) => item.featured).slice(0, 8);

          setHomeData({
            slideShows: getPageContent(slidesData),
            featuredCategories: normalizedCategories,
            featuredProducts,
            bestSellerProducts: normalizedProducts.filter((item) => item.bestSeller).slice(0, 8),
            newestProducts: normalizedProducts.slice(-8).reverse(),
            news: getPageContent(newsData).map(normalizeNews),
            stats: {
              totalProducts: normalizedProducts.length,
              totalCategories: normalizedCategories.length,
              featuredProducts: normalizedProducts.filter((item) => item.featured).length,
              bestSellerProducts: normalizedProducts.filter((item) => item.bestSeller).length,
            },
          });
        }
      } catch (err) {
        setError(err.message || 'Đã có lỗi khi tải dữ liệu trang chủ');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const { slideShows, featuredCategories, featuredProducts, bestSellerProducts, newestProducts, news, stats } = homeData;

  return (
    <div className="theme-page min-h-screen bg-[#f8fafc]">
      <HeroBanner slides={slideShows} categories={featuredCategories} stats={stats} />

      {loading && <div className="py-10 text-center text-gray-600">Đang tải dữ liệu trang chủ...</div>}
      {error && <div className="py-10 text-center text-red-500">Lỗi: {error}</div>}

      {!loading && !error && (
        <>
          <Services />
          <TrustStats stats={stats} />

          <section className="container mx-auto px-4 py-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {quickActions.map((item, index) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`rounded-[1.9rem] p-6 text-white shadow-lg transition hover:-translate-y-1 ${
                    index === 0
                      ? 'bg-[linear-gradient(135deg,#0f172a,#1e293b)]'
                      : index === 1
                        ? 'bg-[linear-gradient(135deg,#9f1239,#e11d48)]'
                        : 'bg-[linear-gradient(135deg,#1d4ed8,#0ea5e9)]'
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">{item.icon}</div>
                  <h2 className="mt-5 text-2xl font-black">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/85">{item.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                    Truy cập nhanh
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <CategoryShowcase items={featuredCategories} />
          {bestSellerProducts.length > 0 && (
            <FlashSale items={bestSellerProducts} />
          )}

          <section className="container mx-auto px-4 py-10">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  Gợi ý theo nhu cầu
                </div>
                <h2 className="mt-4 text-3xl font-black text-gray-900">
                  Không chỉ đẹp hơn, trang chủ còn dẫn đường tốt hơn
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">
                  Mỗi khối nội dung được đặt để hỗ trợ một kiểu ra quyết định khác nhau: muốn xem nhanh, muốn tìm hiểu kỹ
                  hoặc muốn đi thẳng đến sản phẩm.
                </p>
              </div>
              <div className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-500 shadow-sm md:block">
                Tối ưu cho cả khám phá và chuyển đổi
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {needStates.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`rounded-[1.75rem] border border-gray-100 bg-gradient-to-b ${item.accent} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    {item.href === '/reviews' ? (
                      <Headphones size={20} className="text-primary" />
                    ) : item.href === '/faq' ? (
                      <BadgeHelp size={20} className="text-primary" />
                    ) : (
                      <ShieldCheck size={20} className="text-primary" />
                    )}
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{item.description}</p>
                  <div className="mt-5 text-sm font-bold text-primary">Khám phá ngay &rarr;</div>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-2">
            <ProductSection
              title="Sản phẩm nổi bật"
              description="Những mẫu máy đang được ưu tiên hiển thị ở trang chủ để người dùng mới có thể xem nhanh lựa chọn đáng chú ý."
              items={featuredProducts}
              onQuickView={setQuickViewProduct}
              frameless
            />
            <ProductSection
              title="Sản phẩm bán chạy"
              description="Nhóm sản phẩm có lực mua tốt, phù hợp khi bạn muốn tham khảo theo xu hướng lựa chọn phổ biến."
              items={bestSellerProducts}
              onQuickView={setQuickViewProduct}
              frameless
            />
            <ProductSection
              title="Mới cập nhật"
              description="Các sản phẩm được thêm gần đây để trang chủ luôn có cảm giác mới và có lý do để quay lại khám phá."
              items={newestProducts}
              onQuickView={setQuickViewProduct}
              frameless
            />
          </div>

          <NewsSection items={news} />

          {!featuredProducts.length && !bestSellerProducts.length && !newestProducts.length && (
            <div className="container mx-auto px-4 py-16 text-center text-gray-500">
              Chưa có sản phẩm trong cơ sở dữ liệu để hiển thị trên trang chủ.
            </div>
          )}
        </>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default Home;
