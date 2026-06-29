import { useState } from 'react';
import { Clock, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { notify } from '../utils/notifications';

const branches = [
  { city: 'TP. Hồ Chí Minh', address: '70 Lữ Gia, Quận 11', phone: '1900 6750' },
  { city: 'Hà Nội', address: '266 Đội Cấn, Ba Đình', phone: '1900 6750' },
  { city: 'Đà Nẵng', address: '218 Nguyễn Văn Linh', phone: '1900 6750' },
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.subject || !form.message) {
      notify({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin liên hệ.' });
      return;
    }

    notify({ message: 'Đã ghi nhận thông tin liên hệ. Bạn có thể kết nối backend form sau nếu cần.' });
    setForm(initialForm);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#1e293b_52%,#2563eb)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="container relative mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-100">
              <Sparkles size={14} />
              Hỗ trợ & tư vấn
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Liên hệ với TD PHONE</h1>
            <p className="mt-4 max-w-2xl text-white/85">
              Luôn sẵn sàng hỗ trợ, giải đáp và tư vấn sản phẩm theo nhu cầu thực tế của bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="-mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: <MapPin size={18} />, title: 'Địa chỉ', value: '70 Lữ Gia, Quận 11, TP.HCM' },
            { icon: <Phone size={18} />, title: 'Hotline', value: '1900 6750' },
            { icon: <Mail size={18} />, title: 'Email', value: 'support@tdphone.vn' },
            { icon: <Clock size={18} />, title: 'Giờ làm việc', value: '08:00 - 22:00' },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl bg-primary/10 p-2 text-primary">{item.icon}</span>
                <div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="text-sm text-slate-600">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-black text-slate-900">Gửi thông tin liên hệ</h2>
            <p className="mt-2 text-sm text-slate-600">Điền thông tin, đội ngũ sẽ phản hồi sớm nhất có thể.</p>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Họ và tên"
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                />
                <input
                  className="auth-input"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Tiêu đề"
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                />
              </div>

              <textarea
                className="auth-input mt-4 min-h-[150px]"
                rows={6}
                placeholder="Nhập nội dung liên hệ..."
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              />

              <button type="submit" className="auth-submit mt-6 w-full">
                <Send size={18} />
                Gửi liên hệ
              </button>
            </form>
          </div>

          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <img
                className="h-full min-h-[320px] w-full object-cover"
                src="https://bizweb.dktcdn.net/100/527/928/themes/959512/assets/contact_banner.jpg"
                alt="contact"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0.5)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">Tư vấn nhanh</div>
                <div className="mt-2 text-2xl font-black">Chọn máy, kiểm tra hàng và hỗ trợ sau mua</div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#2563eb)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <h3 className="text-xl font-black">Kết nối nhanh</h3>
              <p className="mt-2 text-sm leading-7 text-slate-200/90">
                Nếu bạn cần tư vấn theo ngân sách, cấu hình, màu sắc hoặc bảo hành, hãy liên hệ trực tiếp để được hỗ trợ.
              </p>
              <div className="mt-5 space-y-3">
                {branches.map((branch) => (
                  <div key={branch.city} className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <div className="font-bold text-white">{branch.city}</div>
                    <div className="mt-1 text-sm text-slate-200">{branch.address}</div>
                    <div className="mt-2 text-sm font-bold text-blue-100">{branch.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xl font-black text-slate-900">Bản đồ</h2>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <iframe
              title="Google Map"
              className="h-[420px] w-full"
              src="https://maps.google.com/maps?q=Ho%20Chi%20Minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
