import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design System — Afterthought',
  description: 'Afterthought visual language: typefaces, colour, spacing, radius, elevation, and components.',
}

const typeScale = [
  { cls: 'display-xl', size: '86px', weight: '340', tracking: '−1.72px', sample: 'Second thoughts.' },
  { cls: 'display-lg', size: '64px', weight: '340', tracking: '−0.96px', sample: 'The brands that don\'t know what they look like yet.' },
  { cls: 'display-md', size: '44px', weight: '340', tracking: '−0.66px', sample: 'We start where the obvious answer runs out.' },
  { cls: 'headline',   size: '26px', weight: '540', tracking: '−0.26px', sample: 'A neighbourhood place that takes itself seriously, but only just.' },
  { cls: 'subhead',    size: '26px', weight: '340', tracking: '−0.26px', sample: 'Brand identity, naming, packaging and digital.' },
  { cls: 'body-lg',   size: '20px', weight: '330', tracking: '−0.14px', sample: 'Made for founders, institutions and the occasional well-meaning monopoly. We start where the obvious answer runs out.' },
  { cls: 'body',      size: '18px', weight: '320', tracking: '−0.26px', sample: 'Afterthought is an independent design and creative studio based in Bangalore, working internationally on brand identity, naming, packaging and digital.' },
  { cls: 'body-sm',   size: '16px', weight: '330', tracking: '−0.14px', sample: 'Founded in 2025 by Anurag Gautam and Tina Gidwani.' },
  { cls: 'eyebrow',   size: '13px · Mono', weight: '400', tracking: '+0.54px', sample: 'Independent design & creative studio · Est. 2025' },
  { cls: 'caption',   size: '12px · Mono', weight: '400', tracking: '+0.60px', sample: 'Bangalore · Working internationally · Est. 2025' },
] as const

const colorGroups = [
  {
    label: 'Core',
    colors: [
      { name: 'Ink',          token: '--c-ink',           hex: '#0A0A0A', dark: true },
      { name: 'Canvas',       token: '--c-canvas',        hex: '#FFFFFF', border: true },
      { name: 'Surface Soft', token: '--c-surface-soft',  hex: '#F4F2EE' },
      { name: 'Hairline',     token: '--c-hairline',      hex: '#E6E4DF' },
    ],
  },
  {
    label: 'Colour blocks',
    colors: [
      { name: 'Lime',   token: '--c-block-lime',  hex: '#D7F26C' },
      { name: 'Lilac',  token: '--c-block-lilac', hex: '#CDBAF2' },
      { name: 'Cream',  token: '--c-block-cream', hex: '#F1E4CC' },
      { name: 'Mint',   token: '--c-block-mint',  hex: '#C7E9D5' },
      { name: 'Pink',   token: '--c-block-pink',  hex: '#F4C8D6' },
      { name: 'Coral',  token: '--c-block-coral', hex: '#F4A887' },
      { name: 'Navy',   token: '--c-block-navy',  hex: '#161A3B', dark: true },
    ],
  },
  {
    label: 'Semantic',
    colors: [
      { name: 'Success', token: '--c-semantic-success', hex: '#1FA86A', dark: true },
      { name: 'Magenta', token: '--c-accent-magenta',   hex: '#E62E7A', dark: true },
    ],
  },
]

const spacingTokens = [
  { name: 'xs',      token: '--s-xs',      val: '8px',  px: 8  },
  { name: 'sm',      token: '--s-sm',      val: '12px', px: 12 },
  { name: 'md',      token: '--s-md',      val: '16px', px: 16 },
  { name: 'lg',      token: '--s-lg',      val: '24px', px: 24 },
  { name: 'xl',      token: '--s-xl',      val: '32px', px: 32 },
  { name: 'xxl',     token: '--s-xxl',     val: '48px', px: 48 },
  { name: 'section', token: '--s-section', val: '96px', px: 96 },
]

const radiusTokens = [
  { name: 'xs',   token: '--r-xs',   val: '2px'   },
  { name: 'sm',   token: '--r-sm',   val: '6px'   },
  { name: 'md',   token: '--r-md',   val: '8px'   },
  { name: 'lg',   token: '--r-lg',   val: '24px'  },
  { name: 'xl',   token: '--r-xl',   val: '32px'  },
  { name: 'pill', token: '--r-pill', val: '50px'  },
  { name: 'full', token: '--r-full', val: '9999px'},
]

