// Utility for Google login on frontend
// Uses One-Tap/Google Identity Services if script is available.
// Backend used by this project: POST /api/users/google-login

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function ensureGoogleScriptLoaded() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.google?.accounts?.id) return resolve(window.google);

    const existing = document.querySelector('script[data-google-identity]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('Google script failed to load')));
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      reject(new Error('Missing VITE_GOOGLE_CLIENT_ID in frontend/.env'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';

    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Google script failed to load'));
    document.head.appendChild(script);
  });
}

export async function postGoogleLogin(googleUser) {
  // Backend expects: email/username/photo/numphone
  const res = await fetch(`${API_BASE_URL}/users/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: googleUser?.username || googleUser?.name,
      email: googleUser?.email,
      photo: googleUser?.picture || googleUser?.photo,
      numphone: googleUser?.numphone || '',
    }),
  });


  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || 'Google login failed');
  }

  return res.json();
}

