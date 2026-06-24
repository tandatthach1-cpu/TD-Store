import { useState } from 'react';
import { warrantySteps } from '../data/siteContent';
import { API_BASE_URL } from '../utils/storefront';

const statusTextMap = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
  PROCESSING: 'Đang xử lý',
};

const getDisplayStatus = (value) => {
  const key = String(value || '').trim().toUpperCase();
  return statusTextMap[key] || value || 'Đang xử lý';
};

const Warranty = () => {
  const [lookupId, setLookupId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (event) => {
    event.preventDefault();

    if (!lookupId.trim()) {
      setError('Vui lòng nhập mã đơn hàng hoặc mã tiếp nhận.');
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await fetch(`${API_BASE_URL}/orders/${lookupId.trim()}`);
      if (!response.ok) {
        throw new Error('Không tìm thấy thông tin phù hợp.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Không thể tra cứu lúc này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-14">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Bảo hành & chăm sóc</p>
          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">
            Tra cứu bảo hành và tình trạng tiếp nhận
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-gray-600">
            Trang này sử dụng backend hiện có để tra cứu theo mã đơn, đồng thời hướng dẫn quy trình tiếp nhận bảo hành
            và cập nhật trạng thái.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
            <h2 className="text-3xl font-black">Tra cứu nhanh</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Nhập mã đơn hàng hoặc mã tiếp nhận. Nếu hệ thống tìm thấy, thông tin trạng thái hiện tại sẽ hiển thị ở
              khung bên phải.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleLookup}>
              <input
                className="auth-input !border-white/10 !bg-white/10 !text-white placeholder:!text-slate-400"
                placeholder="Ví dụ: 1024"
                value={lookupId}
                onChange={(event) => setLookupId(event.target.value)}
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-red-50 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Đang tra cứu...' : 'Tra cứu ngay'}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              {warrantySteps.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/10 p-4">
                  <div className="font-bold">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-300">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-black text-gray-900">Kết quả tra cứu</h2>
            <p className="mt-2 text-sm text-gray-500">
              Trạng thái đơn hàng hoặc phiếu tiếp nhận sẽ được cập nhật tại đây.
            </p>

            {error && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            {!error && !result && (
              <div className="mt-6 rounded-3xl bg-gray-50 px-6 py-16 text-center text-sm text-gray-500">
                Chưa có kết quả. Hãy nhập mã đơn để bắt đầu tra cứu.
              </div>
            )}

            {result && (
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                  <div className="text-sm text-gray-500">Mã đơn</div>
                  <div className="mt-1 text-2xl font-black text-gray-900">#{result.id}</div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                  <div className="text-sm text-gray-500">Trạng thái</div>
                  <div className="mt-1 text-lg font-bold text-primary">{getDisplayStatus(result.status)}</div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                  <div className="text-sm text-gray-500">Địa chỉ nhận / tiếp nhận</div>
                  <div className="mt-1 text-sm leading-7 text-gray-700">{result.address || 'Đang cập nhật'}</div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                  <div className="text-sm text-gray-500">Ngày tạo</div>
                  <div className="mt-1 text-sm font-semibold text-gray-800">
                    {result.date ? new Date(result.date).toLocaleString('vi-VN') : 'Đang cập nhật'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Warranty;
