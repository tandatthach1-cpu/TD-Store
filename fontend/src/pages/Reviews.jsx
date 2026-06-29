import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import { reviewHighlights } from '../data/siteContent';
import { API_BASE_URL, fetchJson, getPageContent, normalizeProduct } from '../utils/storefront';

const Reviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchJson(`${API_BASE_URL}/products?page=0&size=12`);
        setProducts(getPageContent(data).map(normalizeProduct));
      } catch (err) {
        setError(err.message || 'Không thể tải sản phẩm review');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Góc đánh giá</p>
            <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">
              Tổng hợp góc nhìn nhanh để chọn đúng smartphone theo nhu cầu
            </h1>
            <p className="mt-4 text-sm leading-8 text-gray-600">
              Trang này kết hợp phần đánh giá nội dung và các sản phẩm đang có sẵn, giúp bạn chuyển từ đọc nhận xét sang
              so sánh và mua hàng nhanh hơn.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {reviewHighlights.map((item) => (
            <article key={item.title} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {item.score}
                </span>
                <span className="text-sm text-gray-400">Phân tích nhanh</span>
              </div>
              <h2 className="mt-5 text-2xl font-black text-gray-900">{item.title}</h2>
              <p className="mt-2 text-sm font-semibold text-gray-500">{item.subtitle}</p>
              <p className="mt-5 text-sm leading-8 text-gray-600">{item.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Sản phẩm nên tham khảo ngay</h2>
            <p className="mt-2 text-sm text-gray-500">
              Chuyển tiếp từ review sang trang chi tiết sản phẩm đang bán.
            </p>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary">
            Xem danh mục &rarr;
          </Link>
        </div>

        {loading && <div className="py-16 text-center text-gray-600">Đang tải sản phẩm...</div>}
        {error && <div className="py-16 text-center text-red-500">Lỗi: {error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Reviews;
