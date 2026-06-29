import { Headphones, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import authPhones from '../../assets/auth-phones.png';

const benefits = [
  { icon: ShieldCheck, label: 'Sản phẩm chính hãng' },
  { icon: Truck, label: 'Giao hàng toàn quốc' },
  { icon: Headphones, label: 'Hỗ trợ tận tâm' },
];

const AuthLayout = ({ title, description, children, alternateText, alternateLink, alternateLabel }) => {
  return (
    <div className="bg-slate-50 px-4 py-8 sm:py-12">
      <section className="mx-auto grid min-h-[660px] max-w-6xl overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-[#18212f] lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10 px-10 pt-10 text-white">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="TD PHONE - Trang chủ">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/10">
                <img src="/logo.jpg" alt="TD PHONE" className="h-full w-full object-cover" />
              </span>
              <span className="inline-flex items-baseline text-2xl font-black tracking-normal">
                <span className="text-rose-500">TD</span>&nbsp;PHONE
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-3xl font-bold leading-tight">
              Công nghệ mới,
              <br />
              trải nghiệm tốt hơn.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              Đăng nhập để mua sắm nhanh hơn và quản lý giỏ hàng của bạn trên mọi thiết bị.
            </p>
          </div>

          <img
            src={authPhones}
            alt="Bộ sưu tập điện thoại thông minh"
            className="absolute inset-x-0 bottom-0 h-[67%] w-full object-cover object-center"
          />

          <div className="relative z-10 grid grid-cols-3 border-t border-white/15 bg-slate-950/75 px-5 py-5 backdrop-blur-sm">
            {benefits.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 px-2 text-center text-xs font-medium text-white">
                <Icon size={20} className="text-rose-400" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-14">
          <div className="w-full max-w-2xl p-12">
            <Link to="/" className="mb-8 inline-flex items-center gap-3 lg:hidden" aria-label="TD PHONE - Trang chủ">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <img src="/logo.jpg" alt="TD PHONE" className="h-full w-full object-cover" />
              </span>
              <span className="inline-flex items-baseline text-xl font-black tracking-normal">
                <span className="text-primary">TD</span>&nbsp;PHONE
              </span>
            </Link>
            <div className="mb-7">
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </div>

            {children}

            <p className="mt-7 text-center text-sm text-slate-600">
              {alternateText}{' '}
              <Link to={alternateLink} className="font-semibold text-primary hover:underline">
                {alternateLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
