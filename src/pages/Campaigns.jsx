import { useLang } from '../i18n.jsx';

export default function Campaigns() {
  const { t } = useLang();
  const c = t.campaigns;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
      </section>
      <div className="container page-body">
        <div className="grid">
          {c.list.map((item) => (
            <section className="card static-card campaign" key={item.h}>
              <h2>{item.h}</h2>
              <p>{item.p}</p>
            </section>
          ))}
        </div>
        <h2>{c.phasesTitle}</h2>
        <ol className="steps">
          {c.phases.map((p) => <li key={p}><span>{p}</span></li>)}
        </ol>
      </div>
    </>
  );
}
