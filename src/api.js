// Backend base URL from .env (VITE_API_URL). In development requests stay relative and
// Vite's proxy forwards them; in a production build an empty value means "same domain".
// Accepts the URL with or without a trailing /api.
const API_BASE = import.meta.env.DEV ? '' : String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '');

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    credentials: 'include', // send the login cookie, also when the backend is on another domain
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const formatDate = (d, locale = 'en-IN') =>
  d ? new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
