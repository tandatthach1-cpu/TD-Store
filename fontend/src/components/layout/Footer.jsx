import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { notify } from '../../utils/notifications';

const footerLinks = {
  'Khám phá': [
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Danh mục', href: '/category' },
    { label: 'Đặt trước', href: '/preorder' },
    { label: 'Đánh giá', href: '/reviews' },
  ],
  'Hỗ trợ': [
    { label: 'Tra cứu bảo hành', href: '/warranty' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Lịch sử đơn hàng', href: '/orders' },
  ],
  'Chính sách': [
    { label: 'Giao hàng', href: '/contact' },
    { label: 'Đổi trả', href: '/contact' },
    { label: 'Bảo mật', href: '/contact' },
    { label: 'Điều khoản', href: '/contact' },
  ],
};

const trustCards = [
  {
    icon: <ShieldCheck size={18} />,
    title: 'Chính hãng',
    description: 'Nguồn gốc minh bạch, bảo hành rõ ràng.',
  },
  {
    icon: <Truck size={18} />,
    title: 'Giao nhanh',
    description: 'Xử lý đơn và vận chuyển tối ưu.',
  },
  {
    icon: <BadgeCheck size={18} />,
    title: 'Đổi trả',
    description: 'Hỗ trợ đổi trả theo chính sách áp dụng.',
  },
];

const quickChannels = [
  { icon: BellRing, label: 'Tin mới' },
  { icon: Sparkles, label: 'Ưu đãi' },
  { icon: BadgeCheck, label: 'Bảo hành' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      notify({ type: 'error', message: 'Vui lòng nhập email để nhận ưu đãi.' });
      return;
    }

    notify({ message: 'Đã ghi nhận email nhận ưu đãi.' });
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_30%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,1))]">
        <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Ưu đãi mỗi tuần
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
              Nhận ưu đãi, sản phẩm mới và tin bảo hành ngay khi có cập nhật.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Đăng ký để nhận thông tin về sản phẩm mới, deal nổi bật và hướng dẫn sử dụng, bảo hành, đổi trả một cách
              nhanh nhất.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur">
            <label className="mb-3 block text-sm font-semibold text-slate-200">Đăng ký nhận ưu đãi</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email của bạn"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Đăng ký
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/10">
                <img src="/logo.jpg" alt="TD PHONE" className="h-full w-full object-cover" />
              </div>
              <div className="text-2xl font-black tracking-wide">
                TD <span className="text-red-400">PHONE</span>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Hệ thống bán lẻ điện thoại chính hãng, tối ưu trải nghiệm xem sản phẩm, đặt hàng và theo dõi đơn.
            </p>

            <div className="mt-6 grid gap-3">
              {trustCards.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                  <div className="mt-0.5 rounded-xl bg-white/10 p-2 text-red-300">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-slate-300">{title}</h3>
                <ul className="space-y-3 text-sm">
                  {links.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href} className="text-slate-400 transition hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-slate-300">Liên hệ nhanh</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                <span className="mt-0.5 text-red-300">
                  <Phone size={16} />
                </span>
                <div>
                  <div className="font-semibold text-white">Hotline</div>
                  <div>1900 1234</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                <span className="mt-0.5 text-red-300">
                  <Mail size={16} />
                </span>
                <div>
                  <div className="font-semibold text-white">Email</div>
                  <div>support@tdphone.vn</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                <span className="mt-0.5 text-red-300">
                  <MapPin size={16} />
                </span>
                <div>
                  <div className="font-semibold text-white">Showroom</div>
                  <div>Hệ thống cửa hàng trên toàn quốc</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Kênh nhanh</div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {quickChannels.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 text-center text-[11px] font-semibold text-slate-200"
                    >
                      <Icon size={18} />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-slate-500">© {new Date().getFullYear()} TD Phone. Bảo lưu mọi quyền.</div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <Link to="/contact" className="transition hover:text-white">
              Chính sách
            </Link>
            <span>•</span>
            <Link to="/faq" className="transition hover:text-white">
              Điều khoản
            </Link>
            <span>•</span>
            <Link to="/warranty" className="transition hover:text-white">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
