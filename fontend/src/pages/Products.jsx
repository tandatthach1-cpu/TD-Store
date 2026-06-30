import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Flame,
  LayoutGrid,
  Rows3,
  Search,
  Sparkles,
  SlidersHorizontal,
  Star,
  Tag,
  TrendingUp,
} from 'lucide-react';
import ProductCard from '../components/home/ProductCard';
import {
  API_BASE_URL,
  fetchJson,
  getPageContent,
  normalizeCategory,
  normalizeProduct,
  formatCurrency,
} from '../utils/storefront';

const sortOptions = [
  { value: 'featured', label: 'Nổi bật trước' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name', label: 'Tên A-Z' },
];

const quickFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'featured', label: 'Nổi bật' },
  { key: 'bestSeller', label: 'Bán chạy' },
  { key: 'promo', label: 'Giá tốt' },
];

const parsePriceInput = (value) => String(value || '').replace(/[^\d]/g, '');

const getInitialFilters = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('q') || '',
    category: params.get('category') || 'all',
    brandId: params.get('brandId') || 'all',
    sort: params.get('sort') || 'featured',
    quick: params.get('quick') || 'all',
    min: params.get('min') || '',
    max: params.get('max') || '',
    view: params.get('view') || 'grid',
  };
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const initialFilters = useMemo(getInitialFilters, []);
  const [search, setSearch] = useState(initialFilters.search);
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.category);
  const [brandFilter, setBrandFilter] = useState(initialFilters.brandId);
  const [sortBy, setSortBy] = useState(initialFilters.sort);
  const [quickFilter, setQuickFilter] = useState(initialFilters.quick);
  const [minPrice, setMinPrice] = useState(initialFilters.min);
  const [maxPrice, setMaxPrice] = useState(initialFilters.max);
  const [viewMode, setViewMode] = useState(initialFilters.view);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError('');

        const [productData, categoryData] = await Promise.all([
          fetchJson(`${API_BASE_URL}/products?page=0&size=100`),
          fetchJson(`${API_BASE_URL}/categories?page=0&size=100`),
        ]);

        setProducts(getPageContent(productData).map(normalizeProduct));
        setCategories(getPageContent(categoryData).map(normalizeCategory));
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const featuredCategories = useMemo(() => categories.slice(0, 6), [categories]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    let list = [...products];

    if (categoryFilter !== 'all') {
      list = list.filter((product) => String(product.categoryId) === String(categoryFilter));
    }

    if (brandFilter !== 'all') {
      list = list.filter((product) => String(product.brandId) === String(brandFilter));
    }

    if (quickFilter === 'featured') {
      list = list.filter((product) => product.featured);
    } else if (quickFilter === 'bestSeller') {
      list = list.filter((product) => product.bestSeller);
    } else if (quickFilter === 'promo') {
      list = list.filter((product) => product.hasDiscount);
    }

    if (keyword) {
      list = list.filter((product) =>
        [product.name, product.category, product.description]
          .filter(Boolean)
          .some((text) => String(text).toLowerCase().includes(keyword))
      );
    }

    if (Number.isFinite(min)) {
      list = list.filter((product) => Number(product.rawPrice || product.discountPrice || 0) >= min);
    }

    if (Number.isFinite(max)) {
      list = list.filter((product) => Number(product.rawPrice || product.discountPrice || 0) <= max);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.rawPrice - a.rawPrice);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else {
      list.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller));
    }

    return list;
  }, [brandFilter, categoryFilter, maxPrice, minPrice, products, quickFilter, search, sortBy]);

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
      { label: 'Tổng sản phẩm', value: `${products.length}+`, icon: <Sparkles size={18} /> },
      { label: 'Danh mục', value: `${categories.length}+`, icon: <Tag size={18} /> },
      { label: 'Nổi bật', value: `${products.filter((item) => item.featured).length}+`, icon: <Star size={18} /> },
      { label: 'Bán chạy', value: `${products.filter((item) => item.bestSeller).length}+`, icon: <TrendingUp size={18} /> },
    ],
    [categories.length, products]
  );

  const updateSearchParams = (key, value) => {
    const normalized = !value || value === 'all' ? 'all' : value;
    switch (key) {
      case 'q':
        setSearch(value || '');
        break;
      case 'category':
        setCategoryFilter(normalized);
        break;
      case 'brandId':
        setBrandFilter(normalized);
        break;
      case 'sort':
        setSortBy(normalized);
        break;
      case 'quick':
        setQuickFilter(normalized);
        break;
      case 'min':
        setMinPrice(value || '');
        break;
      case 'max':
        setMaxPrice(value || '');
        break;
      case 'view':
        setViewMode(normalized === 'list' ? 'list' : 'grid');
        break;
      default:
        break;
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setBrandFilter('all');
    setSortBy('featured');
    setQuickFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setViewMode('grid');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)] text-white">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -right-24 top-4 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-100 backdrop-blur">
                <Flame size={14} />
                Bộ sưu tập sản phẩm
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                Tập trung vào sản phẩm, lọc nhanh, xem nhanh.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                Khám phá smartphone, phụ kiện và sản phẩm nổi bật theo nhu cầu. Lọc theo danh mục, giá, trạng thái nổi bật
                và xem ngay các mẫu đang được quan tâm nhất.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-red-50"
                >
                  Tư vấn mua hàng
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/preorder"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Đặt trước sản phẩm mới
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-sm">{item.label}</span>
                    <span className="rounded-full bg-white/10 p-2">{item.icon}</span>
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Bộ lọc bên trái</div>
                  <div className="text-lg font-black text-slate-900">Lọc trong khi xem</div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Từ khóa</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => updateSearchParams('q', event.target.value)}
                      className="auth-input pl-11"
                      placeholder="Ví dụ: iPhone 15, Samsung..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Giá từ</label>
                    <input
                      inputMode="numeric"
                      value={minPrice}
                      onChange={(event) => updateSearchParams('min', parsePriceInput(event.target.value))}
                      className="auth-input"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Đến</label>
                    <input
                      inputMode="numeric"
                      value={maxPrice}
                      onChange={(event) => updateSearchParams('max', parsePriceInput(event.target.value))}
                      className="auth-input"
                      placeholder="20.000.000"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Danh mục</label>
                  <select
                    value={categoryFilter}
                    onChange={(event) => updateSearchParams('category', event.target.value)}
                    className="auth-input"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Sắp xếp</label>
                  <select
                    value={sortBy}
                    onChange={(event) => updateSearchParams('sort', event.target.value)}
                    className="auth-input"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {quickFilters.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => updateSearchParams('quick', item.key)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        quickFilter === item.key
                          ? 'border-primary bg-red-50 text-primary'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Xóa bộ lọc
                  </button>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.24em] text-slate-400">Đang xem</span>
                    {viewMode === 'grid' ? 'Dạng lưới' : 'Dạng danh sách'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSearchParams('view', 'grid')}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      viewMode === 'grid'
                        ? 'border-primary bg-red-50 text-primary'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary'
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Dạng lưới
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSearchParams('view', 'list')}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      viewMode === 'list'
                        ? 'border-primary bg-red-50 text-primary'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary'
                    }`}
                  >
                    <Rows3 size={16} />
                    Dạng danh sách
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Mẹo mua nhanh</div>
              <h3 className="mt-3 text-2xl font-black">Chọn đúng sản phẩm trong vài giây</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                <li>• Chọn danh mục để rút ngắn số sản phẩm cần xem.</li>
                <li>• Dùng khoảng giá để loại ngay các mẫu vượt ngân sách.</li>
                <li>• Ưu tiên nổi bật hoặc bán chạy nếu bạn chưa chắc nên chọn gì.</li>
              </ul>
            </div>
          </aside>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
                  <Sparkles size={14} />
                  Danh sách sản phẩm
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-900">Tất cả sản phẩm</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tìm thấy {filteredProducts.length} sản phẩm
                  {search ? ` cho từ khóa "${search}"` : ''}
                  {categoryFilter !== 'all' && categories.find((item) => String(item.id) === String(categoryFilter))
                    ? ` trong danh mục ${categories.find((item) => String(item.id) === String(categoryFilter))?.title}`
                    : ''}
                  .
                </p>
              </div>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
              >
                Xem hướng dẫn mua hàng
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {featuredCategories.map((category) => {
                const isActive = String(categoryFilter) === String(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => updateSearchParams('category', isActive ? 'all' : String(category.id))}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category.title}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              {loading && <div className="py-16 text-center text-slate-600">Đang tải sản phẩm...</div>}
              {error && <div className="py-16 text-center text-red-500">Lỗi: {error}</div>}

              {!loading && !error && !filteredProducts.length && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
                  <p className="mt-3 text-sm text-slate-500">
                    Thử đổi từ khóa, danh mục, khoảng giá hoặc chọn lại bộ lọc nhanh để xem thêm kết quả.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary"
                  >
                    Xóa bộ lọc và xem lại
                  </button>
                </div>
              )}

              {!loading && !error && filteredProducts.length > 0 && (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'
                      : 'grid gap-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode === 'grid' ? 'grid' : 'search'}
                      selected={selectedProductId === product.id}
                      onActivate={() => setSelectedProductId(product.id)}
                      onDeactivate={() => {
                        setSelectedProductId((current) => {
                          if (current !== product.id) return current;
                          const nextProduct = filteredProducts[0] || null;
                          return nextProduct ? nextProduct.id : null;
                        });
                      }}
                      activateOnHover
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed bottom-4 left-1/2 z-40 w-[min(100%-1rem,980px)] -translate-x-1/2">
          <div className="rounded-[1.6rem] border border-slate-200 bg-white/96 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="h-20 w-20 flex-none rounded-[1.2rem] bg-slate-100 object-contain p-2.5 md:h-24 md:w-24"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">Xem nhanh cố định</div>
                  <div className="truncate text-xl font-black text-slate-900 md:text-2xl">{selectedProduct.name}</div>
                  <div className="mt-1.5 text-sm text-slate-500">
                    {selectedProduct.category || 'Sản phẩm'} · {selectedProduct.hasDiscount ? 'Đang giảm giá' : 'Giá niêm yết'}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProduct.featured && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Nổi bật</span>
                    )}
                    {selectedProduct.bestSeller && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Bán chạy</span>
                    )}
                    {selectedProduct.hasDiscount && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Có ưu đãi</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Giá</div>
                  <div className="text-xl font-black text-primary md:text-2xl">
                    {selectedProduct.discountPriceStatic ?? selectedProduct.priceStatic ?? formatCurrency(selectedProduct.rawPrice)}
                  </div>
                </div>
                <Link
                  to={`/product/${selectedProduct.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary"
                >
                  Xem chi tiết
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
