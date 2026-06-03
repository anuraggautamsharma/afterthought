import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Helio — Afterthought',
  description: 'A climate-tech holding company, named and rebranded by Afterthought.',
}

export default function Helio() {
  return (
    <>
      {/* ── HERO ── */}
      <div className="cs-hero">
        <div className="cs-hero__image" style={{ background: 'var(--c-block-lime)' }}>
          <div className="cs-hero-helio">
            <div className="vis-helio__sun cs-hero-helio__sun"></div>
            <div className="cs-hero-helio__wordmark">Heli<span className="o">o</span></div>
          </div>
        </div>
        <div className="cs-hero__gradient"></div>
        <div className="cs-hero__info">
          <div className="container">
            <div className="cs-hero__eyebrow">
              <a href="/work">← Work</a>
              <span>·</span>
              <span>Case 001</span>
            </div>
            <h1 className="display-xl cs-hero__title">Helio — from a brief about heat pumps to a brand about <em>hope</em>.</h1>
          </div>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="cs-meta container">
        <div className="cs-meta__item">
          <span className="cs-meta__label">Client</span>
          <span className="cs-meta__val">Helio Holdings</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Scope</span>
          <span className="cs-meta__val">Naming, Identity, Web</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Year</span>
          <span className="cs-meta__val">2025</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Lead</span>
          <span className="cs-meta__val">A. Gautam &amp; T. Gidwani</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        <div className="cs-intro">
          <p>A climate-tech holding company asked for a new name and identity for the moment they stopped being a &quot;heat-pump installer&quot; and started being something larger.</p>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">01 · The brief</span></div>
          <div className="case-section__body">
            <p>The company had outgrown its first name. What had begun as a small installer of residential heat pumps was, four years on, three businesses under one roof — installation, manufacturing, and a small lending arm to help homeowners pay for any of it.</p>
            <p>The founders arrived at our first call with a brief that asked, politely, for a &quot;more professional logo.&quot; They left agreeing that what they actually needed was a single word the whole group could stand under, and a story honest enough to make the lending arm sound like the same company as the installers in the van.</p>
          </div>
        </div>

        {/* Wordmark on dark */}
        <div className="cs-image" style={{ background: 'var(--c-block-navy)', color: 'var(--c-inverse-ink)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(80px, 13vw, 192px)', lineHeight: 1, letterSpacing: '-7px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>
              Heli<span style={{ display: 'inline-block', transform: 'translateY(3px)', color: 'var(--c-block-coral)' }}>o</span>
            </div>
            <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.45 }}>Wordmark · Primary · 2025</div>
          </div>
        </div>

        <div className="case-pullquote">
          <blockquote>&quot;We don&apos;t sell heat pumps. We sell the part of the house that <em>finally feels like the future</em>.&quot;</blockquote>
          <div className="case-pullquote__attr caption">Helio — internal brand line, 2025</div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">02 · The second thought</span></div>
          <div className="case-section__body">
            <p>Our first round had the obvious answers — earnest greens, leafy metaphors, the kind of identity that politely apologises for asking the homeowner to spend money. We made them well and then set them down.</p>
            <p>The second thought went the other way. Heat pumps are sun-shaped on a diagram. Lending is the same sun, on a longer timescale. The new name — Helio — covered all three businesses without translation, and the mark became a single solar disk: half-orange, half-night. Hope, and the hours it takes.</p>
          </div>
        </div>

        {/* Sub-brand grid */}
        <div className="cs-image-grid">
          <div className="cs-image" style={{ background: 'var(--c-block-coral)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(52px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-3px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>
                Helio<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-2px' }}>Home</span>
              </div>
              <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.6 }}>Sub-brand · Installation</div>
            </div>
          </div>
          <div className="cs-image" style={{ background: 'var(--c-block-cream)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(52px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-3px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>
                Helio<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-2px' }}>Capital</span>
              </div>
              <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.6 }}>Sub-brand · Lending</div>
            </div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">03 · The system</span></div>
          <div className="case-section__body">
            <p>One mark, one wordmark, and a sub-system of three: Helio Home (installation), Helio Works (manufacturing), Helio Capital (lending). Each sub-brand is the same sun rotated. Three different times of day.</p>
            <p>The type system is built on two voices: a long, plain-spoken sans for the homeowner-facing side, and a tighter monospaced voice for the lending and manufacturing documents — the kind of language that earns trust by being less excited than the situation calls for.</p>
          </div>
        </div>

        {/* Website mockup */}
        <div className="cs-image" style={{ background: 'var(--c-block-navy)', padding: '56px', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <div style={{ width: '100%', maxWidth: '680px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '40px', color: 'var(--c-inverse-ink)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '48px' }}>
              <span>helio.com</span><span>2025</span>
            </div>
            <div style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.08, letterSpacing: '-1px', marginBottom: '28px' }}>
              A warmer home<br />and a quieter <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>planet</em>.
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--c-block-lime)', color: 'var(--c-ink)', padding: '10px 20px', borderRadius: '50px', fontSize: '13px', fontVariationSettings: "'wght' 480", fontWeight: 480 }}>Find an installer</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--c-inverse-ink)', padding: '10px 20px', borderRadius: '50px', fontSize: '13px' }}>See pricing</span>
            </div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">04 · The site</span></div>
          <div className="case-section__body">
            <p>The website was the second-largest piece of work after the name. Most climate sites are either selling fear or selling figures. Ours sells a calmer thing: the day after the install, the week after the loan, the room that finally feels right.</p>
            <p>It also does the boring work well — financing calculators, three different homeowner journeys, a press room, an investor section the lawyers signed off on without re-writing.</p>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">05 · The outcome</span></div>
          <div className="case-section__body">
            <p>The new system launched in the autumn of 2025 across three markets — India, Germany, and a small pilot in the UK. The homeowner side of the business booked its strongest quarter in the four following weeks; the lending arm, which had been quietly invisible, took on its first institutional partner.</p>
            <p>It&apos;s a project we&apos;d happily do again, mostly because the founders made the second-best decision we&apos;ve ever seen a client make: they let us throw away the first round of work in the first month.</p>
          </div>
        </div>

        {/* ── NEXT ── */}
        <div className="cs-next">
          <div>
            <span className="cs-next__label">Next project</span>
            <div className="cs-next__title">Querida — a neighbourhood place that takes itself seriously, but only just.</div>
          </div>
          <a className="btn btn-primary" href="/work/querida">Read Querida →</a>
        </div>

      </div>
    </>
  )
}
