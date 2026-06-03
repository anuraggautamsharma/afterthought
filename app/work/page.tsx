import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Afterthought',
  description: 'Selected projects by Afterthought — Helio and Querida.',
}

export default function Work() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>Work — 002 projects · 2025 / 2026</span>
        </div>
        <h1 className="display-xl page-header__title">A short shelf, kept short on <em>purpose</em>.</h1>
        <p className="page-header__sub body-lg">Two projects so far. We&apos;re new — and a little choosy about what comes next. Each engagement below is one we&apos;d happily do again, with a write-up of the brief, the second thought, and what shipped.</p>
        <div className="page-header__meta">
          <div className="meta-cell"><span className="caption">Projects to date</span><div className="meta-val">002</div></div>
          <div className="meta-cell"><span className="caption">Disciplines</span><div className="meta-val">Identity · Naming · Print · Web</div></div>
          <div className="meta-cell"><span className="caption">Studio</span><div className="meta-val">Bangalore · Working internationally</div></div>
          <div className="meta-cell"><span className="caption">Now reading</span><div className="meta-val">Summer 2026 briefs</div></div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="work-grid">
          <a className="tile tile--lime tile-wide" href="/work/helio">
            <div className="tile__visual">
              <div className="vis-helio">
                <div className="vis-helio__left">
                  <div className="vis-helio__caption"><span>Naming · Identity · Web</span><span>2025</span></div>
                  <div className="vis-helio__line"></div>
                  <div className="vis-helio__wordmark">Heli<span className="o">o</span></div>
                  <div className="vis-helio__line"></div>
                  <div className="vis-helio__caption"><span>A climate-tech holding company</span><span>R0 — R3</span></div>
                </div>
                <div className="vis-helio__right"><div className="vis-helio__sun"></div></div>
              </div>
            </div>
            <div className="tile__meta">
              <div className="tile__meta-left">
                <span className="tile__eyebrow">Case 001 · Helio · Identity · Naming · Web · 2025</span>
                <div className="tile__title">From a brief about heat pumps to a brand about hope.</div>
              </div>
              <div className="tile__arrow">→</div>
            </div>
          </a>

          <a className="tile tile--coral tile-wide" href="/work/querida">
            <div className="tile__visual">
              <div className="vis-querida">
                <div className="vis-querida__name">Querida</div>
                <div className="vis-querida__menu">
                  <div className="vis-querida__menu-row"><span>Pan con tomate</span><span className="dots"></span><span>06</span></div>
                  <div className="vis-querida__menu-row"><span>Boquerones, sherry</span><span className="dots"></span><span>09</span></div>
                  <div className="vis-querida__menu-row"><span>Tortilla, dressed leaves</span><span className="dots"></span><span>11</span></div>
                  <div className="vis-querida__menu-row"><span>Almond cake, citrus</span><span className="dots"></span><span>08</span></div>
                </div>
              </div>
            </div>
            <div className="tile__meta">
              <div className="tile__meta-left">
                <span className="tile__eyebrow">Case 002 · Querida · Identity · Print · Menu · 2026</span>
                <div className="tile__title">A neighbourhood place that takes itself seriously, but only just.</div>
              </div>
              <div className="tile__arrow">→</div>
            </div>
          </a>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">What&apos;s next — Summer 2026</span>
          <h2 className="cb-title display-lg">The shelf has room for three.</h2>
          <p className="body-lg cb-body">We take on roughly four engagements a year, two of which are open right now. We&apos;re especially curious about young companies in climate, food &amp; hospitality, civic and cultural — and any brief whose first sentence reads like a question.</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/contact">Send a brief →</a>
            <a className="btn btn-on-color" style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--c-ink)' }} href="/studio">How we work →</a>
          </div>
        </div>
      </section>
    </>
  )
}
