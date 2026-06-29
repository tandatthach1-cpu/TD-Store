import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, fetchJson, getPageContent, normalizeCategory } from '../../utils/storefront';

export default function CategoryShowcase({ items }) {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const categories = items?.length ? items : fetchedCategories;

  useEffect(() => {
    if (items?.length) return undefined;

    const loadCategories = async () => {
      try {
        const data = await fetchJson(`${API_BASE_URL}/categories?page=0&size=8`);
        setFetchedCategories(getPageContent(data).map(normalizeCategory));
      } catch {
        setFetchedCategories([]);
      }
    };

    loadCategories();
    return undefined;
  }, [items]);

  const categoriesToShow = (categories || []).slice(0, 4);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Danh mục nổi bật
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
            Đi nhanh vào đúng nhóm sản phẩm bạn cần
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-600">
            Trải nghiệm mới ưu tiên điều hướng ngắn hơn để người dùng không phải đi lòng vòng trước khi xem sản phẩm.
          </p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-gray-500 transition-colors hover:text-primary">
          Xem tất cả &rarr;
        </Link>
      </div>

      {!categoriesToShow.length ? (
        <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          Chưa có danh mục nào để hiển thị.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categoriesToShow.map((category, index) => (
            <Link
              key={category.id}
              to={
                typeof category.id === 'number'
                  ? `/category/${category.id}`
                  : `/category?name=${encodeURIComponent(category.title)}`
              }
            className="theme-card tilt-card group rounded-[1.75rem] bg-transparent p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4">
                {category.photo ? (
                  <img
                    src={category.photo}
                    alt={category.title}
                    className="h-16 w-16 rounded-3xl object-cover shadow-sm ring-1 ring-gray-100"
                  />
                ) : (
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-black uppercase transition ${
                      index % 4 === 0
                        ? 'bg-rose-100 text-rose-700'
                        : index % 4 === 1
                          ? 'bg-sky-100 text-sky-700'
                          : index % 4 === 2
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {String(category.title).slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="text-lg font-black text-gray-900 transition-colors group-hover:text-primary">
                {category.title}
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
