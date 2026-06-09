import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// Brand fonts, bundled so the renderer is pixel-accurate (no runtime fetch).
const dir = join(process.cwd(), 'assets/fonts')
const serif = readFileSync(join(dir, 'InstrumentSerif-Regular.ttf'))
const serifItalic = readFileSync(join(dir, 'InstrumentSerif-Italic.ttf'))
const mono = readFileSync(join(dir, 'JetBrainsMono-Regular.ttf'))
const monoMed = readFileSync(join(dir, 'JetBrainsMono-Medium.ttf'))

const FONTS = [
  { name: 'Instrument Serif', data: serif, style: 'normal' as const, weight: 400 as const },
  { name: 'Instrument Serif', data: serifItalic, style: 'italic' as const, weight: 400 as const },
  { name: 'JetBrains Mono', data: mono, style: 'normal' as const, weight: 400 as const },
  { name: 'JetBrains Mono', data: monoMed, style: 'normal' as const, weight: 500 as const },
]

export type HeroTheme = 'navy' | 'lime' | 'ink'
export type HeroStyle = 'blocks' | 'grid' | 'editorial' | 'gradient'
export type FigureStyle = 'statement' | 'quote' | 'shapes'

interface Palette {
  bg: string; fg: string; accent: string; accent2: string; muted: string
  pillBg: string; pillFg: string; tint: string; dot: string; grad: string
}

const PALETTE: Record<HeroTheme, Palette> = {
  navy: { bg: '#161A3B', fg: 'rgba(255,255,255,0.95)', accent: '#D7F26C', accent2: '#E62E7A', muted: 'rgba(255,255,255,0.42)', pillBg: '#ffffff', pillFg: '#161A3B', tint: 'rgba(255,255,255,0.07)', dot: 'rgba(255,255,255,0.16)', grad: '#23264f' },
  ink:  { bg: '#0A0A0A', fg: 'rgba(255,255,255,0.95)', accent: '#D7F26C', accent2: '#E62E7A', muted: 'rgba(255,255,255,0.42)', pillBg: '#D7F26C', pillFg: '#0A0A0A', tint: 'rgba(255,255,255,0.06)', dot: 'rgba(255,255,255,0.14)', grad: '#1c1c1c' },
  lime: { bg: '#D7F26C', fg: '#0A0A0A', accent: '#161A3B', accent2: '#E62E7A', muted: 'rgba(10,10,10,0.55)', pillBg: '#0A0A0A', pillFg: '#D7F26C', tint: 'rgba(22,26,59,0.10)', dot: 'rgba(22,26,59,0.18)', grad: '#c8e85a' },
}

