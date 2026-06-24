import { CheckCircle2, ShieldCheck, Star, Zap } from 'lucide-react';

const buildStats = (stats) => [
  {
    icon: <ShieldCheck size={20} />,
    value: `${stats?.totalProducts || 0}+`,
    label: 'Sản phẩm đang cập nhật',
    description: 'Dễ lọc theo tầm giá, danh mục và thương hiệu.',
  },
  {
    icon: <Star size={20} />,
    value: `${stats?.featuredProducts || 0}+`,
    label: 'Mẫu nổi bật',
    description: 'Ưu tiên hiển thị các máy được đội ngũ chọn lọc.',
  },
  {
    icon: <Zap size={20} />,
    value: `${stats?.bestSellerProducts || 0}+`,
    label: 'Mẫu bán chạy',
    description: 'Gợi ý nhanh cho người muốn chọn theo thị hiếu thực tế.',
  },
  {
    icon: <CheckCircle2 size={20} />,
    value: `${stats?.totalCategories || 0}+`,
    label: 'Danh mục rõ ràng',
    description: 'Phân nhóm sản phẩm giúp so sánh và tìm kiếm đỡ mất thời gian.',
  },
];

export default function TrustStats({ stats }) {
  const statCards = buildStats(stats);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(225,29,72,0.18),_transparent_32%),linear-gradient(180deg,_#fff1f2,_#ffffff)] p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Thông số nổi bật
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight text-gray-900">
              Một trang chủ hiện đại cần vừa đẹp mắt, vừa giúp người mua quyết nhanh hơn
            </h2>
            <p className="mt-4 text-sm leading-8 text-gray-600">
              Dữ liệu từ backend được gom lại để hiển thị rõ sản phẩm nổi bật, mẫu bán chạy, danh mục nổi bật và
              khối khám phá nhanh ngay từ màn hình đầu tiên.
            </p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            {statCards.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div className="mt-4 text-3xl font-black text-gray-900">{item.value}</div>
                <div className="mt-2 text-sm font-bold uppercase tracking-wide text-gray-700">{item.label}</div>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
