import { useMemo, useState } from 'react';
import { preorderBenefits, preorderFaq } from '../data/siteContent';
import { notify } from '../utils/notifications';

const initialForm = {
  fullName: '',
  phone: '',
  productName: '',
  color: '',
  storage: '',
  deposit: '',
};

const Preorder = () => {
  const [form, setForm] = useState(initialForm);
  const [savedEntries, setSavedEntries] = useState(() => {
    try {
      const stored = localStorage.getItem('preorderDrafts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const summary = useMemo(
    () => [
      { label: 'Phiên bản quan tâm', value: form.productName || 'Chưa chọn' },
      { label: 'Màu sắc', value: form.color || 'Tư vấn sau' },
      { label: 'Dung lượng', value: form.storage || 'Linh hoạt' },
    ],
    [form.color, form.productName, form.storage]
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.fullName || !form.phone || !form.productName) {
      notify({ type: 'error', message: 'Vui lòng nhập tên, số điện thoại và sản phẩm muốn đặt trước.' });
      return;
    }

    const nextEntries = [
      {
        ...form,
        createdAt: new Date().toISOString(),
      },
      ...savedEntries,
    ].slice(0, 5);

    setSavedEntries(nextEntries);
    localStorage.setItem('preorderDrafts', JSON.stringify(nextEntries));
    setForm(initialForm);
    notify({ message: 'Đã lưu yêu cầu đặt trước trên trình duyệt để bạn tiếp tục xử lý sau.' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(225,29,72,0.18),_transparent_38%),linear-gradient(135deg,#020617,#111827_55%,#3f0d1d)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">Đặt trước</p>
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Đặt trước sản phẩm mới, giữ ưu đãi và ưu tiên giao hàng
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-200 md:text-base">
                Gửi nhanh nhu cầu của bạn để đội ngũ chủ động tư vấn phiên bản, màu sắc, dung lượng và mức cọc phù hợp.
              </p>
              <div className="mt-6 grid gap-3">
                {preorderBenefits.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {summary.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="text-sm uppercase tracking-wide text-red-200">{item.label}</div>
                  <div className="mt-2 text-lg font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <form className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-100" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-black text-gray-900">Thông tin đặt trước</h2>
            <p className="mt-2 text-sm leading-7 text-gray-500">
              Trang này lưu nhanh trên trình duyệt để bạn không phải nhập lại khi cần trao đổi tiếp.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                className="auth-input"
                placeholder="Họ và tên"
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              />
              <input
                className="auth-input"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              />
              <input
                className="auth-input md:col-span-2"
                placeholder="Tên sản phẩm muốn đặt trước"
                value={form.productName}
                onChange={(event) => setForm((current) => ({ ...current, productName: event.target.value }))}
              />
              <input
                className="auth-input"
                placeholder="Màu sắc mong muốn"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
              />
              <input
                className="auth-input"
                placeholder="Dung lượng / phiên bản"
                value={form.storage}
                onChange={(event) => setForm((current) => ({ ...current, storage: event.target.value }))}
              />
              <input
                className="auth-input md:col-span-2"
                placeholder="Mức cọc dự kiến (nếu có)"
                value={form.deposit}
                onChange={(event) => setForm((current) => ({ ...current, deposit: event.target.value }))}
              />
            </div>

            <button type="submit" className="auth-submit mt-6">
              Lưu yêu cầu đặt trước
            </button>
          </form>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-2xl font-black text-gray-900">Câu hỏi thường gặp</h2>
              <div className="mt-5 space-y-4">
                {preorderFaq.map((item) => (
                  <div key={item.question} className="rounded-2xl bg-gray-50 p-4">
                    <div className="font-bold text-gray-900">{item.question}</div>
                    <div className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <h2 className="text-2xl font-black">Yêu cầu đã lưu gần đây</h2>
              <div className="mt-5 space-y-4">
                {savedEntries.length === 0 ? (
                  <div className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
                    Chưa có yêu cầu nào được lưu trên thiết bị này.
                  </div>
                ) : (
                  savedEntries.map((entry) => (
                    <div key={`${entry.phone}-${entry.createdAt}`} className="rounded-2xl bg-white/10 p-4">
                      <div className="font-bold">{entry.productName}</div>
                      <div className="mt-2 text-sm text-slate-200">
                        {entry.fullName} • {entry.phone}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {entry.color || 'Màu tư vấn sau'} • {entry.storage || 'Dung lượng linh hoạt'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Preorder;
