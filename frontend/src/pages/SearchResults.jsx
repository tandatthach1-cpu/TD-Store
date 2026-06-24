import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductSection from '../components/home/ProductSection';
import { API_BASE_URL, fetchJson, getPageContent, normalizeProduct } from '../utils/storefront';

const SearchResults = () => {
  const location = useLocation();
  const query = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return (searchParams.get('q') || '').trim();
  }, [location.search]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchJson(`${API_BASE_URL}/products?page=0&size=100`);
        setProducts(getPageContent(data).map(normalizeProduct));
      } catch (err) {
        setError(err.message || 'Da co loi khi tai du lieu');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = query.toLowerCase();
    if (!keyword) return [];

    return products.filter((product) =>
      [product.name, product.category, product.description]
        .filter(Boolean)
        .some((text) => String(text).toLowerCase().includes(keyword))
    );
  }, [products, query]);

  if (loading) return <div className="py-10 text-center text-gray-600">Dang tai du lieu...</div>;
  if (error) return <div className="py-10 text-center text-red-500">Loi: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-10">
          <Link to="/" className="text-sm font-semibold text-primary">
            &larr; Quay lai trang chu
          </Link>

          <h1 className="mt-4 text-3xl font-black text-gray-900">
            Ket qua tim kiem {query ? `"${query}"` : ''}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tim thay {filteredProducts.length} san pham phu hop voi tu khoa cua ban.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {!query ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
            Vui long nhap tu khoa tim kiem.
          </div>
        ) : filteredProducts.length ? (
          <ProductSection title="San pham phu hop" items={filteredProducts.slice(0, 12)} variant="search" />
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
            Khong tim thay san pham phu hop. Ban co the thu tu khoa ngan hon hoac qua trang san pham de loc thu cong.
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;
