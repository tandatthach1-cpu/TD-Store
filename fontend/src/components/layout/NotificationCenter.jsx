import { useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { NOTIFICATION_EVENT, PENDING_NOTIFICATION_KEY } from '../../utils/notifications';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const removeNotification = (id) => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    };

    const showNotification = (detail = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const notification = {
        id,
        type: detail.type === 'error' ? 'error' : 'success',
        message: detail.message || 'Thao tác thành công.',
      };

      setNotifications((current) => [...current.slice(-2), notification]);
      window.setTimeout(() => removeNotification(id), detail.duration || 3000);
    };

    const handleNotification = (event) => {
      showNotification(event.detail);
    };

    window.addEventListener(NOTIFICATION_EVENT, handleNotification);

    const pendingNotification = sessionStorage.getItem(PENDING_NOTIFICATION_KEY);
    if (pendingNotification) {
      sessionStorage.removeItem(PENDING_NOTIFICATION_KEY);
      try {
        showNotification(JSON.parse(pendingNotification));
      } catch {
        showNotification();
      }
    }

    return () => {
      window.removeEventListener(NOTIFICATION_EVENT, handleNotification);
    };
  }, []);

  if (!notifications.length) return null;

  return (
    <div className="fixed right-4 top-24 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {notifications.map((notification) => {
        const isError = notification.type === 'error';

        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg ${
              isError ? 'border-red-200 text-red-700' : 'border-green-200 text-green-700'
            }`}
            role="status"
          >
            {isError ? (
              <XCircle className="mt-0.5 shrink-0" size={20} />
            ) : (
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
            )}
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              type="button"
              className="shrink-0 text-gray-400 transition hover:text-gray-700"
              aria-label="Đóng thông báo"
              onClick={() => setNotifications((current) => current.filter((item) => item.id !== notification.id))}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationCenter;
