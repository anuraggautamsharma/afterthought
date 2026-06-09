import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// Brand fonts, bundled so the renderer is pixel-accurate (no runtime fetch).
const dir = join(process.cwd(), 'assets/fonts')
const serif = readFileSync(join(dir, 'InstrumentSerif-Regular.ttf'))
const serifItalic = readFileSync(join(dir, 'InstrumentSerif-Italic.ttf'))
const mono = readFileSync(join(dir, 'JetBrainsMono-Regular.ttf'))
const monoMed = readFileSync(join(dir, 'JetBrainsMono-Medium.ttf'))

export type HeroTheme = 'navy' | 'lime' | 'ink'

const THEMES: Record<HeroTheme, { bg: string; fg: string; accent: string; muted: string; pillBg: string; pillFg: string }> = {
  navy: { bg: '#161A3B', fg: 'rgba(255,255,255,0.94)', accent: '#D7F26C', muted: 'rgba(255,255,255,0.40)', pillBg: '#ffffff', pillFg: '#161A3B' },
  ink:  { bg: '#0A0A0A', fg: 'rgba(255,255,255,0.94)', accent: '#D7F26C', muted: 'rgba(255,255,255,0.40)', pillBg: '#ffffff', pillFg: '#0A0A0A' },
  lime: { bg: '#D7F26C', fg: '#0A0A0A', accent: '#161A3B', muted: 'rgba(10,10,10,0.55)', pillBg: '#0A0A0A', pillFg: '#D7F26C' },
}

function headlineSize(title: string): number {
  const n = title.length
  if (n > 64) return 74
  if (n > 44) return 92
  if (n > 26) return 112
  return 132
}

export interface HeroOptions {
  title: string
  eyebrow?: string
  caption?: string
  theme?: HeroTheme
}

/** Renders a branded 1600x900 hero PNG from a few words. Returns PNG bytes. */
export async function renderHero(opts: HeroOptions): Promise<Buffer> {
  const t = THEMES[opts.theme ?? 'navy'] ?? THEMES.navy
  const title = (opts.title || 'Untitled').trim()
  const eyebrow = (opts.eyebrow || 'The Journal').trim().toUpperCase()
  const caption = (opts.caption || 'afterthought.design').trim().toUpperCase()

  const img = new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '92px 96px', background: t.bg,
          fontFamily: 'Instrument Serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: t.accent }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 2, color: t.muted }}>
            Afterthought
          </div>
        </div>

        <div
          style={{
            display: 'flex', fontStyle: 'italic', fontSize: headlineSize(title),
            lineHeight: 1.02, letterSpacing: -3, color: t.fg, maxWidth: 1320,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 20, letterSpacing: 2, color: t.muted }}>
            {caption}
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', background: t.pillBg, color: t.pillFg,
              fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 20, letterSpacing: 1,
              padding: '15px 30px', borderRadius: 999,
            }}
          >
            Read the essay →
          </div>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: serifItalic, style: 'italic', weight: 400 },
        { name: 'JetBrains Mono', data: mono, style: 'normal', weight: 400 },
        { name: 'JetBrains Mono', data: monoMed, style: 'normal', weight: 500 },
      ],
    },
  )

  return Buffer.from(await img.arrayBuffer())
}
