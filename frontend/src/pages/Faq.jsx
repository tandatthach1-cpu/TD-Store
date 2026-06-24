import { useState } from 'react';
import { faqItems } from '../data/siteContent';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-14">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/70">FAQ</p>
          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">Câu hỏi thường gặp trước khi đặt mua</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-gray-600">
            Tổng hợp các câu hỏi về hàng chính hãng, giao nhận, đổi trả, trade-in và hóa đơn để bạn thao tác nhanh hơn trên hệ
            thống.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
            <h2 className="text-3xl font-black">Cần tìm nhanh?</h2>
            <div className="mt-6 space-y-3">
              {faqItems.map((item, index) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeIndex === index ? 'bg-white text-slate-950' : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const open = index === activeIndex;

              return (
                <div key={item.question} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-lg font-bold text-gray-900">{item.question}</span>
                    <span className="text-2xl font-black text-primary">{open ? '−' : '+'}</span>
                  </button>
                  {open && <p className="mt-4 text-sm leading-8 text-gray-600">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
