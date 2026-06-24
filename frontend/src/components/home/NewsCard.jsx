import { ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsCard = ({ item }) => {
  return (
    <Link
      to="/news"
      className="group overflow-hidden rounded-[1.85rem] border border-slate-200/80 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.12)_42%,rgba(15,23,42,0.86)_100%)]" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-900 shadow-lg backdrop-blur">
            <Sparkles size={12} className="text-primary" />
            {item.category}
          </span>
          <span className="rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white backdrop-blur">
            TƯ VẤN
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          <CalendarDays size={12} />
          <span>{item.date}</span>
        </div>
        <h3 className="mb-3 line-clamp-2 text-[1.08rem] font-black leading-7 text-slate-900 transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-sm leading-7 text-slate-600">{item.description}</p>
        <div className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-3">
          Đọc tiếp
          <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
