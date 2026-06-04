import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Afterthought',
  description: 'Selected projects by Afterthought — brand identity, naming, motion design and visual systems for founders and growing businesses.',
}

function MoustacheMark({ color = '#F1E9DA', size = 120 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.48} viewBox="0 0 200 96" fill="none" aria-hidden="true">
      <path d="M100 58 C88 58 72 52 56 42 C40 32 22 28 12 36 C5 41 4 50 10 56 C18 62 34 60 50 54 C64 48 80 52 100 58Z" fill={color}/>
      <path d="M100 58 C120 52 136 48 150 54 C166 60 182 62 190 56 C196 50 195 41 188 36 C178 28 160 32 144 42 C128 52 112 58 100 58Z" fill={color}/>
    </svg>
  )
}

function PipelineFlow() {
  const nodes = ['ICP', 'Outreach', 'Meeting', 'Pipeline']
  const cx = [32, 112, 192, 272]
  const cy = 32
  return (
    <svg viewBox="0 0 304 64" fill="none" style={{ width: '100%', maxWidth: '300px' }} aria-hidden="true">
      {cx.slice(0, -1).map((x, i) => (
        <line key={i} x1={x + 14} y1={cy} x2={cx[i + 1] - 14} y2={cy}
          stroke="#A855F7" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" />
      ))}
      {nodes.map((label, i) => (
        <g key={label}>
          <circle cx={cx[i]} cy={cy} r={14} fill="#A855F7" fillOpacity="0.12" />
          <circle cx={cx[i]} cy={cy} r={5}  fill="#A855F7" fillOpacity="0.7" />
          <text x={cx[i]} y={58} textAnchor="middle" fill="white" fillOpacity="0.35"
            fontSize="8" fontFamily="monospace" letterSpacing="0.8">{label}</text>
        </g>
      ))}
    </svg>
  )
}

export default function Work() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>Work — 002 projects · 2025</span>
        </div>
        <h1 className="display-xl page-header__title">Two projects, so far. Both we&apos;d do <em>again</em>.</h1>
        <p className="page-header__sub body-lg">We started Afterthought in 2025. Below are the first two engagements — a brand identity and a motion piece. Every project gets a full write-up of the brief, the thinking, and what shipped.</p>
        <div className="page-header__meta">
          <div className="meta-cell"><span className="caption">Projects to date</span><div className="meta-val">002</div></div>
          <div className="meta-cell"><span className="caption">Disciplines</span><div className="meta-val">Naming · Identity · Motion</div></div>
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

          <a className="tile tile--dark tile-wide" href="/work/pipelinelab">
            <div className="tile__visual">
              <div className="vis-pipelinelab">
                <PipelineFlow />
                <div className="vis-pipelinelab__wordmark">The Pipeline<span>.</span>Lab</div>
              </div>
            </div>
            <div className="tile__meta">
              <div className="tile__meta-left">
                <span className="tile__eyebrow">Case 002 · The Pipeline Lab · Script · Motion Design · 2025</span>
                <div className="tile__title">Thirty seconds to explain a revenue engine.</div>
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
          <p className="body-lg cb-body">We take on a small number of projects at a time. We&apos;re especially curious about young companies in grooming, food & hospitality, B2B, and any brief whose first sentence reads like a question rather than a directive.</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/contact">Send a brief →</a>
            <a className="btn btn-on-color" style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--c-ink)' }} href="/studio">How we work →</a>
          </div>
        </div>
      </section>
    </>
  )
}
