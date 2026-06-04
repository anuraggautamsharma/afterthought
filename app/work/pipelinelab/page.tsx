import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Pipeline Lab — Afterthought',
  description: 'Script and motion design for The Pipeline Lab — a 30-second brand intro video for a B2B GTM and outbound agency.',
}

function PipelineFlow({ accent = '#A855F7' }: { accent?: string }) {
  const nodes = ['ICP', 'Outreach', 'Meeting', 'Pipeline']
  const cx = [32, 112, 192, 272]
  const cy = 32

  return (
    <svg viewBox="0 0 304 64" fill="none" style={{ width: '100%', maxWidth: '340px' }} aria-hidden="true">
      {cx.slice(0, -1).map((x, i) => (
        <line key={i} x1={x + 14} y1={cy} x2={cx[i + 1] - 14} y2={cy}
          stroke={accent} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" />
      ))}
      {nodes.map((label, i) => (
        <g key={label}>
          <circle cx={cx[i]} cy={cy} r={14} fill={accent} fillOpacity="0.12" />
          <circle cx={cx[i]} cy={cy} r={5}  fill={accent} fillOpacity="0.7" />
          <text x={cx[i]} y={58} textAnchor="middle"
            fill="white" fillOpacity="0.35"
            fontSize="8" fontFamily="monospace" letterSpacing="0.8">
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function PipelineLab() {
  return (
    <>
      {/* ── HERO ── */}
      <div className="cs-hero">
        <div className="cs-hero__image" style={{ background: '#0A0614' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', padding: '40px', width: '100%' }}>
            <PipelineFlow />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(48px, 7vw, 100px)', lineHeight: 0.95, letterSpacing: '-3px', fontVariationSettings: "'wght' 560", fontWeight: 560, color: '#fff' }}>
                The Pipeline<span style={{ color: '#A855F7' }}>.</span>Lab
              </div>
            </div>
          </div>
        </div>
        <div className="cs-hero__gradient" style={{ background: 'linear-gradient(to bottom, transparent 25%, rgba(10,6,20,0.85) 100%)' }}></div>
        <div className="cs-hero__info">
          <div className="container">
            <div className="cs-hero__eyebrow">
              <a href="/work">← Work</a>
              <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
              <span>Case 002</span>
            </div>
            <h1 className="display-xl cs-hero__title">
              The Pipeline Lab — thirty seconds to explain a <em>revenue engine</em>.
            </h1>
          </div>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="cs-meta container">
        <div className="cs-meta__item">
          <span className="cs-meta__label">Client</span>
          <span className="cs-meta__val">The Pipeline Lab</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Scope</span>
          <span className="cs-meta__val">Script · Motion Design</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Year</span>
          <span className="cs-meta__val">2025</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Studio</span>
          <span className="cs-meta__val">Afterthought</span>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        {/* ── INTRO ── */}
        <div className="cs-intro">
          <p>Most agency intro videos say a lot and show very little. They list services, deploy words like &ldquo;scalable&rdquo; and &ldquo;data-driven,&rdquo; and leave the viewer roughly where they started. The brief for The Pipeline Lab required the opposite — one clear promise, delivered in thirty seconds, to a B2B audience of founders and sales leaders who have already been burned by agencies that overpromise.</p>
          <p>We handled both the script and the motion design. The challenge was to compress a genuinely complex service — outbound strategy, ICP targeting, lead generation, cold outreach systems, LinkedIn-led growth — into a visual narrative that felt credible without feeling like a slide deck.</p>
        </div>

        {/* ── SECTION: THE BRIEF ── */}
        <div className="case-section">
          <div className="case-section__label">The Brief</div>
          <div className="case-section__body">
            <h2>A GTM agency that needed to out-perform its own pitch.</h2>
            <p>The Pipeline Lab helps B2B companies build predictable outbound systems — not random lead activity, but qualified conversations, booked meetings, and sales-ready opportunities. Their clients are SaaS brands, service businesses, and growth teams. Their buyers are skeptical.</p>
            <p>The video needed to work across every surface: website hero, LinkedIn, pitch decks, outreach sequences. A single piece of content doing the job of a much longer explanation — earning trust in the first ten seconds and communicating the offer clearly by the last.</p>
          </div>
        </div>

        {/* ── SECTION: SCRIPT ── */}
        <div className="case-section">
          <div className="case-section__label">Script & Messaging</div>
          <div className="case-section__body">
            <h2>Start with the problem, not the solution.</h2>
            <p>We structured the script around a single diagnostic question: why do most outbound programmes fail? The answer — inconsistent ICP targeting, weak messaging, no repeatable system — became the thirty-second arc. Each line had one job. Nothing was left in that didn&apos;t earn its place.</p>
            <p>The goal was to make B2B buyers feel seen before the offer appeared. When a company recognises its own problem in the first few seconds, it stays for the solution. That sequencing — problem, cause, system, result — is what separates a sales video from a brand video. This needed to be both.</p>
          </div>
        </div>

        {/* ── VIDEO EMBED ── */}
        <figure className="post-video" style={{ margin: '64px 0' }}>
          <div className="post-video__frame">
            <iframe
              src="https://www.youtube.com/embed/XL-wrU8nrZk?rel=0&modestbranding=1"
              title="The Pipeline Lab — Brand Intro"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <figcaption>The Pipeline Lab brand intro — script and motion design by Afterthought.</figcaption>
        </figure>

        {/* ── SECTION: VISUAL DIRECTION ── */}
        <div className="case-section">
          <div className="case-section__label">Visual Direction</div>
          <div className="case-section__body">
            <h2>The aesthetic of a well-run sales operation.</h2>
            <p>The visual language had to feel like the inside of the agency itself — structured, sharp, and systematically executed. We avoided illustration and anything that read as &ldquo;creative agency.&rdquo; This was a performance business explaining a performance service to a performance audience.</p>
            <p>The style was built on clean layouts, bold kinetic typography, pipeline-inspired motion, and a dark-to-light palette with purple as the brand accent. Each transition was functional — it moved the argument forward rather than providing visual decoration. Abstract pipeline flows made the service feel tangible without making it literal.</p>
          </div>
        </div>

        {/* ── CLOSING ── */}
        <div className="case-section" style={{ borderBottom: 'none' }}>
          <div className="case-section__label">Result</div>
          <div className="case-section__body">
            <h2>One video. Every surface.</h2>
            <p>The final thirty seconds works as a standalone brand introduction across every context The Pipeline Lab operates in — website hero, LinkedIn feed, pitch conversation, outreach sequence. It earns attention in the first ten seconds, explains the service in the next ten, and closes with a position that a B2B buyer can actually remember.</p>
            <p>A GTM agency that looks as sharp as the systems it sells.</p>
          </div>
        </div>

        {/* ── CTA BLOCK ── */}
        <div className="color-block" style={{ background: '#0A0614', color: '#fff', marginTop: '80px' }}>
          <span className="eyebrow cb-eyebrow" style={{ color: 'rgba(168,85,247,0.7)' }}>Have a project?</span>
          <h2 className="cb-title display-lg">We write, design, and move.</h2>
          <p className="body-lg cb-body" style={{ opacity: 0.7 }}>Whether you need a brand identity, a motion piece, or both — we work across the brief from script to finished asset. If you have a story to tell, we&apos;d like to hear it first.</p>
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <span className="caption" style={{ opacity: 0.4, color: '#fff' }}>Bangalore · Working internationally · Est. 2025</span>
            <a className="btn" style={{ background: '#A855F7', color: '#fff' }} href="/contact">Send a brief →</a>
          </div>
        </div>

      </div>
    </>
  )
}
