import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Querida — Afterthought',
  description: 'A neighbourhood restaurant, identity and menu by Afterthought.',
}

export default function Querida() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span><a href="/work" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: '1px' }}>← Work</a></span>
          <span>·</span>
          <span>Case 002</span>
        </div>
        <h1 className="display-xl page-header__title">Querida — a neighbourhood place that takes itself seriously, but <em>only just</em>.</h1>
        <p className="page-header__sub body-lg">A small Spanish kitchen that had outgrown its first identity. We gave them a wordmark, a menu system, and a tone of voice that knows when to stop talking.</p>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="case-cover" style={{ background: 'var(--c-block-coral)' }}>
          <div className="case-cover__head">
            <div>
              <span className="caption" style={{ display: 'block', marginBottom: '12px', opacity: 0.7 }}>Project · 2026</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(72px, 11vw, 160px)', lineHeight: 0.9, letterSpacing: '-4px' }}>Querida</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="caption" style={{ display: 'block', marginBottom: '12px', opacity: 0.7 }}>Est. 2018 · Re-set 2026</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.75 }}>A neighbourhood restaurant<br />Bandra West, Mumbai</div>
            </div>
          </div>
          <div className="case-cover__visual">
            <div style={{ width: '100%', maxWidth: '700px' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(96px, 14vw, 200px)', lineHeight: 0.92, letterSpacing: '-6px', textAlign: 'center' }}>Querida</div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '-3px', top: '-3px', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--c-ink)' }}></span>
                  <span style={{ position: 'absolute', right: '-3px', top: '-3px', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--c-ink)' }}></span>
                </div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.7 }}>A small kitchen — Spanish, mostly</div>
            </div>
          </div>
          <div className="case-meta">
            <div><span className="caption">Client</span><div className="meta-val">Querida Restaurants</div></div>
            <div><span className="caption">Scope</span><div className="meta-val">Identity, Print, Menu</div></div>
            <div><span className="caption">Year</span><div className="meta-val">2026</div></div>
            <div><span className="caption">Lead</span><div className="meta-val">T. Gidwani &amp; A. Gautam</div></div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">01 · The brief</span></div>
          <div className="case-section__body">
            <p>Querida had been open for seven years on a quiet street in Bandra, Mumbai. The food was good, the room was full, and the identity — drawn in a hurry by a friend in 2018 — had stopped doing the work. The owner wanted a refresh ahead of a second site, but didn&apos;t want to lose what made the first one feel like a neighbourhood place.</p>
            <p>The brief asked for a logo. We pushed back, gently, for a system that could be re-set by the owner every Tuesday morning without us in the room.</p>
          </div>
        </div>

        <div className="case-pullquote container" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <blockquote>&quot;It&apos;s a Spanish word that means <em>&quot;darling&quot;</em>. Don&apos;t make it precious about it.&quot;</blockquote>
          <div className="case-pullquote__attr caption">— The owner, kickoff call, February 2026</div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">02 · The second thought</span></div>
          <div className="case-section__body">
            <p>The first round leaned into &quot;darling&quot; — the kind of warm, ribboned, hand-drawn identity you&apos;ve seen on a hundred other restaurants. It was fine. We set it down.</p>
            <p>The second thought was a single italic wordmark, set in a serif that does most of the work, and one rule the whole system is built on: the menu changes every week, so the menu <em>is</em> the identity. Everything else stays out of its way.</p>
          </div>
        </div>

        <div className="case-asset" style={{ background: 'var(--c-block-cream)', padding: '48px', minHeight: '520px' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: 'var(--c-canvas)', padding: '40px', borderRadius: '8px', boxShadow: '0 16px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--c-hairline)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '52px', lineHeight: 1, letterSpacing: '-1.5px' }}>Querida</div>
              <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.55 }}>Menu · Wk 14 · Apr 2026</div>
            </div>
            <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}><span>Pan con tomate</span><span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.35)', margin: '0 8px', transform: 'translateY(-3px)' }}></span><span>06</span></div>
              <div style={{ display: 'flex', alignItems: 'center' }}><span>Boquerones en vinagre</span><span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.35)', margin: '0 8px', transform: 'translateY(-3px)' }}></span><span>09</span></div>
              <div style={{ display: 'flex', alignItems: 'center' }}><span>Tortilla, dressed leaves</span><span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.35)', margin: '0 8px', transform: 'translateY(-3px)' }}></span><span>11</span></div>
              <div style={{ display: 'flex', alignItems: 'center' }}><span>Gambas al ajillo</span><span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.35)', margin: '0 8px', transform: 'translateY(-3px)' }}></span><span>14</span></div>
              <div style={{ display: 'flex', alignItems: 'center' }}><span>Albóndigas, mother&apos;s recipe</span><span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.35)', margin: '0 8px', transform: 'translateY(-3px)' }}></span><span>12</span></div>
              <div style={{ display: 'flex', alignItems: 'center' }}><span>Almond cake, citrus</span><span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.35)', margin: '0 8px', transform: 'translateY(-3px)' }}></span><span>08</span></div>
            </div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">03 · The system</span></div>
          <div className="case-section__body">
            <p>One italic wordmark. One serif, one monospace, one paper colour. The dish names and the prices do everything else. The owner prints a fresh menu every Tuesday on a small Risograph in the back office — the same printer the team uses for the loyalty card, the Sunday lunch flyer, and the takeaway slip.</p>
            <p>We wrote a one-page guide. The owner has not called us about it since.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '32px 0' }}>
          <div className="case-asset" style={{ background: 'var(--c-ink)', color: 'var(--c-inverse-ink)', minHeight: '320px', padding: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '80px', lineHeight: 1, letterSpacing: '-2px' }}>Q</div>
              <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.7 }}>Monogram · For napkins, the awning, the matchbook</div>
            </div>
          </div>
          <div className="case-asset" style={{ background: 'var(--c-block-pink)', minHeight: '320px', padding: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '48px', lineHeight: 1, letterSpacing: '-1.5px' }}>Sunday lunch<br />at <em>Querida</em></div>
              <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.65 }}>Risograph poster · 2 colours, one rule</div>
            </div>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">04 · The room</span></div>
          <div className="case-section__body">
            <p>We made small, useful interventions to the room — a re-set of the signage, a new pendant for the bar, a paint colour for the back wall that matches the menu paper. The renovation happened over a single Sunday, between services. The regulars noticed in the right way: a few of them asked what was different, and most of them couldn&apos;t quite say.</p>
          </div>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">05 · The outcome</span></div>
          <div className="case-section__body">
            <p>The second site — in Goa, a quieter version of the same kitchen — opened in May 2026. The identity moved with it, the menu changed, and the wordmark stayed the same italic. The owner has been kind enough to recommend us to two of her chef friends.</p>
            <p>It was the project that taught us a useful rule we now apply to all our restaurant work: don&apos;t design the menu, design the way the menu changes.</p>
          </div>
        </div>

        <div className="case-next">
          <div>
            <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '8px' }}>Previous project</span>
            <div style={{ fontSize: '28px', letterSpacing: '-0.4px', fontVariationSettings: "'wght' 480", fontWeight: 480 }}>Helio — a climate-tech holding company, renamed.</div>
          </div>
          <a className="btn btn-primary" href="/work/helio">Read Helio →</a>
        </div>
      </section>
    </>
  )
}
