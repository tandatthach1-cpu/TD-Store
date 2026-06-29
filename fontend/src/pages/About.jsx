import { Link } from 'react-router-dom';
import { aboutStats, aboutValues } from '../data/siteContent';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(225,29,72,0.14),_transparent_36%),linear-gradient(135deg,#0f172a,#111827_55%,#3f0d1d)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-red-200">Về TD Phone</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Một cửa hàng công nghệ được xây để việc mua máy dễ hiểu và dễ tin hơn
            </h1>
            <p className="mt-5 text-sm leading-8 text-slate-200 md:text-base">
              Chúng tôi phát triển theo hướng tư vấn thẳng thắn, minh bạch thông tin và xem hậu mãi là một phần của
              trải nghiệm mua hàng, không phải bước phát sinh sau cùng.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-red-50"
              >
                Xem sản phẩm
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Liên hệ đội ngũ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {aboutStats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="text-4xl font-black text-primary">{item.value}</div>
              <div className="mt-2 text-sm font-semibold text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-3xl font-black text-gray-900">Vì sao nhiều người mua hàng quay lại</h2>
            <div className="mt-6 space-y-5">
              {aboutValues.map((item) => (
                <div key={item.title} className="rounded-3xl bg-gray-50 p-5">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <h2 className="text-3xl font-black">Cách chúng tôi vận hành</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                <p>
                  Từ khâu chọn nguồn hàng, chuẩn hóa thông tin sản phẩm đến quy trình giao hàng, mỗi bước đều nhằm giảm
                  bớt sự mơ hồ khi khách mua điện thoại và phụ kiện.
                </p>
                <p>
                  Nếu chưa chắc nên mua dòng nào, đội ngũ ưu tiên hỏi về nhu cầu thật của bạn trước khi đề xuất cấu
                  hình hay tầm giá.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-2xl font-black text-gray-900">Dịch vụ đồng hành sau mua</h2>
              <div className="mt-5 grid gap-4">
                {[
                  'Hỗ trợ sao lưu, chuyển dữ liệu và cài đặt nhanh.',
                  'Gợi ý phụ kiện đồng bộ cho từng dòng máy.',
                  'Hướng dẫn bảo hành, đổi trả và quy trình tiếp nhận máy.',
                  'Tư vấn nâng cấp hoặc trade-in khi cần lên đời máy.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
