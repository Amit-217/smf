import { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { api } from './api.js';
import { useLang } from './i18n.jsx';
import Home from './pages/Home.jsx';
import IssuePage from './pages/IssuePage.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import About from './pages/About.jsx';
import FocusAreas from './pages/FocusAreas.jsx';
import Campaigns from './pages/Campaigns.jsx';
import Privacy from './pages/Privacy.jsx';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const navigate = useNavigate();
  const { t, toggle } = useLang();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api('/auth/me').then(setUser).catch(() => setUser(null));
  }, []);

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  async function logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <header className="site-header">
        <Link to="/" className="brand">
          <img src={t.logo.src} alt={t.logo.alt} width="900" height="296" />
        </Link>
        <div className="header-actions">
          <button className="lang-btn" type="button" onClick={toggle} aria-label={t.switchLabel}>
            {t.switchTo}
          </button>
          {/* Shown on small screens only; the nav is always visible on wide screens. */}
          <button
            className="menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
            <span className="visually-hidden">{t.nav.menu}</span>
          </button>
        </div>
        <nav id="site-nav" className={menuOpen ? 'open' : undefined}>
          <NavLink to="/" end>{t.nav.issues}</NavLink>
          <NavLink to="/about">{t.nav.about}</NavLink>
          <NavLink to="/focus-areas">{t.nav.focus}</NavLink>
          <NavLink to="/campaigns">{t.nav.campaigns}</NavLink>
          {user ? (
            <>
              <span className="muted">{t.nav.hi}, {user.displayName || t.nav.friend}</span>
              <button className="link-btn" onClick={logout}>{t.nav.logout}</button>
            </>
          ) : (
            user === null && <NavLink to="/login">{t.nav.login}</NavLink>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/focus-areas" element={<FocusAreas />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/issues/:slug" element={<IssuePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<p className="container">{t.notFound} <Link to="/">{t.goHome}</Link></p>} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p className="footer-tagline">{t.footer.tagline}</p>
        <p>{t.footer.status}</p>
        <p>{t.footer.note}</p>
        <p><Link to="/privacy">{t.nav.privacy}</Link></p>
      </footer>
    </AuthContext.Provider>
  );
}
