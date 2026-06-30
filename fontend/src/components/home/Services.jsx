import { CreditCard, Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const services = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Chính hãng minh bạch',
    description: 'Nguồn gốc rõ ràng, thông tin bảo hành và phiên bản được hiển thị dễ kiểm tra.',
  },
  {
    icon: <Truck size={22} />,
    title: 'Giao nhanh linh hoạt',
    description: 'Ưu tiên xử lý sớm các đơn cần giao nhanh và luôn có cập nhật trạng thái rõ ràng.',
  },
  {
    icon: <CreditCard size={22} />,
    title: 'Thanh toán thuận tiện',
    description: 'Hỗ trợ nhiều hình thức thanh toán, dễ theo dõi giá cuối cùng trước khi xác nhận.',
  },
  {
    icon: <RotateCcw size={22} />,
    title: 'Đổi trả dễ hiểu',
    description: 'Quy trình tiếp nhận và hỗ trợ sau bán được trình bày rõ, bớt cảm giác rối khi cần xử lý.',
  },
  {
    icon: <Headphones size={22} />,
    title: 'Tư vấn theo nhu cầu',
    description: 'Tập trung vào cách bạn dùng máy thật sự thay vì chỉ đẩy cấu hình cao nhất.',
  },
];

export default function Services() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {services.map((item) => (
          <div
            key={item.title}
            className="group rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
              {item.icon}
            </div>
            <h3 className="mt-4 text-base font-black text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
