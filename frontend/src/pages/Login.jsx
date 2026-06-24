import { useEffect, useState } from 'react';
import { AlertCircle, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { notify, queueNotification } from '../utils/notifications';
import { ensureGoogleScriptLoaded } from '../utils/googleAuth';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const REMEMBER_LOGIN_KEY = 'rememberedLogin';

const getRememberedLogin = () => {
  const savedLogin = localStorage.getItem(REMEMBER_LOGIN_KEY);
  if (!savedLogin) return { emailOrPhone: '' };

  try {
    const saved = JSON.parse(savedLogin);
    const safeLogin = { emailOrPhone: saved.emailOrPhone || '' };
    localStorage.setItem(REMEMBER_LOGIN_KEY, JSON.stringify(safeLogin));
    return safeLogin;
  } catch {
    localStorage.removeItem(REMEMBER_LOGIN_KEY);
    return { emailOrPhone: '' };
  }
};

const Login = () => {
  const [savedLogin] = useState(getRememberedLogin);
  const [emailOrPhone, setEmailOrPhone] = useState(savedLogin.emailOrPhone || '');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(Boolean(savedLogin.emailOrPhone));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const account = emailOrPhone.trim();
    setError('');

    if (!account || !password) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password }),
      });

      if (response.status === 401) throw new Error('Tài khoản hoặc mật khẩu không đúng.');
      if (!response.ok) {
        throw new Error('Không thể đăng nhập. Vui lòng thử lại.');
      }

      const user = await response.json();
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          username: user.username,
          fullName: user.fullName || user.username,
          role: user.role,
          numphone: user.numphone || '',
          email: user.email || '',
        })
      );
      if (rememberPassword) {
        localStorage.setItem(REMEMBER_LOGIN_KEY, JSON.stringify({ emailOrPhone: account }));
      } else {
        localStorage.removeItem(REMEMBER_LOGIN_KEY);
      }

      queueNotification({ message: `Chào mừng ${user.username} quay lại!` });
      window.location.href = '/';
    } catch (err) {
      const message = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
      notify({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Load Google Identity script once (if env provided)
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return;
    ensureGoogleScriptLoaded().catch((e) => console.error(e));
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setError('');
      notify({ type: 'info', message: 'Đang đăng nhập bằng Google...' });

      const jwt = response?.credential;
      if (!jwt) throw new Error('Không nhận được dữ liệu từ Google');

      // Decode JWT (payload) để lấy email/name/photo gửi đúng format backend.
      const payload = JSON.parse(atob(jwt.split('.')[1]));

      const rawName = payload?.name || payload?.given_name || payload?.email;
      // Lấy username theo dạng giữ Unicode (không loại bỏ dấu)
      const googleUser = {
        email: payload?.email,
        name: rawName,
        picture: payload?.picture,
      };



      const res = await fetch(`${API_BASE_URL}/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: googleUser?.name,
          email: googleUser?.email,
          photo: googleUser?.picture,
          numphone: '',
        }),
      });


      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(t || 'Google login thất bại');
      }

      const user = await res.json();
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          username: user.username,
          fullName: user.fullName || user.username,
          role: user.role,
          numphone: user.numphone || '',
          email: user.email || '',
        })
      );
      queueNotification({ message: `Chào mừng ${user.username} quay lại!` });
      window.location.href = '/';
    } catch (err) {
      const message = err.message || 'Đăng nhập Google thất bại';
      setError(message);
      notify({ type: 'error', message });
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      description="Đăng nhập bằng email hoặc số điện thoại đã đăng ký."
      alternateText="Chưa có tài khoản?"
      alternateLink="/register"
      alternateLabel="Tạo tài khoản"
    >
      {error && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Login button */}
      <div className="mb-5">
        <div id="google-one-tap" className="mx-auto" />
        <button
          type="button"
          onClick={async () => {
            try {
              if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
                notify({ type: 'error', message: 'Chưa cấu hình VITE_GOOGLE_CLIENT_ID trong .env' });
                return;
              }

              const google = await ensureGoogleScriptLoaded();
              if (!google?.accounts?.id) {
                throw new Error('Google Identity Services chưa sẵn sàng');
              }

              google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
              });

              google.accounts.id.prompt();
            } catch (e) {
              console.error(e);
              notify({ type: 'error', message: 'Không thể mở đăng nhập Google' });
            }
          }}
          className="w-full flex items-center justify-center gap-2 rounded-full border bg-white px-6 py-3 font-semibold hover:bg-gray-50 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C34.53 32.656 29.315 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.038l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 16.108 19.283 14 24 14c3.059 0 5.842 1.154 7.961 3.038l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.196 0-13.442 3.958-17.694 9.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.268 0 10.046-2.053 13.617-5.374l-6.571-4.819C29.842 35.998 27.059 37 24 37c-5.315 0-10.53-3.344-12.303-8.001l-6.571 4.819C10.558 39.957 17.605 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.801 2.327-2.504 4.284-4.683 5.53l4.693 3.444C39.96 34.198 44 29.167 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Đăng nhập bằng Google
        </button>
      </div>


      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label htmlFor="login-account" className="mb-2 block text-sm font-semibold text-slate-700">
            Email hoặc số điện thoại
          </label>
          <div className="relative">
            <Mail size={19} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="login-account"
              type="text"
              value={emailOrPhone}
              onChange={(event) => setEmailOrPhone(event.target.value)}
              className="auth-input pl-11"
              placeholder="email@example.com hoặc 09xxxxxxxx"
              autoComplete="username"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-700">
            Mật khẩu
          </label>
          <div className="relative">
            <LockKeyhole size={19} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="auth-input px-11"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-primary"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rememberPassword}
            onChange={(event) => setRememberPassword(event.target.checked)}
            className="h-4 w-4 accent-primary"
            disabled={isSubmitting}
          />
          Ghi nhớ tài khoản
        </label>

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <LockKeyhole size={19} aria-hidden="true" />}
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
