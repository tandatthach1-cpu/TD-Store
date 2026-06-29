import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  UserRoundPlus,
  X,
} from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { notify, queueNotification } from '../utils/notifications';
import { setCurrentUser } from '../utils/storefront';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = useMemo(() => [
    { label: 'Ít nhất 8 ký tự', valid: password.length >= 8 },
    { label: 'Có chữ hoa và chữ thường', valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Có ít nhất một chữ số', valid: /\d/.test(password) },
  ], [password]);

  const passwordScore = passwordChecks.filter((item) => item.valid).length;
  const strengthLabel = ['', 'Yếu', 'Khá', 'Mạnh'][passwordScore];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'][passwordScore];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/[\s.-]/g, '');

    let validationError = '';
    if (cleanName.length < 2) validationError = 'Họ và tên cần có ít nhất 2 ký tự.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) validationError = 'Email chưa đúng định dạng.';
    else if (!/^(0\d{9}|\+84\d{9})$/.test(cleanPhone)) validationError = 'Số điện thoại cần có 10 số và bắt đầu bằng 0.';
    else if (passwordScore < 3) validationError = 'Mật khẩu chưa đáp ứng đủ các yêu cầu.';
    else if (password !== confirm) validationError = 'Mật khẩu xác nhận chưa khớp.';
    else if (!acceptedTerms) validationError = 'Vui lòng đồng ý với điều khoản sử dụng.';

    if (validationError) {
      setError(validationError);
      notify({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);
    try {
      const query = new URLSearchParams({
        username: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
      });
      const availabilityResponse = await fetch(`${API_BASE_URL}/users/availability?${query}`);
      if (!availabilityResponse.ok) {
        throw new Error('Không thể kết nối máy chủ. Vui lòng thử lại.');
      }

      const availability = await availabilityResponse.json();
      if (!availability.usernameAvailable) throw new Error('Tên tài khoản này đã được sử dụng.');
      if (!availability.emailAvailable) throw new Error('Email này đã được đăng ký.');
      if (!availability.phoneAvailable) throw new Error('Số điện thoại này đã được đăng ký.');

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanName,
          email: cleanEmail,
          numphone: cleanPhone,
          pass: password,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Đăng ký không thành công.');
      }

      const created = await response.json();
      setCurrentUser({ id: created.id, username: created.username, role: created.role });
      queueNotification({ message: 'Tạo tài khoản thành công. Chào mừng bạn đến với TD PHONE!' });
      window.location.href = '/';
    } catch (err) {
      const message = err.message || 'Đăng ký không thành công. Vui lòng thử lại.';
      setError(message);
      notify({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      id: 'register-name',
      label: 'Họ và tên',
      type: 'text',
      value: name,
      onChange: setName,
      placeholder: 'Nguyễn Văn An',
      autoComplete: 'name',
      icon: UserRound,
    },
    {
      id: 'register-email',
      label: 'Email',
      type: 'email',
      value: email,
      onChange: setEmail,
      placeholder: 'email@example.com',
      autoComplete: 'email',
      icon: Mail,
    },
    {
      id: 'register-phone',
      label: 'Số điện thoại',
      type: 'tel',
      value: phone,
      onChange: setPhone,
      placeholder: '09xxxxxxxx',
      autoComplete: 'tel',
      icon: Phone,
    },
  ];

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      description="Chỉ mất một phút để bắt đầu mua sắm cùng TD PHONE."
      alternateText="Đã có tài khoản?"
      alternateLink="/login"
      alternateLabel="Đăng nhập"
    >
      {error && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {inputFields.map(({ id, label, type, value, onChange, placeholder, autoComplete, icon: Icon }, index) => (
            <div key={id} className={index === 0 ? 'sm:col-span-2' : ''}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
              <div className="relative">
                <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  className="auth-input pl-11"
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Mật khẩu</label>
            <PasswordInput
              id="register-password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="register-confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">Xác nhận mật khẩu</label>
            <PasswordInput
              id="register-confirm"
              value={confirm}
              onChange={setConfirm}
              visible={showConfirm}
              onToggle={() => setShowConfirm((current) => !current)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {password && (
          <div className="border border-slate-200 bg-slate-50 p-3" aria-live="polite">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Độ mạnh mật khẩu</span>
              <span className={passwordScore === 3 ? 'text-emerald-600' : passwordScore === 2 ? 'text-amber-600' : 'text-red-600'}>
                {strengthLabel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((level) => (
                <span key={level} className={`h-1.5 ${passwordScore >= level ? strengthColor : 'bg-slate-200'}`} />
              ))}
            </div>
            <div className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
              {passwordChecks.map(({ label, valid }) => (
                <span key={label} className={`flex items-center gap-1.5 ${valid ? 'text-emerald-600' : ''}`}>
                  {valid ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
                  {label}
                </span>
              ))}
              {confirm && (
                <span className={`flex items-center gap-1.5 ${confirm === password ? 'text-emerald-600' : 'text-red-600'}`}>
                  {confirm === password ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
                  {confirm === password ? 'Mật khẩu đã khớp' : 'Mật khẩu chưa khớp'}
                </span>
              )}
            </div>
          </div>
        )}

        <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-slate-600">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            disabled={isSubmitting}
          />
          Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
        </label>

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <UserRoundPlus size={19} aria-hidden="true" />}
          {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </button>
      </form>
    </AuthLayout>
  );
};

const PasswordInput = ({ id, value, onChange, visible, onToggle, autoComplete, disabled }) => (
  <div className="relative">
    <LockKeyhole size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    <input
      id={id}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="auth-input px-11"
      placeholder="Ít nhất 8 ký tự"
      autoComplete={autoComplete}
      disabled={disabled}
      required
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-primary"
      aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      title={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export default Register;
