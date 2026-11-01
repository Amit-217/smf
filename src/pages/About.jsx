import { useLang } from '../i18n.jsx';

export default function About() {
  const { t } = useLang();
  const a = t.about;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{a.title}</h1>
          <p>{a.lead}</p>
          <p>{a.leadMore}</p>
        </div>
      </section>
      <div className="container page-body">
        <section className="highlight now-box">
          <h2>{a.nowTitle}</h2>
          <ul>{a.now.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <div className="grid">
          {a.sections.map((s) => (
            <section className="card static-card" key={s.h}>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>

        <h2>{a.methodTitle}</h2>
        <p className="muted">{a.methodLead}</p>
        <ol className="steps">
          {a.method.map((m) => (
            <li key={m.h}>
              <strong>{m.h}</strong>
              <span>{m.p}</span>
            </li>
          ))}
        </ol>
        <p className="note">{a.evidenceNote}</p>

        <h2>{a.principlesTitle}</h2>
        <ol className="principles">
          {a.principles.map((p) => <li key={p}>{p}</li>)}
        </ol>

        <blockquote className="commitment">{a.commitment}</blockquote>
      </div>
    </>
  );
}
