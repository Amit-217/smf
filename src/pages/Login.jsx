import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../App.jsx';
import { useLang } from '../i18n.jsx';

export default function Login() {
  const { setUser } = useAuth();
  const { t } = useLang();
  const L = t.login;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // Return to the page that sent the visitor here (same-site paths only).
  const next = params.get('next') || '';
  const returnTo = next.startsWith('/') && !next.startsWith('//') ? next : '/';
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function requestCode(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await api('/auth/request-otp', { method: 'POST', body: { email } });
      setStep('code');
      setMessage(L.sent);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await api('/auth/verify-otp', { method: 'POST', body: { email, code } });
      setUser(user);
      navigate(returnTo, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container auth-container">
      <section className="card auth-card">
        <h1>{L.title}</h1>
        <p className="muted">{L.intro}</p>
        {error && <p className="error" role="alert">{error}</p>}
        {message && <p className="success-message" role="status">{message}</p>}
        {step === 'email' ? (
          <form onSubmit={requestCode}>
            <label htmlFor="login-email">{L.email}</label>
            <input id="login-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="primary-btn" type="submit" disabled={busy}>{busy ? L.sending : L.send}</button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <label htmlFor="login-code">{L.code}</label>
            <input id="login-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="primary-btn" type="submit" disabled={busy}>{busy ? L.verifying : L.verify}</button>
            <button className="secondary-btn" type="button" disabled={busy} onClick={() => { setStep('email'); setCode(''); setMessage(''); }}>
              {L.otherEmail}
            </button>
          </form>
        )}
        <p><Link to="/">{L.back}</Link></p>
      </section>
    </div>
  );
}
