import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Querida — Afterthought',
  description: 'A neighbourhood restaurant, identity and menu by Afterthought.',
}

export default function Querida() {
  return (
    <>
      {/* ── HERO ── */}
      <div className="cs-hero">
        <div className="cs-hero__image" style={{ background: 'var(--c-block-coral)' }}>
          <div className="cs-hero-querida">
            <div className="cs-hero-querida__name">Querida</div>
            <div className="cs-hero-querida__sub">A small kitchen · Spanish, mostly · Est. 2018</div>
          </div>
        </div>
        <div className="cs-hero__gradient"></div>
        <div className="cs-hero__info">
          <div className="container">
            <div className="cs-hero__eyebrow">
              <a href="/work">← Work</a>
              <span>·</span>
              <span>Case 002</span>
            </div>
            <h1 className="display-xl cs-hero__title">Querida — a neighbourhood place that takes itself seriously, but <em>only just</em>.</h1>
          </div>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="cs-meta container">
        <div className="cs-meta__item">
          <span className="cs-meta__label">Client</span>
          <span className="cs-meta__val">Querida Restaurants</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Scope</span>
          <span className="cs-meta__val">Identity, Print, Menu</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Year</span>
          <span className="cs-meta__val">2026</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Lead</span>
          <span className="cs-meta__val">T. Gidwani &amp; A. Gautam</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        <div className="cs-intro">
          <p>A small Spanish kitchen that had outgrown its first identity. We gave them a wordmark, a menu system, and a tone of voice that knows when to stop talking.</p>
        </div>

        <div className="case-section">
          <div className="case-section__label"><span className="eyebrow">01 · The brief</span></div>
          <div className="case-section__body">
            <p>Querida had been open for seven years on a quiet street in Bandra, Mumbai. The food was good, the room was full, and the identity — drawn in a hurry by a friend in 2018 — had stopped doing the work. The owner wanted a refresh ahead of a second site, but didn&apos;t want to lose what made the first one feel like a neighbourhood place.</p>
            <p>The brief asked for a logo. We pushed back, gently, for a system that could be re-set by the owner every Tuesday morning without us in the room.</p>
          </div>
        </div>

        {/* Menu mockup */}
        <div className="cs-image" style={{ background: 'var(--c-block-cream)', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '64px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: 'var(--c-canvas)', padding: '44px', borderRadius: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--c-hairline)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '52px', lineHeight: 1, letterSpacing: '-1.5px' }}>Querida</div>
              <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.5 }}>Menu · Wk 14 · Apr 2026</div>
            </div>
            <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              {[['Pan con tomate', '06'], ['Boquerones en vinagre', '09'], ['Tortilla, dressed leaves', '11'], ['Gambas al ajillo', '14'], ['Albóndigas, mother\'s recipe', '12'], ['Almond cake, citrus', '08']].map(([dish, price]) => (
                <div key={dish} style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{dish}</span>
                  <span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,0.3)', margin: '0 10px', transform: 'translateY(-3px)' }}></span>
                  <span>{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="case-pullquote">
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

        {/* Monogram + poster grid */}
        <div className="cs-image-grid">
          <div className="cs-image" style={{ background: 'var(--c-ink)', color: 'var(--c-inverse-ink)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 1, letterSpacing: '-2px' }}>Q</div>
              <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.6 }}>Monogram · Napkins, awning, matchbook</div>
            </div>
          </div>
          <div className="cs-image" style={{ background: 'var(--c-block-pink)' }}>
            <div style={{ textAlign: 'center', padding: '0 32px' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.08, letterSpacing: '-1.5px' }}>Sunday lunch<br />at <em>Querida</em></div>
              <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.6 }}>Risograph poster · 2 colours</div>
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

        {/* ── NEXT ── */}
        <div className="cs-next">
          <div>
            <span className="cs-next__label">Previous project</span>
            <div className="cs-next__title">Helio — from a brief about heat pumps to a brand about hope.</div>
          </div>
          <a className="btn btn-primary" href="/work/helio">Read Helio →</a>
        </div>

      </div>
    </>
  )
}
