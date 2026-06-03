import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Afterthought',
  description: 'Selected projects by Afterthought — brand identity, naming and visual systems for founders and growing businesses.',
}

function MoustacheMark({ color = '#F1E9DA', size = 120 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.48} viewBox="0 0 200 96" fill="none" aria-hidden="true">
      <path d="M100 58 C88 58 72 52 56 42 C40 32 22 28 12 36 C5 41 4 50 10 56 C18 62 34 60 50 54 C64 48 80 52 100 58Z" fill={color}/>
      <path d="M100 58 C120 52 136 48 150 54 C166 60 182 62 190 56 C196 50 195 41 188 36 C178 28 160 32 144 42 C128 52 112 58 100 58Z" fill={color}/>
    </svg>
  )
}

export default function Work() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>Work — 001 project · 2025</span>
        </div>
        <h1 className="display-xl page-header__title">One project, so far. More <em>on the way</em>.</h1>
        <p className="page-header__sub body-lg">We started Afterthought in 2025. Below is the first engagement — a naming and identity project we&apos;re proud of. Every project gets a full write-up of the brief, the thinking, and what shipped.</p>
        <div className="page-header__meta">
          <div className="meta-cell"><span className="caption">Projects to date</span><div className="meta-val">001</div></div>
          <div className="meta-cell"><span className="caption">Disciplines</span><div className="meta-val">Naming · Identity · Logo</div></div>
          <div className="meta-cell"><span className="caption">Studio</span><div className="meta-val">Bangalore · Working internationally</div></div>
          <div className="meta-cell"><span className="caption">Now</span><div className="meta-val">Open for briefs</div></div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="work-grid">
          <a className="tile tile--purple tile-wide" href="/work/justach">
            <div className="tile__visual">
              <div className="vis-justach">
                <MoustacheMark color="rgba(241,233,218,0.20)" size={160} />
                <div className="vis-justach__wordmark">Justach</div>
              </div>
            </div>
            <div className="tile__meta">
              <div className="tile__meta-left">
                <span className="tile__eyebrow">Case 001 · Justach · Naming · Logo · Identity · 2025</span>
                <div className="tile__title">A men&apos;s salon built around one unforgettable symbol.</div>
              </div>
              <div className="tile__arrow">→</div>
            </div>
          </a>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">What&apos;s next</span>
          <h2 className="cb-title display-lg">The shelf has room for more.</h2>
          <p className="body-lg cb-body">We take on a small number of projects at a time. We&apos;re especially curious about young companies in grooming, food & hospitality, climate, and culture — and any brief whose first sentence reads like a question rather than a directive.</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/contact">Send a brief →</a>
            <a className="btn btn-on-color" style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--c-ink)' }} href="/studio">How we work →</a>
          </div>
        </div>
      </section>
    </>
  )
}
