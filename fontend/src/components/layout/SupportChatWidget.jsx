import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, ChevronDown, MessageCircleMore, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AUTH_CHANGE_EVENT, getCurrentUser } from '../../utils/storefront';

const GUEST_STORAGE_KEY = 'tdphone-support-chat';
const storageKeyForUser = (user) => (user?.id ? `tdphone-support-chat-user-${user.id}` : GUEST_STORAGE_KEY);

const starterMessages = [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Xin chào, mình là trợ lý TD PHONE. Bạn muốn tư vấn theo giá, pin, camera hay bảo hành?',
    time: Date.now(),
  },
];

const quickPrompts = [
  { label: 'Tư vấn theo giá', value: 'Tôi muốn mua điện thoại theo tầm giá' },
  { label: 'Pin tốt', value: 'Tôi cần máy pin trâu' },
  { label: 'Camera đẹp', value: 'Tôi cần máy chụp ảnh đẹp' },
  { label: 'Bảo hành', value: 'Tôi muốn xem bảo hành' },
];

const loadMessages = () => {
  if (typeof window === 'undefined') return starterMessages;

  const user = getCurrentUser();
  const key = storageKeyForUser(user);

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;

    if (key !== GUEST_STORAGE_KEY) {
      const fallbackRaw = window.localStorage.getItem(GUEST_STORAGE_KEY);
      const fallbackParsed = fallbackRaw ? JSON.parse(fallbackRaw) : null;
      if (Array.isArray(fallbackParsed) && fallbackParsed.length > 0) return fallbackParsed;
    }
  } catch {
    // ignore storage errors
  }

  return starterMessages;
};

const createReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes('bảo hành') || text.includes('bao hanh')) {
    return {
      text: 'Bạn có thể xem trang Bảo hành để kiểm tra thông tin và quyền lợi sau mua. Nếu cần hỗ trợ nhanh, hãy vào trang Liên hệ.',
      action: { label: 'Mở Bảo hành', href: '/warranty' },
    };
  }

  if (text.includes('đặt trước') || text.includes('preorder')) {
    return {
      text: 'Các mẫu sắp ra mắt thường nằm ở trang Đặt trước. Bạn có thể xem danh sách và theo dõi cập nhật giá.',
      action: { label: 'Mở Đặt trước', href: '/preorder' },
    };
  }

  if (text.includes('camera') || text.includes('chụp ảnh') || text.includes('chup anh')) {
    return {
      text: 'Nếu ưu tiên camera, bạn nên chọn các mẫu flagship hoặc dòng có nổi bật về chụp đêm. Vào trang Sản phẩm để lọc thêm theo nhu cầu.',
      action: { label: 'Xem sản phẩm', href: '/products' },
    };
  }

  if (text.includes('pin') || text.includes('pin trâu') || text.includes('battery')) {
    return {
      text: 'Nếu bạn cần pin tốt, hãy ưu tiên các mẫu máy tầm trung có dung lượng pin lớn và tiết kiệm điện. Mình có thể giúp bạn tìm trong trang Sản phẩm.',
      action: { label: 'Xem sản phẩm', href: '/products' },
    };
  }

  if (
    text.includes('giá') ||
    text.includes('gia') ||
    text.includes('rẻ') ||
    text.includes('re') ||
    text.includes('ngân sách') ||
    text.includes('ngan sach')
  ) {
    return {
      text: 'Để chọn theo giá, bạn nên vào trang Sản phẩm và dùng bộ lọc. Nếu muốn, mình có thể hướng sang trang tìm kiếm ngay.',
      action: { label: 'Tìm sản phẩm', href: '/products' },
    };
  }

  if (text.includes('liên hệ') || text.includes('lien he') || text.includes('hotline')) {
    return {
      text: 'Bạn có thể liên hệ trực tiếp qua trang Liên hệ để gửi thông tin hoặc nhắn chi tiết nhu cầu.',
      action: { label: 'Mở Liên hệ', href: '/contact' },
    };
  }

  return {
    text: 'Mình có thể hỗ trợ bạn chọn máy theo giá, pin, camera, bảo hành hoặc đặt trước. Hãy mô tả nhu cầu ngắn gọn, mình sẽ gợi ý hướng phù hợp.',
    action: { label: 'Xem sản phẩm', href: '/products' },
  };
};

const SupportChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => loadMessages());
  const [user, setUser] = useState(() => getCurrentUser());
  const endRef = useRef(null);
  const currentStorageKey = storageKeyForUser(user);

  useEffect(() => {
    try {
      window.localStorage.setItem(currentStorageKey, JSON.stringify(messages));
    } catch {
      // ignore storage issues
    }
  }, [currentStorageKey, messages]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }, [messages, open]);

  useEffect(() => {
    const syncUserChat = () => {
      setUser(getCurrentUser());
      setMessages(loadMessages());
    };

    window.addEventListener('focus', syncUserChat);
    window.addEventListener('storage', syncUserChat);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUserChat);

    return () => {
      window.removeEventListener('focus', syncUserChat);
      window.removeEventListener('storage', syncUserChat);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUserChat);
    };
  }, []);

  const unread = useMemo(() => Math.max(0, messages.filter((item) => item.role === 'bot').length - 1), [messages]);

  const pushMessage = (role, text, extra = {}) => {
    setMessages((current) => [
      ...current,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        text,
        time: Date.now(),
        ...extra,
      },
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;

    pushMessage('user', query);
    setInput('');

    window.setTimeout(() => {
      const reply = createReply(query);
      pushMessage('bot', reply.text, { action: reply.action });
    }, 300);
  };

  const handleQuickPrompt = (value) => {
    setInput(value);
    pushMessage('user', value);
    window.setTimeout(() => {
      const reply = createReply(value);
      pushMessage('bot', reply.text, { action: reply.action });
    }, 250);
  };

  const handleReset = () => {
    setMessages(starterMessages);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[80]">
      {open ? (
        <div className="mb-3 w-[min(100vw-1.5rem,380px)] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#e11d48)] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
                <Bot size={20} />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-[0.2em] text-red-100">TD PHONE</div>
                <div className="text-xs text-white/75">Hỗ trợ nhanh & tư vấn sản phẩm</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/16"
              aria-label="Đóng chat"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <div className="max-h-[460px] space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Gợi ý nhanh
            </div>

            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleQuickPrompt(item.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-[1.35rem] px-4 py-3 text-sm leading-7 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'border border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>{message.text}</div>
                    {message.action && (
                      <Link
                        to={message.action.href}
                        onClick={() => setOpen(false)}
                        className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                          message.role === 'user' ? 'bg-white/15 text-white' : 'bg-slate-950 text-white'
                        }`}
                      >
                        {message.action.label}
                        <Sparkles size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Nhập nhu cầu của bạn..."
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <button
                type="submit"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white transition hover:bg-red-700"
                aria-label="Gửi"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <button type="button" onClick={handleReset} className="font-semibold text-primary transition hover:text-red-700">
                Xóa đoạn chat
              </button>
              <span>Phản hồi tự động, hỗ trợ tư vấn nhanh.</span>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#e11d48)] px-4 py-3 text-white shadow-[0_16px_40px_rgba(15,23,42,0.24)] transition hover:scale-[1.02]"
        aria-label="Mở hỗ trợ nhanh"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <MessageCircleMore size={20} />
        </span>
        <span className="text-left">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-red-100">Hỗ trợ nhanh</span>
          <span className="block text-sm font-semibold">{open ? 'Đóng chat' : 'Tư vấn sản phẩm'}</span>
        </span>
        <span className="ml-1 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-black text-slate-950">
          {unread}
        </span>
      </button>
    </div>
  );
};

export default SupportChatWidget;