const elevationLevels = [
  { level: '0', label: 'Flat',      desc: 'No shadow, no border',                         style: {} },
  { level: '1', label: 'Hairline',  desc: '1px hairline border',                          style: { border: '1px solid var(--c-hairline)' } },
  { level: '2', label: 'Soft',      desc: '0 4px 16px rgba(0,0,0,0.06)',                  style: { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' } },
  { level: '3', label: 'Modal',     desc: '0 16px 48px rgba(0,0,0,0.14) + overlay scrim', style: { boxShadow: '0 16px 48px rgba(0,0,0,0.14)' } },
]

const colorBlocks = [
  { name: 'Lime',  bg: '#D7F26C', token: '--c-block-lime',  dark: false },
  { name: 'Lilac', bg: '#CDBAF2', token: '--c-block-lilac', dark: false },
  { name: 'Cream', bg: '#F1E4CC', token: '--c-block-cream', dark: false },
  { name: 'Mint',  bg: '#C7E9D5', token: '--c-block-mint',  dark: false },
  { name: 'Pink',  bg: '#F4C8D6', token: '--c-block-pink',  dark: false },
  { name: 'Coral', bg: '#F4A887', token: '--c-block-coral', dark: false },
  { name: 'Navy',  bg: '#161A3B', token: '--c-block-navy',  dark: true  },
]

const dos = [
  'Use one colour block per viewport — let the white canvas separate them.',
  'Pair btn-primary (black) with btn-secondary (white) as a matched CTA unit.',
  'Use Inter weight 320–540 only. Never introduce weights outside this set.',
  'Set all eyebrows and captions in Mono, always uppercase, positive tracking.',
  'Shape every text CTA as a pill (--r-pill). Icon buttons as circles (--r-full).',
  'Give colour-block sections --r-lg corners and --s-xxl interior padding.',
]

const donts = [
  'No mid-grey body text. Hierarchy comes from weight, not opacity.',
  'No drop shadows on colour-block sections — colour is the depth device.',
  'No new accent colours outside the documented block palette.',
  'Don\'t combine more than one colour block in a single viewport.',
  'Never square off a CTA. Square buttons read as a different brand.',
  'Don\'t use Mono for body copy — it\'s a taxonomy tool only.',
]

export default function DesignSystem() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>Afterthought</span><span>·</span><span>Design System</span>
        </div>
        <h1 className="display-xl page-header__title">System.</h1>
        <p className="page-header__sub body-lg">
          The visual language of Afterthought — typefaces, colour, spacing, radius, elevation, and components.
          Monochrome chrome. Pastel colour blocks. Pill CTAs. No exceptions.
        </p>
      </section>

      <div className="container ds-page">

        {/* ── 01 TYPEFACES ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">01 · Typefaces</span></div>
          <div className="ds-faces">
            <div className="ds-face">
              <div className="ds-face__specimen" style={{ fontVariationSettings: '"wght" 340', fontWeight: 340 }}>Aa</div>
              <div className="ds-face__meta">
                <div className="ds-face__name">Inter</div>
                <span className="ds-mono">--font-sans · Variable 320–700</span>
              </div>
            </div>
            <div className="ds-face">
              <div className="ds-face__specimen" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, letterSpacing: '-1px' }}>Aa</div>
              <div className="ds-face__meta">
                <div className="ds-face__name" style={{ fontFamily: 'var(--font-mono)' }}>JetBrains Mono</div>
                <span className="ds-mono">--font-mono · Eyebrows &amp; captions only</span>
              </div>
            </div>
            <div className="ds-face">
              <div className="ds-face__specimen" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-4px' }}>Aa</div>
              <div className="ds-face__meta">
                <div className="ds-face__name" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Instrument Serif</div>
                <span className="ds-mono">--font-serif · Italic accents only</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 TYPE SCALE ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">02 · Type scale</span></div>
          {typeScale.map(t => (
            <div key={t.cls} className="ds-type-row">
              <div className={`${t.cls} ds-type-sample`}>{t.sample}</div>
              <div className="ds-type-meta">
                <code className="ds-code">.{t.cls}</code>
                <div className="ds-mono" style={{ marginTop: 4 }}>{t.size} / {t.weight} / {t.tracking}</div>
              </div>
            </div>
          ))}
          <div className="ds-type-row">
            <div className="ds-type-sample" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-2px' }}>
              Darling — only just.
            </div>
            <div className="ds-type-meta">
              <code className="ds-code">.italic-serif</code>
              <div className="ds-mono" style={{ marginTop: 4 }}>Instrument Serif · Italic</div>
            </div>
          </div>
        </section>

        {/* ── 03 COLOUR ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">03 · Colour</span></div>
          {colorGroups.map(group => (
            <div key={group.label} className="ds-color-group">
              <div className="ds-mono ds-group-label">{group.label}</div>
              <div className="ds-swatches">
                {group.colors.map(c => (
                  <div key={c.token} className="ds-swatch">
                    <div
                      className="ds-swatch__chip"
                      style={{
                        background: c.hex,
                        border: 'border' in c && c.border ? '1px solid var(--c-hairline)' : 'none',
                      }}
                    />
                    <div className="ds-swatch__label">
                      <span style={{ fontVariationSettings: '"wght" 480', fontWeight: 480, fontSize: 13 }}>{c.name}</span>
                      <code className="ds-code ds-mono" style={{ marginTop: 2 }}>{c.hex}</code>
                      <code className="ds-code ds-mono" style={{ opacity: 0.4 }}>{c.token}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── 04 SPACING ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">04 · Spacing</span></div>
          <div className="ds-spacing-table">
            {spacingTokens.map(s => (
              <div key={s.token} className="ds-spacing-row">
                <code className="ds-code ds-spacing-name">{s.token}</code>
                <div className="ds-spacing-vis">
                  <div style={{ width: s.px, height: s.px, background: 'var(--c-ink)', borderRadius: 3, flexShrink: 0 }} />
                </div>
                <span className="ds-mono">{s.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 05 RADIUS ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">05 · Radius</span></div>
          <div className="ds-radius-grid">
            {radiusTokens.map(r => (
              <div key={r.token} className="ds-radius-item">
                <div style={{ width: 80, height: 80, background: 'var(--c-surface-soft)', border: '1px solid var(--c-hairline)', borderRadius: r.val }} />
                <div className="ds-radius-meta">
                  <code className="ds-code">{r.name}</code>
                  <span className="ds-mono">{r.val}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 ELEVATION ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">06 · Elevation</span></div>
          <div className="ds-elevation-grid">
            {elevationLevels.map(e => (
              <div key={e.level} className="ds-elevation-card" style={e.style}>
                <span className="ds-mono">Level {e.level}</span>
                <span style={{ fontVariationSettings: '"wght" 480', fontWeight: 480, fontSize: 15, marginTop: 4 }}>{e.label}</span>
                <span style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.4, marginTop: 4 }}>{e.desc}</span>
              </div>
            ))}
          </div>
          <p className="body-sm" style={{ marginTop: 24, opacity: 0.55 }}>
            Colour blocks substitute for traditional card elevation — where most sites use a shadow to draw attention, Afterthought uses a saturated background panel.
          </p>
        </section>

        {/* ── 07 BUTTONS ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">07 · Buttons</span></div>
          <div className="ds-btn-group">
            <div className="ds-btn-surface ds-btn-surface--light">
              <span className="ds-mono ds-group-label">On canvas</span>
              <div className="ds-btn-row">
                <a className="btn btn-primary" href="#">Primary</a>
                <a className="btn btn-secondary" href="#">Secondary</a>
                <a className="btn btn-magenta" href="#">Magenta promo</a>
              </div>
            </div>
            <div className="ds-btn-surface ds-btn-surface--dark">
              <span className="ds-mono ds-group-label" style={{ color: 'rgba(255,255,255,0.45)' }}>On inverse canvas</span>
              <div className="ds-btn-row">
                <a className="btn btn-primary" style={{ background: '#fff', color: '#0A0A0A' }} href="#">Primary (inv)</a>
                <a className="btn btn-secondary-dark" href="#">Secondary dark</a>
              </div>
            </div>
          </div>
          <div className="ds-btn-rules">
            <div className="ds-mono ds-group-label" style={{ gridColumn: '1/-1' }}>Shape rules</div>
            <div className="ds-btn-rule">
              <a className="btn btn-primary" href="#">Text CTA → pill (--r-pill)</a>
            </div>
            <div className="ds-btn-rule">
              <button className="btn btn-primary" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <span style={{ fontSize: 13, opacity: 0.55 }}>Icon button → circle (--r-full)</span>
            </div>
          </div>
        </section>

        {/* ── 08 COLOUR BLOCKS ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">08 · Colour blocks</span></div>
          <div className="ds-blocks-grid">
            {colorBlocks.map(b => (
              <div
                key={b.token}
                className="ds-block"
                style={{ background: b.bg, color: b.dark ? '#fff' : 'inherit' }}
              >
                <div className="ds-mono" style={{ opacity: 0.5, marginBottom: 12 }}>{b.token}</div>
                <div style={{ fontVariationSettings: '"wght" 480', fontWeight: 480, fontSize: 22, letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: 8 }}>{b.name}</div>
                <div style={{ fontSize: 13, opacity: 0.65, lineHeight: 1.5 }}>
                  Full-content-width · --r-lg · --s-xxl padding
                </div>
              </div>
            ))}
          </div>
          <p className="body-sm" style={{ marginTop: 24, opacity: 0.55 }}>
            One colour block per viewport. Always let the white canvas separate them. The monochrome chrome makes the blocks feel intentional; the blocks make the chrome feel editorial.
          </p>
        </section>

        {/* ── 09 DO'S & DON'TS ── */}
        <section className="ds-section">
          <div className="ds-section-head"><span className="eyebrow">09 · Do&apos;s &amp; don&apos;ts</span></div>
          <div className="ds-rules-grid">
            <div className="ds-rules-col">
              <div className="ds-mono ds-group-label" style={{ color: 'var(--c-semantic-success)' }}>Do</div>
              {dos.map((d, i) => (
                <div key={i} className="ds-rule ds-rule--do">
                  <span className="ds-rule__mark" style={{ color: 'var(--c-semantic-success)' }}>✓</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
            <div className="ds-rules-col">
              <div className="ds-mono ds-group-label" style={{ opacity: 0.45 }}>Don&apos;t</div>
              {donts.map((d, i) => (
                <div key={i} className="ds-rule ds-rule--dont">
                  <span className="ds-rule__mark" style={{ opacity: 0.35 }}>×</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