function dotGrid(color: string, w: number, h: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><pattern id='d' width='46' height='46' patternUnits='userSpaceOnUse'><circle cx='3' cy='3' r='2.6' fill='${color}'/></pattern></defs><rect width='100%' height='100%' fill='url(#d)'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const box = (s: Record<string, unknown>) => ({ display: 'flex', ...s })

/** Decorative background layer for a hero, keyed by style. */
function heroDeco(style: HeroStyle, t: Palette, w: number, h: number) {
  const limeRule = <div key="r" style={box({ position: 'absolute', left: 96, top: 286, width: 60, height: 6, background: t.accent })} />
  if (style === 'grid') {
    return [
      <div key="g" style={box({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: dotGrid(t.dot, w, h), backgroundSize: `${w}px ${h}px` })} />,
      <div key="a" style={box({ position: 'absolute', top: 0, right: 0, width: 16, height: '100%', background: t.accent })} />,
    ]
  }
  if (style === 'gradient') {
    return [
      <div key="g" style={box({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(135deg, ${t.bg} 0%, ${t.grad} 58%, ${t.bg} 100%)` })} />,
      <div key="c" style={box({ position: 'absolute', top: -240, right: -160, width: 680, height: 680, borderRadius: '50%', background: t.tint })} />,
      limeRule,
    ]
  }
  if (style === 'editorial') {
    return [limeRule]
  }
  // 'blocks' — clean white-tint depth + a lime accent (colored translucency
  // over a dark field reads muddy, so depth shapes stay neutral)
  return [
    <div key="c" style={box({ position: 'absolute', top: -200, right: -120, width: 600, height: 600, borderRadius: '50%', background: t.tint })} />,
    <div key="s" style={box({ position: 'absolute', bottom: -220, left: -150, width: 520, height: 520, borderRadius: 80, background: t.tint, transform: 'rotate(16deg)' })} />,
    limeRule,
  ]
}

function headlineSize(title: string): number {
  const n = title.length
  if (n > 70) return 70
  if (n > 48) return 88
  if (n > 28) return 108
  return 128
}

async function render(el: React.ReactElement, w: number, h: number): Promise<Buffer> {
  const img = new ImageResponse(el, { width: w, height: h, fonts: FONTS })
  return Buffer.from(await img.arrayBuffer())
}

export interface HeroOptions {
  title: string
  eyebrow?: string
  caption?: string
  theme?: HeroTheme
  style?: HeroStyle
}

/** Renders a branded 1600x900 hero PNG. */
export async function renderHero(opts: HeroOptions): Promise<Buffer> {
  const W = 1600, H = 900
  const t = PALETTE[opts.theme ?? 'navy'] ?? PALETTE.navy
  const style = opts.style ?? 'blocks'
  const title = (opts.title || 'Untitled').trim()
  const eyebrow = (opts.eyebrow || 'The Journal').trim().toUpperCase()
  const caption = (opts.caption || 'afterthought.design').trim().toUpperCase()

  return render(
    <div style={box({ width: '100%', height: '100%', position: 'relative', background: t.bg, fontFamily: 'Instrument Serif', overflow: 'hidden' })}>
      {heroDeco(style, t, W, H)}
      <div style={box({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'column', justifyContent: 'space-between', padding: '92px 96px' })}>
        <div style={box({ justifyContent: 'space-between', alignItems: 'center' })}>
          <div style={box({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: t.accent })}>{eyebrow}</div>
          <div style={box({ fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 2, color: t.muted })}>Afterthought</div>
        </div>
        <div style={box({ fontStyle: 'italic', fontSize: headlineSize(title), lineHeight: 1.02, letterSpacing: -3, color: t.fg, maxWidth: 1340 })}>{title}</div>
        <div style={box({ justifyContent: 'space-between', alignItems: 'center' })}>
          <div style={box({ fontFamily: 'JetBrains Mono', fontSize: 20, letterSpacing: 2, color: t.muted })}>{caption}</div>
          <div style={box({ alignItems: 'center', background: t.pillBg, color: t.pillFg, fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 20, letterSpacing: 1, padding: '15px 30px', borderRadius: 999 })}>Read the essay →</div>
        </div>
      </div>
    </div>,
    W, H,
  )
}

export interface FigureOptions {
  text: string
  attribution?: string
  theme?: HeroTheme
  style?: FigureStyle
  ratio?: '16-9' | 'square'
}

/** Renders a branded in-article figure (quote card, statement, or abstract). */
export async function renderFigure(opts: FigureOptions): Promise<Buffer> {
  const square = opts.ratio === 'square'
  const W = square ? 1200 : 1600
  const H = square ? 1200 : 900
  const t = PALETTE[opts.theme ?? 'navy'] ?? PALETTE.navy
  const style = opts.style ?? 'statement'
  const txt = (opts.text || '').trim()
  const size = txt.length > 120 ? 56 : txt.length > 70 ? 70 : 88

  let inner: React.ReactElement
  if (style === 'quote') {
    inner = (
      <div style={box({ flexDirection: 'column', padding: '110px 120px', width: '100%', height: '100%', justifyContent: 'center' })}>
        <div style={box({ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 200, lineHeight: 0.7, color: t.accent, marginBottom: 8 })}>&ldquo;</div>
        <div style={box({ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: size, lineHeight: 1.1, letterSpacing: -1.5, color: t.fg, maxWidth: W - 240 })}>{txt}</div>
        {opts.attribution ? <div style={box({ fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: t.muted, marginTop: 36 })}>{opts.attribution}</div> : <div />}
      </div>
    )
  } else if (style === 'shapes') {
    inner = (
      <div style={box({ width: '100%', height: '100%', alignItems: 'flex-end', padding: '96px' })}>
        <div style={box({ position: 'absolute', top: -200, left: -160, width: 560, height: 560, borderRadius: '50%', background: t.accent })} />
        <div style={box({ position: 'absolute', bottom: -180, right: -150, width: 460, height: 460, borderRadius: 80, background: t.accent2, transform: 'rotate(20deg)' })} />
        <div style={box({ position: 'absolute', top: 120, right: 120, width: 120, height: 120, borderRadius: '50%', background: t.tint })} />
        <div style={box({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: t.fg })}>{txt || 'Afterthought'}</div>
      </div>
    )
  } else {
    inner = (
      <div style={box({ flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '96px 120px', textAlign: 'center' })}>
        <div style={box({ position: 'absolute', bottom: -200, right: -140, width: 520, height: 520, borderRadius: '50%', background: t.accent })} />
        <div style={box({ position: 'absolute', top: -160, left: -120, width: 360, height: 360, borderRadius: 64, background: t.tint, transform: 'rotate(14deg)' })} />
        <div style={box({ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: size, lineHeight: 1.08, letterSpacing: -1.5, color: t.fg, maxWidth: W - 280 })}>{txt}</div>
      </div>
    )
  }

  return render(
    <div style={box({ width: '100%', height: '100%', position: 'relative', background: t.bg, overflow: 'hidden' })}>{inner}</div>,
    W, H,
  )
}
