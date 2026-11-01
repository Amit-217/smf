import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { localizeIssue, useLang } from '../i18n.jsx';
import IssueMap, { PRIORITY_COLORS } from '../components/IssueMap.jsx';

const ALL = '__all__';

export default function Home() {
  const { lang, t } = useLang();
  const h = t.home;
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(ALL);

  useEffect(() => {
    api('/issues').then(setIssues).catch((e) => setError(e.message));
  }, []);

  const localized = useMemo(() => issues.map((i) => ({ ...localizeIssue(i, lang), categoryKey: i.category })), [issues, lang]);
  // Filter on the English category (stable key), label chips in the current language.
  const categories = useMemo(() => {
    const labels = new Map();
    localized.forEach((i) => i.categoryKey && !labels.has(i.categoryKey) && labels.set(i.categoryKey, i.category));
    return [...labels];
  }, [localized]);
  const hot = localized.filter((i) => i.hot);
  const shown = category === ALL ? localized : localized.filter((i) => i.categoryKey === category);

  const card = (i) => (
    <Link key={i._id} to={`/issues/${i.slug}`} className={i.hot ? 'card hot-card' : 'card'}>
      {i.hot && <span className="badge badge-hot">🔥 {h.hotBadge}</span>}{' '}
      <span className={`badge badge-${i.priority}`}>{h.priority[i.priority]}</span>
      <h3>{i.title}</h3>
      <p className="muted">📍 {i.district} · {i.category}</p>
      <p className="card-summary">{i.summary}</p>
      <p className="status">{h.status}: {i.status}</p>
    </Link>
  );

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>{h.title}</h1>
          <p>{h.intro}</p>
          <div className="button-row hero-actions">
            <a className="primary-btn light" href="#issues">{h.ctaIssues}</a>
            <Link className="secondary-btn ghost" to="/about">{h.ctaAbout}</Link>
          </div>
        </div>
      </section>

      {hot.length > 0 && (
        <section className="container hot-topics" aria-labelledby="hot-title">
          <h2 id="hot-title">🔥 {h.hotTitle}</h2>
          <div className="grid">{hot.map(card)}</div>
        </section>
      )}

      <section className="container pillars" aria-labelledby="pillars-title">
        <h2 id="pillars-title">{h.pillarsTitle}</h2>
        <div className="grid">
          {h.pillars.map((p) => (
            <div className="card static-card pillar" key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container" id="issues">
        <h2>{h.issuesTitle}</h2>
        {error && <p className="error">{error}</p>}
        <IssueMap issues={localized} />
        <div className="legend">
          {Object.entries(h.priority).map(([k, v]) => (
            <span key={k}>
              <i style={{ background: PRIORITY_COLORS[k] }} /> {v}
            </span>
          ))}
        </div>

        <div className="filters">
          {[[ALL, h.all], ...categories].map(([key, label]) => (
            <button key={key} className={key === category ? 'chip active' : 'chip'} onClick={() => setCategory(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid">{shown.map(card)}</div>
      </div>
    </>
  );
}
