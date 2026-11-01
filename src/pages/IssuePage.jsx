import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import { useAuth } from '../App.jsx';
import { localizeIssue, useLang } from '../i18n.jsx';
import UploadForm from '../components/UploadForm.jsx';

function ListSection({ title, items }) {
  if (!items?.length) return null;
  return <section><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

function TextSection({ title, text }) {
  if (!text || text === '—') return null;
  return <section><h2>{title}</h2><p>{text}</p></section>;
}

export default function IssuePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { lang, t } = useLang();
  const L = t.issue;
  const [raw, setRaw] = useState(null);
  const [media, setMedia] = useState([]);
  const [error, setError] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [reported, setReported] = useState({});

  useEffect(() => {
    let active = true;
    setRaw(null);
    setMedia([]);
    setError('');
    setMediaError('');

    api(`/issues/${encodeURIComponent(slug)}`)
      .then((data) => active && setRaw(data))
      .catch((e) => active && setError(e.message));
    api(`/issues/${encodeURIComponent(slug)}/media`)
      .then((data) => active && setMedia(data))
      .catch((e) => active && setMediaError(e.message));

    return () => {
      active = false;
    };
  }, [slug]);

  async function report(id) {
    try {
      await api(`/media/${id}/report`, { method: 'POST' });
      setReported((previous) => ({ ...previous, [id]: true }));
    } catch (e) {
      setMediaError(e.message);
    }
  }

  if (error) {
    return <div className="container"><p className="error">{error}</p><Link to="/">{L.back}</Link></div>;
  }
  if (!raw) return <div className="container"><p>{L.loading}</p></div>;

  const issue = localizeIssue(raw, lang);
  return (
    <article className="container issue-detail">
      <p><Link to="/">{L.back}</Link></p>
      {issue.hot && <span className="badge badge-hot">🔥 {t.home.hotBadge}</span>}{' '}
      <span className={`badge badge-${issue.priority}`}>{t.home.priority[issue.priority]}</span>
      <h1>{issue.title}</h1>
      <p className="muted">{[issue.district, issue.category].filter(Boolean).join(' · ')}</p>
      <p className="status">{L.status}: {issue.status || L.notReported}</p>

      <TextSection title={L.overview} text={issue.summary} />
      {issue.keyFacts?.length > 0 && (
        <section>
          <h2>{L.keyFacts}</h2>
          <dl className="key-facts">
            {issue.keyFacts.map((fact, index) => (
              <div key={`${fact.label}-${index}`}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            ))}
          </dl>
        </section>
      )}
      {issue.background && (
        <section>
          <h2>{L.background}</h2>
          {issue.background.split(/\n\s*\n/).map((para, index) => <p key={index}>{para}</p>)}
        </section>
      )}
      <TextSection title={L.proposed} text={issue.whatIsProposed} />
      <TextSection title={L.cause} text={issue.cause} />
      <ListSection title={L.effects} items={issue.effects} />
      <TextSection title={L.gov} text={issue.govPosition} />
      <ListSection title={L.disputed} items={issue.disputed} />
      <ListSection title={L.questions} items={issue.openQuestions} />
      {issue.timeline?.length > 0 && (
        <section>
          <h2>{L.timeline}</h2>
          <ol className="timeline">
            {issue.timeline.map((item, index) => (
              <li key={`${item.date}-${index}`}>
                <strong>{item.date}</strong>
                <span>
                  {item.text}
                  {item.source && <> · <a href={item.source} target="_blank" rel="noreferrer">{L.source}</a></>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {issue.sources?.length > 0 && (
        <section>
          <h2>{L.sources}</h2>
          <p className="muted">{L.sourcesNote}</p>
          <ul className="source-list">
            {issue.sources.map((source) => (
              <li key={source.url}>
                {source.type && <span className={`source-type source-${source.type}`}>{L.sourceTypes[source.type] || source.type}</span>}
                <a href={source.url} target="_blank" rel="noreferrer">{source.title || source.url}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {issue.news?.length > 0 && (
        <section>
          <h2>{L.news}</h2>
          <ul className="source-list">
            {issue.news.map((article) => (
              <li key={article.url}>
                <a href={article.url} target="_blank" rel="noreferrer">{article.title}</a>
                <span className="muted"> · {article.source}{article.publishedAt ? ` · ${formatDate(article.publishedAt, t.locale)}` : ''}</span>
                {article.summary && <p>{article.summary}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>{L.media}</h2>
        {mediaError && <p className="error">{mediaError}</p>}
        {!mediaError && media.length === 0 && <p className="muted">{L.noMedia}</p>}
        <div className="video-grid">
          {media.map((item) => (
            <figure className="card static-card media-card" key={item.id}>
              {item.kind === 'image' ? (
                <a href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={item.title} loading="lazy" /></a>
              ) : (
                <video controls preload="metadata" poster={item.poster} src={item.src}>{L.noVideoSupport}</video>
              )}
              <figcaption>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                {item.createdAt && <p className="muted">{formatDate(item.createdAt, t.locale)}</p>}
                {user && !reported[item.id] && (
                  <button className="link-btn small" type="button" onClick={() => report(item.id)}>{L.report}</button>
                )}
                {reported[item.id] && <p className="muted">{L.reported}</p>}
              </figcaption>
            </figure>
          ))}
        </div>

        {user ? (
          <UploadForm issueId={raw._id} />
        ) : (
          user === null && (
            <p className="share-cta">
              <Link className="primary-btn" to={`/login?next=${encodeURIComponent(`/issues/${slug}`)}`}>{L.loginToShare}</Link>
            </p>
          )
        )}
      </section>
    </article>
  );
}
