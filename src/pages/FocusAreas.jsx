import { useLang } from '../i18n.jsx';

export default function FocusAreas() {
  const { t } = useLang();
  const f = t.focus;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{f.title}</h1>
          <p>{f.lead}</p>
        </div>
      </section>
      <div className="container page-body">
        <div className="grid">
          {f.areas.map((area) => (
            <section className="card static-card" key={area.h}>
              <h2>{area.h}</h2>
              <ul>{area.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          ))}
        </div>

        <section className="highlight">
          <h2>{f.dcTitle}</h2>
          <p>{f.dcText}</p>
        </section>

        <h2>{f.sectorsTitle}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{f.sectorHead.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {f.sectors.map(([sector, what]) => (
                <tr key={sector}><td>{sector}</td><td>{what}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
