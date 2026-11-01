import { useLang } from '../i18n.jsx';

export default function Privacy() {
  const { t } = useLang();
  const p = t.privacy;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{p.title}</h1>
          <p>{p.updated}</p>
        </div>
      </section>
      <div className="container page-body privacy">
        <p className="note">{p.intro}</p>
        {p.sections.map((section) => (
          <section key={section.h}>
            <h2>{section.h}</h2>
            <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>
    </>
  );
}
