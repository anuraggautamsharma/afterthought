import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Helio — Afterthought',
  description: 'A climate-tech holding company, named and rebranded by Afterthought.',
}

export default function Helio() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span><a href="/work" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: '1px' }}>← Work</a></span>
          <span>·</span>
          <span>Case 001</span>
        </div>
        <h1 className="display-xl page-header__title">Helio — from a brief about heat pumps to a brand about <em>hope</em>.</h1>
        <p className="page-header__sub body-lg">A climate-tech holding company asked for a new name and identity for the moment they stopped being a &quot;heat-pump installer&quot; and started being something larger.</p>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="case-cover" style={{ background: 'var(--c-block-lime)' }}>
          <div className="case-cover__head">
            <div>
              <span className="caption" style={{ display: 'block', marginBottom: '12px', opacity: 0.6 }}>Project · 2025</span>
              <div style={{ fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.9, letterSpacing: '-4px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>Helio</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="caption" style={{ display: 'block', marginBottom: '12px', opacity: 0.6 }}>R0 — R3</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7 }}>A climate-tech holding company<br />Bangalore &amp; Berlin</div>
            </div>
          </div>
          <div className="case-cover__visual">
            <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="vis-helio__sun" style={{ width: '220px', height: '220px' }}></div>
              <div style={{ fontSize: 'clamp(96px, 14vw, 200px)', lineHeight: 0.9, letterSpacing: '-8px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>Heli<span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>o</span></div>
            </div>
          </div>
          <div className="case-meta">
            <div><span className="caption">Client</span><div className="meta-val">Helio Holdings</div></div>
            <div><span className="caption">Scope</span><div className="meta-val">Naming, Identity, Web</div></div>
            <div><span className="caption">Year</span><div className="meta-val">2025</div></div>
            <div><span className="caption">Lead</span><div className="meta-val">A. Gautam &amp; T. Gidwani</div></div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">01 · The brief</span></div>
          <div className="case-section__body">
            <p>The company had outgrown its first name. What had begun as a small installer of residential heat pumps was, four years on, three businesses under one roof — installation, manufacturing, and a small lending arm to help homeowners pay for any of it.</p>
            <p>The founders arrived at our first call with a brief that asked, politely, for a &quot;more professional logo.&quot; They left agreeing that what they actually needed was a single word the whole group could stand under, and a story honest enough to make the lending arm sound like the same company as the installers in the van.</p>
          </div>
        </div>

        <div className="case-pullquote container" style={{ paddingLeft: 0, paddingRight: 0 }}>
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

        <div className="case-asset" style={{ background: 'var(--c-block-navy)', color: 'var(--c-inverse-ink)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 1, letterSpacing: '-6px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>Heli<span style={{ display: 'inline-block', transform: 'translateY(2px)', color: 'var(--c-block-coral)' }}>o</span></div>
            <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>Wordmark · Light &amp; dark · 2025</div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">03 · The system</span></div>
          <div className="case-section__body">
            <p>One mark, one wordmark, and a sub-system of three: Helio Home (installation), Helio Works (manufacturing), Helio Capital (lending). Each sub-brand is the same sun rotated. Three different times of day.</p>
            <p>The type system is built on two voices: a long, plain-spoken sans for the homeowner-facing side, and a tighter monospaced voice for the lending and manufacturing documents — the kind of language that earns trust by being less excited than the situation calls for.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '32px 0' }}>
          <div className="case-asset" style={{ background: 'var(--c-block-coral)', minHeight: '360px', padding: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '72px', lineHeight: 0.9, letterSpacing: '-3px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>Helio<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-2px' }}>Home</span></div>
              <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.7 }}>Sub-brand · Installation</div>
            </div>
          </div>
          <div className="case-asset" style={{ background: 'var(--c-block-cream)', minHeight: '360px', padding: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '72px', lineHeight: 0.9, letterSpacing: '-3px', fontVariationSettings: "'wght' 540", fontWeight: 540 }}>Helio<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-2px' }}>Capital</span></div>
              <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.7 }}>Sub-brand · Lending</div>
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

        <div className="case-asset" style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', padding: '24px', minHeight: '460px' }}>
          <div style={{ width: '100%', maxWidth: '720px', background: 'var(--c-block-navy)', borderRadius: '8px', padding: '32px', color: 'var(--c-inverse-ink)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.6 }}>
              <span>helio.com</span><span>2025</span>
            </div>
            <div style={{ margin: '48px 0 24px', fontSize: '48px', lineHeight: 1.05, letterSpacing: '-1px' }}>A warmer home<br />and a quieter <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>planet</em>.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: 'var(--c-block-coral)', color: 'var(--c-ink)', padding: '8px 16px', borderRadius: '50px', fontSize: '13px' }}>Find an installer</span>
              <span style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--c-inverse-ink)', padding: '8px 16px', borderRadius: '50px', fontSize: '13px' }}>See pricing</span>
            </div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">05 · The outcome</span></div>
          <div className="case-section__body">
            <p>The new system launched in the autumn of 2025 across three markets — India, Germany, and a small pilot in the UK. The homeowner side of the business booked its strongest quarter in the four following weeks; the lending arm, which had been quietly invisible, took on its first institutional partner.</p>
            <p>It&apos;s a project we&apos;d happily do again, mostly because the founders made the second-best decision we&apos;ve ever seen a client make: they let us throw away the first round of work in the first month.</p>
          </div>
        </div>

        <div className="case-next">
          <div>
            <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '8px' }}>Next project</span>
            <div style={{ fontSize: '28px', letterSpacing: '-0.4px', fontVariationSettings: "'wght' 480", fontWeight: 480 }}>Querida — a neighbourhood place, re-set.</div>
          </div>
          <a className="btn btn-primary" href="/work/querida">Read Querida →</a>
        </div>
      </section>
    </>
  )
}
