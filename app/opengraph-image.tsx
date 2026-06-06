import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Afterthought — A design & creative studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#D7F26C' }} />
          <span style={{ color: '#9A9A92', fontSize: '26px', letterSpacing: '0.04em' }}>
            Design &amp; creative studio · Bangalore
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ color: '#FFFFFF', fontSize: '120px', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
            Afterthought
          </div>
          <div style={{ color: '#C9C9C2', fontSize: '34px', lineHeight: 1.3, maxWidth: '860px' }}>
            Brand identity, naming, packaging and digital — by Anurag Gautam &amp; Tina Gidwani.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#6E6E66', fontSize: '24px' }}>
          afterthought.studio
        </div>
      </div>
    ),
    { ...size }
  )
}
