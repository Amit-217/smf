import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import { useAuth } from '../App.jsx';

// ---------- Issue form <-> API conversion ----------
// Lists are edited one item per line. Multi-part rows use " | " between columns, e.g.
// timeline "date | what happened | source url" and sources "title | url | type".
const lines = (arr) => (arr || []).join('\n');
const parseLines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);
// Trailing empty columns are dropped, e.g. a timeline row without a source.
const rows = (arr, keys) => (arr || []).map((x) => keys.map((k) => x[k] || '').join(' | ').replace(/( \| )+$/, '')).join('\n');
function parseRows(text, keys, required, label) {
  return parseLines(text).map((line) => {
    const parts = line.split(' | ').map((p) => p.trim());
    if (parts.length < required || parts.length > keys.length) {
      throw new Error(`${label}: expected ${keys.join(' | ')} → "${line}"`);
    }
    return Object.fromEntries(keys.map((k, i) => [k, parts[i] || '']));
  });
}
const SOURCE_TYPES = ['government', 'court', 'company', 'news', 'advocacy', 'research'];

const TEXT_FIELDS = [
  ['title', 'Title', 'input'],
  ['district', 'District', 'input'],
  ['category', 'Category', 'input'],
  ['status', 'Status', 'input'],
  ['summary', 'Summary (shown on the issue card)', 'textarea'],
  ['background', 'Background (detailed; leave a blank line between paragraphs)', 'textarea-lg'],
  ['whatIsProposed', 'What is proposed', 'textarea'],
  ['cause', 'Why it is happening', 'textarea'],
  ['govPosition', 'Government / developer position', 'textarea'],
];
const LIST_FIELDS = [
  ['effects', 'Potential impacts (one per line)'],
  ['disputed', 'Disputed points (one per line)'],
  ['openQuestions', 'Open questions (one per line)'],
];

const sideToForm = (src = {}) => ({
  ...Object.fromEntries(TEXT_FIELDS.map(([k]) => [k, src[k] || ''])),
  ...Object.fromEntries(LIST_FIELDS.map(([k]) => [k, lines(src[k])])),
  keyFacts: rows(src.keyFacts, ['label', 'value']),
  timeline: rows(src.timeline, ['date', 'text', 'source']),
});

const sideFromForm = (side, langLabel) => ({
  ...Object.fromEntries(TEXT_FIELDS.map(([k]) => [k, side[k].trim()])),
  ...Object.fromEntries(LIST_FIELDS.map(([k]) => [k, parseLines(side[k])])),
  keyFacts: parseRows(side.keyFacts, ['label', 'value'], 2, `${langLabel} key facts`),
  timeline: parseRows(side.timeline, ['date', 'text', 'source'], 2, `${langLabel} timeline`),
});

function toForm(issue) {
  return {
    slug: issue?.slug || '',
    priority: issue?.priority || 'medium',
    hot: !!issue?.hot,
    published: issue ? !!issue.published : false,
    lat: issue?.location?.lat ?? '',
    lng: issue?.location?.lng ?? '',
    sources: rows(issue?.sources, ['title', 'url', 'type']),
    en: sideToForm(issue || {}),
    mr: sideToForm(issue?.mr || {}),
  };
}

function fromForm(form) {
  const hasLocation = form.lat !== '' && form.lng !== '';
  return {
    slug: form.slug,
    priority: form.priority,
    hot: form.hot,
    published: form.published,
    location: hasLocation ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined,
    sources: parseRows(form.sources, ['title', 'url', 'type'], 2, 'Sources').map((src) => {
      if (src.type && !SOURCE_TYPES.includes(src.type)) throw new Error(`Sources: type must be one of ${SOURCE_TYPES.join(', ')} → "${src.type}"`);
      return src;
    }),
    ...sideFromForm(form.en, 'English'),
    mr: sideFromForm(form.mr, 'Marathi'),
  };
}

