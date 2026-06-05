import type { Metadata } from 'next'
import NewsletterForm from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Thinking — Afterthought',
  description: 'The Afterthought journal — essays on design, craft, and practice from the studio.',
}

const posts = [
  {
    slug: 'the-future-of-design-belongs-to-the-messy-middle',
    title: 'The Future of Design Belongs to the Messy Middle.',
    titleJsx: <>The Future of Design Belongs to the <em>Messy Middle</em>.</>,
    category: 'Essay',
    issue: 'Issue 01',
    date: 'Jun 2026',
    readTime: '8 min',
    bg: 'var(--c-block-navy)',
    textColor: 'rgba(255,255,255,0.92)',
    excerpt: 'Design today lives in the space between speed and taste, automation and intuition, business pressure and creative freedom. That is where the real work begins.',
    featured: true,
  },
]

const featured = posts[0]

export default function Thinking() {
  return (
    <>
      {/* ── PAGE HEADER ── */}
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse"></span>
          <span>The journal · Vol. 01 · Quarterly</span>
        </div>
        <h1 className="display-xl page-header__title">Essays, process notes and the occasional <em>strong opinion</em>.</h1>
        <p className="page-header__sub body-lg">We write when something is worth saying. Four times a year, roughly — essays on practice, notes on process, and opinions we&apos;re willing to put our name on.</p>
      </section>

      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        {/* ── FEATURED ARTICLE ── */}
        <a className="j-feat" href={`/thinking/${featured.slug}`}>
          <div className="j-feat__img" style={{ background: featured.bg }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.06, letterSpacing: '-2px', color: featured.textColor, maxWidth: '700px' }}>
                  The Messy Middle.
                </div>
                <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                  Design · AI · Craft · 2026
                </div>
              </div>
            </div>
          </div>
          <div className="j-feat__gradient"></div>
          <div className="j-feat__content">
            <div className="j-feat__kicker">
              <span className="j-feat__dot"></span>
              <span>Latest · {featured.category} · {featured.issue}</span>
            </div>
            <h2 className="j-feat__title">{featured.titleJsx ?? featured.title}</h2>
            <div className="j-feat__meta">
              <span>{featured.date}</span>
              <span className="j-feat__meta-sep">·</span>
              <span>{featured.readTime} read</span>
              <span className="j-feat__meta-sep">·</span>
              <span>Read the essay →</span>
            </div>
          </div>
        </a>

        {/* ── MORE ESSAYS ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '64px', marginBottom: '20px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.42 }}>From the archive</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.42 }}>{posts.length} published</span>
        </div>

        <div className="j-more-box" style={{ padding: '48px', background: 'var(--c-surface-soft)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.5px', marginBottom: '16px' }}>More on the way.</div>
          <p className="body-sm" style={{ opacity: 0.6, maxWidth: '440px', margin: '0 auto' }}>We publish four times a year — essays on practice, process, and the occasional opinion we&apos;re willing to defend. Subscribe below and we&apos;ll send the next one when it&apos;s ready.</p>
        </div>

        {/* ── NEWSLETTER ── */}
        <div id="newsletter" style={{ marginTop: '96px' }}>
          <div className="color-block color-block--lime">
            <span className="eyebrow cb-eyebrow">The newsletter</span>
            <h2 className="cb-title display-lg">Once a quarter. Not a minute earlier.</h2>
            <p className="body-lg cb-body">We send a short letter four times a year — one of the essays above, two or three sentences about what we&apos;re making, and the occasional book recommendation. We don&apos;t sell the list, run a tracker, or write a tenth note about Q4 trends.</p>
            <NewsletterForm />
            <p className="caption" style={{ opacity: 0.6, marginTop: '16px' }}>Four notes a year. Unsubscribe in one click.</p>
          </div>
        </div>

      </div>
    </>
  )
}
