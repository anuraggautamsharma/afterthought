import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Justach — Afterthought',
  description: 'Naming and brand identity for Justach — a modern men\'s salon & spa built around the moustache as a complete visual language.',
}

function MoustacheMark({ color = '#F1E9DA', size = 200 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.48} viewBox="0 0 200 96" fill="none" aria-hidden="true">
      <path d="M100 58 C88 58 72 52 56 42 C40 32 22 28 12 36 C5 41 4 50 10 56 C18 62 34 60 50 54 C64 48 80 52 100 58Z" fill={color}/>
      <path d="M100 58 C120 52 136 48 150 54 C166 60 182 62 190 56 C196 50 195 41 188 36 C178 28 160 32 144 42 C128 52 112 58 100 58Z" fill={color}/>
    </svg>
  )
}

export default function Justach() {
  return (
    <>
      {/* ── HERO ── */}
      <div className="cs-hero">
        <div className="cs-hero__image cs-hero-justach">
          <MoustacheMark color="rgba(241,233,218,0.22)" size={320} />
          <div className="cs-hero-justach__wordmark">Justach</div>
        </div>
        <div className="cs-hero__gradient"></div>
        <div className="cs-hero__info">
          <div className="container">
            <div className="cs-hero__eyebrow">
              <a href="/work">← Work</a>
              <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
              <span>Case 001</span>
            </div>
            <h1 className="display-xl cs-hero__title">
              Justach — a men&apos;s grooming brand built around one<em> unforgettable symbol</em>.
            </h1>
          </div>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="cs-meta container">
        <div className="cs-meta__item">
          <span className="cs-meta__label">Client</span>
          <span className="cs-meta__val">Justach Salon & Spa</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Scope</span>
          <span className="cs-meta__val">Naming · Logo · Identity</span>
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
          <p>Most men&apos;s grooming brands reach for the same toolkit: a pair of scissors, a straight razor, a comb, some leather. Justach reached for something more ownable. Something that could sit on a business card, hang on a door, and still be immediately understood as belonging to one place.</p>
          <p>The brief was to build a modern salon & spa identity that felt masculine without being aggressive, premium without being cold, and memorable enough that clients would recognise it the second time they walked past.</p>
        </div>

        {/* ── SECTION: THE NAME ── */}
        <div className="case-section">
          <div className="case-section__label">Naming</div>
          <div className="case-section__body">
            <h2>Just + Moustache.</h2>
            <p>The name came from the brand device itself. &ldquo;Just&rdquo; and &ldquo;Moustache&rdquo; compressed into a single word — sharp, direct, and effortless to say. It holds its shape at every size: on a storefront, in a notification, on a product label. And it does something most salon names don&apos;t — it tells you exactly what kind of place this is before you walk in.</p>
            <p>A name that is also a category claim. Men&apos;s grooming, owned.</p>
          </div>
        </div>

        {/* ── HERO VISUAL: WORDMARK ── */}
        <div className="cs-image" style={{ background: '#541388', minHeight: '420px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', padding: '64px 40px' }}>
            <MoustacheMark color="rgba(241,233,218,0.18)" size={240} />
            <div style={{ fontSize: 'clamp(64px, 10vw, 140px)', lineHeight: 0.95, letterSpacing: '-5px', fontVariationSettings: "'wght' 560", fontWeight: 560, color: '#F1E9DA' }}>Justach</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(241,233,218,0.4)' }}>Logo · Wordmark · 2025</div>
          </div>
        </div>

        {/* ── SECTION: VISUAL SYSTEM ── */}
        <div className="case-section">
          <div className="case-section__label">Visual System</div>
          <div className="case-section__body">
            <h2>The moustache as a brand device, not just a logo element.</h2>
            <p>The most important decision in this project wasn&apos;t the name, the typeface, or the palette. It was what we chose not to do with the moustache. We didn&apos;t treat it as a decorative accessory — a small icon next to the wordmark, a vector tucked into a corner. We made it the system.</p>
            <p>The moustache appears inside the wordmark, becomes a repeating pattern, divides sections of a service menu, wraps packaging, hangs on a towel. Every customer touchpoint carries it. The result is an identity that doesn&apos;t just represent the brand — it is the brand.</p>
          </div>
        </div>

        {/* ── IMAGE GRID: APPLICATIONS ── */}
        <div className="cs-image-grid">
          <div className="cs-image" style={{ background: '#F1E9DA', minHeight: '320px', margin: 0 }}>
            <div style={{ textAlign: 'center', padding: '48px 32px' }}>
              <MoustacheMark color="#541388" size={100} />
              <div style={{ marginTop: '24px', fontSize: '24px', fontVariationSettings: "'wght' 560", fontWeight: 560, letterSpacing: '-1px', color: '#541388' }}>Justach</div>
              <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(84,19,136,0.45)' }}>Business Card</div>
            </div>
          </div>
          <div className="cs-image" style={{ background: '#541388', minHeight: '320px', margin: 0 }}>
            <div style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', opacity: 0.22 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <MoustacheMark key={i} color="#F1E9DA" size={36} />
                ))}
              </div>
              <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(241,233,218,0.4)' }}>Pattern</div>
            </div>
          </div>
        </div>

        {/* ── SECTION: PALETTE ── */}
        <div className="case-section">
          <div className="case-section__label">Colour</div>
          <div className="case-section__body">
            <h2>The colours no other men&apos;s salon was using.</h2>
            <p>Most men&apos;s grooming brands live in a narrow range: black, white, charcoal, forest green, or gold. Each of those palettes communicates something, but they all say the same thing in different accents. We wanted a palette that was immediately ownable — something clients would associate only with Justach.</p>
            <p>Deep purple (#541388) gives the brand confidence and depth without the coldness of black or the loudness of red. Warm cream (#F1E9DA) brings it back to earth — a grooming warmth that feels considered, not clinical. Together they create contrast that reads premium while carrying genuine personality.</p>
          </div>
        </div>

        {/* ── COLOUR PALETTE VISUAL ── */}
        <div className="cs-image" style={{ background: 'var(--c-surface-soft)', minHeight: '280px' }}>
          <div style={{ display: 'flex', gap: '0', width: '100%', height: '100%', minHeight: '280px', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#541388', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(241,233,218,0.5)', marginBottom: '6px' }}>Deep Purple</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#F1E9DA' }}>#541388</div>
            </div>
            <div style={{ flex: 1, background: '#F1E9DA', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(84,19,136,0.45)', marginBottom: '6px' }}>Warm Cream</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#541388' }}>#F1E9DA</div>
            </div>
          </div>
        </div>

        {/* ── CLOSING ── */}
        <div className="case-section" style={{ borderBottom: 'none' }}>
          <div className="case-section__label">Result</div>
          <div className="case-section__body">
            <h2>A grooming brand with a signature.</h2>
            <p>The strongest identities have a symbol that works everywhere — not just on a screen or a business card, but on a towel, a product cap, a storefront window, a paper bag. Justach has that. The moustache is recognisable at 6 pixels and at 6 metres. It is the brand, and the brand is it.</p>
            <p>Clients who visit once leave knowing the name and the mark. That kind of recall is what every brand brief asks for, and very few identities actually deliver. Justach does.</p>
          </div>
        </div>

        {/* ── CTA BLOCK ── */}
        <div className="color-block" style={{ background: '#541388', color: '#F1E9DA', marginTop: '80px' }}>
          <span className="eyebrow cb-eyebrow" style={{ color: 'rgba(241,233,218,0.55)' }}>Have a project?</span>
          <h2 className="cb-title display-lg">The shelf has room for one more.</h2>
          <p className="body-lg cb-body" style={{ opacity: 0.8 }}>We take on a small number of projects at a time. If you have a naming challenge, an identity that needs rethinking, or a brand you want to build from scratch — we&apos;d like to hear from you.</p>
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(241,233,218,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <span className="caption" style={{ opacity: 0.5, color: '#F1E9DA' }}>Bangalore · Working internationally · Est. 2025</span>
            <a className="btn" style={{ background: '#F1E9DA', color: '#541388' }} href="/contact">Send a brief →</a>
          </div>
        </div>

      </div>
    </>
  )
}