// ---------- Admin login (email + password from .env) ----------
function AdminLogin() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      setUser(await api('/auth/admin-login', { method: 'POST', body: { email, password } }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container auth-container">
      <form className="card static-card auth-card" onSubmit={submit}>
        <h1>Admin login</h1>
        {error && <p className="error" role="alert">{error}</p>}
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary-btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

// ---------- Visitor photo/video review ----------
function MediaQueue({ onError, onNotice }) {
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);

  const load = () => api(`/admin/media?status=${status}`).then(setItems).catch((e) => onError(e.message));
  useEffect(() => {
    load();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function act(item, action) {
    if (action === 'remove' && !window.confirm(`Permanently delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await api(`/admin/media/${item._id}/${action}`, { method: 'POST' });
      onNotice(action === 'approve' ? 'Approved — now visible to everyone.' : 'Removed.');
      await load();
    } catch (e) {
      onError(e.message);
    }
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Visitor photos &amp; videos</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="pending">Waiting for approval</option>
          <option value="hidden">Hidden after reports</option>
          <option value="published">Published</option>
        </select>
      </div>
      {items.length === 0 && <p className="muted">Nothing here.</p>}
      <div className="video-grid">
        {items.map((item) => (
          <article className="card static-card media-card" key={item._id}>
            {item.kind === 'image'
              ? <a href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={item.title} loading="lazy" /></a>
              : <video controls preload="metadata" poster={item.poster} src={item.src} />}
            <h3>{item.title}</h3>
            {item.description && <p>{item.description}</p>}
            <p className="muted">
              Issue: {item.issue ? <Link to={`/issues/${item.issue.slug}`}>{item.issue.title}</Link> : '—'}
              <br />
              Uploaded by: <strong>{item.user?.displayName || '(no name)'}</strong> · {item.user?.email || 'unknown'}
              <br />
              {formatDate(item.createdAt)}{item.reports ? ` · ${item.reports} report(s)` : ''}
            </p>
            <div className="button-row">
              {item.status !== 'published' && <button className="primary-btn" type="button" onClick={() => act(item, 'approve')}>Approve</button>}
              <button className="secondary-btn danger" type="button" onClick={() => act(item, 'remove')}>Remove</button>
            </div>
          </article>
        ))}
      </div>
      <p className="muted">Uploader names and emails are only visible here. The public site never shows who uploaded.</p>
    </section>
  );
}

// ---------- Dashboard ----------
export default function Admin() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [articles, setArticles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(() => toForm(null));
  const [editLang, setEditLang] = useState('en');
  const [approveIssue, setApproveIssue] = useState({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadDashboard() {
    const [issueData, articleData, jobData] = await Promise.all([
      api('/admin/issues'),
      api('/admin/articles?status=pending'),
      api('/admin/jobs'),
    ]);
    setIssues(issueData);
    setArticles(articleData);
    setJobs(jobData);
  }

  useEffect(() => {
    if (user?.isAdmin) loadDashboard().catch((e) => setError(e.message));
  }, [user?.isAdmin]);

  const say = (msg) => { setError(''); setNotice(msg); };
  const fail = (msg) => { setNotice(''); setError(msg); };

  function editIssue(issue) {
    setSelected(issue?._id || null);
    setForm(toForm(issue));
    setEditLang('en');
    setError('');
    setNotice('');
  }

  const setTop = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const setSide = (name, value) => setForm((f) => ({ ...f, [editLang]: { ...f[editLang], [name]: value } }));

  async function saveIssue(event) {
    event.preventDefault();
    let payload;
    try {
      payload = fromForm(form);
      if (!payload.title) throw new Error('English title is required.');
    } catch (e) {
      fail(e.message);
      return;
    }
    setBusy(true);
    try {
      const saved = selected
        ? await api(`/admin/issues/${selected}`, { method: 'PUT', body: payload })
        : await api('/admin/issues', { method: 'POST', body: payload });
      await loadDashboard();
      editIssue(saved);
      say('Issue saved.');
    } catch (e) {
      fail(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function reviewArticle(id, action) {
    try {
      if (action === 'approve') {
        const issueId = approveIssue[id];
        if (!issueId) throw new Error('Choose an issue before approving this article.');
        await api(`/admin/articles/${id}/approve`, { method: 'POST', body: { issueId } });
      } else {
        await api(`/admin/articles/${id}/reject`, { method: 'POST' });
      }
      await loadDashboard();
      say('News review updated.');
    } catch (e) {
      fail(e.message);
    }
  }

  async function createIssueFromArticle(id) {
    try {
      const issue = await api(`/admin/articles/${id}/create-issue`, { method: 'POST', body: {} });
      await loadDashboard();
      editIssue(issue);
      say('Draft issue created from this article. Add the Marathi text, review and publish it when ready.');
    } catch (e) {
      fail(e.message);
    }
  }

  async function runNewsJob() {
    try {
      const result = await api('/admin/jobs/news/run', { method: 'POST', body: {} });
      say(result.message || 'News job started.');
      await loadDashboard();
    } catch (e) {
      fail(e.message);
    }
  }

  if (user === undefined) return <div className="container"><p>Loading account…</p></div>;
  if (!user?.isAdmin) return <AdminLogin />;

  const side = form[editLang];
  return (
    <div className="container admin-page">
      <h1>Admin dashboard</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}

      <MediaQueue onError={fail} onNotice={say} />

      <section>
        <div className="section-heading">
          <h2>Issues</h2>
          <button className="primary-btn" type="button" onClick={() => editIssue(null)}>New issue</button>
        </div>
        <div className="admin-issue-list">
          {issues.map((issue) => (
            <button key={issue._id} type="button" className={`admin-issue-row${selected === issue._id ? ' active' : ''}`} onClick={() => editIssue(issue)}>
              <span>{issue.hot && '🔥 '}{issue.title}</span>
              <small>
                {issue.published ? 'Published' : 'Draft'} · {issue.district || 'No district'}
                {!issue.mr?.title && ' · ⚠ no Marathi'}
              </small>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-editor">
        <h2>{selected ? 'Edit issue' : 'Create issue'}</h2>
        <form onSubmit={saveIssue} className="admin-form">
          <label className="checkbox-label"><input type="checkbox" checked={form.hot} onChange={(e) => setTop('hot', e.target.checked)} /> 🔥 Hot topic (shown at the top of the home page)</label>
          <label className="checkbox-label"><input type="checkbox" checked={form.published} onChange={(e) => setTop('published', e.target.checked)} /> Published (visible to the public)</label>
          <label>Slug (web address)<input value={form.slug} onChange={(e) => setTop('slug', e.target.value)} placeholder="Generated from title if blank" /></label>
          <label>Priority
            <select value={form.priority} onChange={(e) => setTop('priority', e.target.value)}>
              <option value="high">Urgent</option><option value="medium">Active</option><option value="watch">Watch</option>
            </select>
          </label>
          <label>Latitude<input type="number" step="any" value={form.lat} onChange={(e) => setTop('lat', e.target.value)} /></label>
          <label>Longitude<input type="number" step="any" value={form.lng} onChange={(e) => setTop('lng', e.target.value)} /></label>
          <label className="span-all">Sources (one per line: title | url | type — type is one of {SOURCE_TYPES.join(', ')})
            <textarea rows="4" value={form.sources} onChange={(e) => setTop('sources', e.target.value)} />
          </label>

          <div className="span-all lang-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={editLang === 'en'} className={editLang === 'en' ? 'chip active' : 'chip'} onClick={() => setEditLang('en')}>English</button>
            <button type="button" role="tab" aria-selected={editLang === 'mr'} className={editLang === 'mr' ? 'chip active' : 'chip'} onClick={() => setEditLang('mr')}>मराठी (Marathi)</button>
            {editLang === 'mr' && <small className="muted">Empty Marathi fields show the English text on the Marathi site.</small>}
          </div>

          {TEXT_FIELDS.map(([key, label, type]) => (
            <label key={`${editLang}-${key}`} className={type === 'input' ? undefined : 'span-all'}>{label}
              {type !== 'input'
                ? <textarea rows={type === 'textarea-lg' ? 10 : 3} lang={editLang} value={side[key]} onChange={(e) => setSide(key, e.target.value)} />
                : <input lang={editLang} required={editLang === 'en' && key === 'title'} value={side[key]} onChange={(e) => setSide(key, e.target.value)} />}
            </label>
          ))}
          {LIST_FIELDS.map(([key, label]) => (
            <label key={`${editLang}-${key}`} className="span-all">{label}
              <textarea rows="4" lang={editLang} value={side[key]} onChange={(e) => setSide(key, e.target.value)} />
            </label>
          ))}
          <label className="span-all">Key facts (one per line: label | value)
            <textarea rows="5" lang={editLang} value={side.keyFacts} onChange={(e) => setSide('keyFacts', e.target.value)} />
          </label>
          <label className="span-all">Timeline (one per line: date | what happened | source url)
            <textarea rows="6" lang={editLang} value={side.timeline} onChange={(e) => setSide('timeline', e.target.value)} />
          </label>

          <button className="primary-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save issue'}</button>
        </form>
      </section>

      <section>
        <div className="section-heading"><h2>News review queue</h2><span className="muted">{articles.length} pending</span></div>
        {articles.length === 0 && <p className="muted">No news waiting for review.</p>}
        <div className="admin-news-list">
          {articles.map((article) => (
            <article className="card static-card" key={article._id}>
              <h3><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h3>
              <p className="muted">{article.source} · {formatDate(article.publishedAt)}</p>
              {article.summary && <p>{article.summary}</p>}
              <label>Attach to issue
                <select value={approveIssue[article._id] || ''} onChange={(e) => setApproveIssue((previous) => ({ ...previous, [article._id]: e.target.value }))}>
                  <option value="">Choose an issue</option>
                  {issues.map((issue) => <option value={issue._id} key={issue._id}>{issue.title}</option>)}
                </select>
              </label>
              <div className="button-row">
                <button className="primary-btn" type="button" onClick={() => reviewArticle(article._id, 'approve')}>Approve</button>
                <button className="secondary-btn" type="button" onClick={() => createIssueFromArticle(article._id)}>Create issue draft</button>
                <button className="secondary-btn" type="button" onClick={() => reviewArticle(article._id, 'reject')}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="jobs-section">
        <div className="section-heading"><h2>News collection</h2><button className="secondary-btn" type="button" onClick={runNewsJob}>Run news job</button></div>
        {jobs.slice(0, 10).map((job) => (
          <p className="job-row" key={job._id}>
            <strong>{job.job}</strong> · {job.status} · {formatDate(job.startedAt)}
            {job.error && <span className="error">{job.error}</span>}
          </p>
        ))}
      </section>
    </div>
  );
}
