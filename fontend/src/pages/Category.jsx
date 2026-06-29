import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import FixedQuickView from '../components/home/FixedQuickView';
import { API_BASE_URL, fetchJson, getPageContent, normalizeCategory, normalizeProduct } from '../utils/storefront';

const sortOptions = [
  { value: 'featured', label: 'Ưu tiên nổi bật' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name', label: 'Tên A-Z' },
];

const quickFilters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'featured', label: 'Nổi bật' },
  { value: 'bestSeller', label: 'Bán chạy' },
  { value: 'discount', label: 'Đang giảm giá' },
];

export default function Category() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const categoryName = (searchParams.get('name') || '').trim();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [relatedCategories, setRelatedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        setError('');

        const categoryData = await fetchJson(`${API_BASE_URL}/categories?page=0&size=100`);
        const allCategories = getPageContent(categoryData).map(normalizeCategory);
        setRelatedCategories(allCategories.slice(0, 8));

        let matchedCategory = null;
        let productData = null;

        if (id) {
          matchedCategory = allCategories.find((item) => String(item.id) === String(id)) || null;
          productData = await fetchJson(`${API_BASE_URL}/products/category/${id}?page=0&size=100`);
        } else if (categoryName) {
          matchedCategory =
            allCategories.find((item) => item.title.toLowerCase() === categoryName.toLowerCase()) || null;

          if (matchedCategory?.id) {
            productData = await fetchJson(`${API_BASE_URL}/products/category/${matchedCategory.id}?page=0&size=100`);
          } else {
            productData = await fetchJson(
              `${API_BASE_URL}/products/category/title/${encodeURIComponent(categoryName)}?page=0&size=100`
            );
          }
        } else {
          throw new Error('Danh mục không hợp lệ');
        }

        setCategory(matchedCategory);
        setProducts(getPageContent(productData).map(normalizeProduct));
      } catch (err) {
        setError(err.message || 'Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryName, id]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    let list = [...products];

    if (keyword) {
      list = list.filter((product) =>
        [product.name, product.category, product.description]
          .filter(Boolean)
          .some((text) => String(text).toLowerCase().includes(keyword))
      );
    }

    if (quickFilter === 'featured') {
      list = list.filter((product) => product.featured);
    } else if (quickFilter === 'bestSeller') {
      list = list.filter((product) => product.bestSeller);
    } else if (quickFilter === 'discount') {
      list = list.filter((product) => product.hasDiscount);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.rawPrice - a.rawPrice);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller));
    }

    return list;
  }, [products, quickFilter, search, sortBy]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelectedProductId(null);
      return;
    }

    setSelectedProductId((current) => {
      const exists = filteredProducts.some((product) => product.id === current);
      return exists ? current : filteredProducts[0].id;
    });
  }, [filteredProducts]);

  const selectedProduct = useMemo(
    () => filteredProducts.find((product) => product.id === selectedProductId) || filteredProducts[0] || null,
    [filteredProducts, selectedProductId]
  );

  const stats = useMemo(
    () => [
      { label: 'Sản phẩm', value: products.length },
      { label: 'Nổi bật', value: products.filter((product) => product.featured).length },
      { label: 'Bán chạy', value: products.filter((product) => product.bestSeller).length },
    ],
    [products]
  );

  const title = category?.title || categoryName || 'Danh mục sản phẩm';
  const hasActiveFilters = Boolean(search || quickFilter !== 'all' || sortBy !== 'featured');
  const activeFilterLabel = quickFilters.find((item) => item.value === quickFilter)?.label || 'Tất cả';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(225,29,72,0.22),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#111827_48%,_#1f2937_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link to="/products" className="font-semibold text-white/90 transition hover:text-white">
              &larr; Quay lại catalog
            </Link>
            <span className="text-white/30">/</span>
            <span>Danh mục</span>
          </div>

          <div className="mt-8 grid gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-red-100 backdrop-blur">
                Collection
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl xl:text-6xl">{title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                {category?.description ||
                  'Bộ lọc nhanh, sắp xếp thông minh và thông tin rõ ràng giúp bạn chọn đúng sản phẩm trong danh mục này.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-red-50"
                >
                  Tư vấn nhanh
                </Link>
                <Link
                  to="/products"
                  className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Xem toàn bộ catalog
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[1.35rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 lg:py-10">
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-black text-slate-900">Tìm và lọc</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Từ khóa</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="auth-input"
                    placeholder="Ví dụ: iPhone, Samsung, tai nghe..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Sắp xếp</label>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="auth-input">
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">Lọc nhanh</label>
                  <div className="flex flex-wrap gap-2">
                    {quickFilters.map((item) => {
                      const active = quickFilter === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setQuickFilter(item.value)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            active
                              ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSortBy('featured');
                    setQuickFilter('all');
                    setViewMode('grid');
                  }}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    hasActiveFilters
                      ? 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  Khôi phục mặc định
                </button>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-900">Danh mục khác</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                  {relatedCategories.length}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {relatedCategories
                  .filter((item) => String(item.id) !== String(category?.id))
                  .slice(0, 3)
                  .map((item, index) => (
                    <Link
                      key={item.id}
                      to={`/category/${item.id}`}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-primary/20 hover:bg-primary/5"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${
                          index % 4 === 0
                            ? 'bg-rose-100 text-rose-700'
                            : index % 4 === 1
                              ? 'bg-sky-100 text-sky-700'
                              : index % 4 === 2
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {String(item.title).slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-800 transition group-hover:text-primary">
                          {item.title}
                        </div>
                        <div className="truncate text-xs text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Sản phẩm trong danh mục</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {loading
                      ? 'Đang tải dữ liệu...'
                      : `Tìm thấy ${filteredProducts.length} sản phẩm ${hasActiveFilters ? `theo lọc ${activeFilterLabel}` : ''}.`}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Lưới
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Danh sách
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {search && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                      Từ khóa: {search}
                    </span>
                  )}
                  {quickFilter !== 'all' && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      Lọc nhanh: {activeFilterLabel}
                    </span>
                  )}
                  {sortBy !== 'featured' && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                      Sắp xếp: {sortOptions.find((item) => item.value === sortBy)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[420px] animate-pulse rounded-[1.9rem] bg-white shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="m-4 h-56 rounded-[1.5rem] bg-slate-100" />
                    <div className="mx-4 h-4 rounded-full bg-slate-100" />
                    <div className="mx-4 mt-3 h-3 w-2/3 rounded-full bg-slate-100" />
                    <div className="mx-4 mt-5 h-10 rounded-2xl bg-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-14 text-center text-rose-700">
                <h3 className="text-xl font-black">Lỗi tải dữ liệu</h3>
                <p className="mt-3 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && !filteredProducts.length && (
              <div className="rounded-[1.75rem] bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
                <h3 className="text-xl font-black text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                  Thử xóa bớt từ khóa, đổi danh sách lọc nhanh hoặc quay lại danh mục khác để xem thêm kết quả.
                </p>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant="search"
                        onActivate={() => setSelectedProductId(product.id)}
                        activateOnHover
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group grid gap-4 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[180px_1fr]"
                      >
                        <div className="overflow-hidden rounded-[1.4rem] bg-slate-50">
                          <div className="aspect-[4/3]">
                            <img
                              src={product.img}
                              alt={product.name}
                              className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              {product.bestSeller && (
                                <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-black text-white">
                                  Bán chạy
                                </span>
                              )}
                              {product.featured && (
                                <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-black text-white">
                                  Nổi bật
                                </span>
                              )}
                              {product.hasDiscount && (
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-700">
                                  Đang giảm giá
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3 text-xl font-black leading-snug text-slate-900 transition group-hover:text-primary">
                              {product.name}
                            </h3>
                            <p className="mt-2 line-clamp-3 max-w-3xl text-sm leading-7 text-slate-500">
                              {product.description || 'Sản phẩm trong danh mục này đang cập nhật mô tả.'}
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="text-2xl font-black text-primary">
                                {product.discountPriceStatic ?? product.priceStatic ?? product.price}
                              </div>
                              {product.hasDiscount ? (
                                <div className="mt-1 text-sm text-slate-500">
                                  Giá gốc: <span className="line-through">{product.originalPriceStatic}</span>
                                </div>
                              ) : (
                                <div className="mt-1 text-sm text-slate-500">Bảo hành chính hãng</div>
                              )}
                            </div>

                            <div className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition group-hover:bg-primary">
                              Xem chi tiết
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <FixedQuickView product={selectedProduct} />
    </div>
  );
}
