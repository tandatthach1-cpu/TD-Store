export const NOTIFICATION_EVENT = 'app-notification';
export const PENDING_NOTIFICATION_KEY = 'pendingNotification';

export const notify = ({ type = 'success', message, duration = 3000 }) => {
  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT, {
      detail: { type, message, duration },
    }),
  );
};

export const queueNotification = ({ type = 'success', message, duration = 3000 }) => {
  sessionStorage.setItem(
    PENDING_NOTIFICATION_KEY,
    JSON.stringify({ type, message, duration }),
  );
};
