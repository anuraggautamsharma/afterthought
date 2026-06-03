import type { Metadata } from 'next'
import NewsletterForm from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Thinking — Afterthought',
  description: 'The Afterthought journal — essays, process notes and opinions from the studio.',
}

/* ── Per-post thumbnail visuals (placeholders until CMS images) ── */
function CardImage({ slug, bg, textColor = 'var(--c-ink)' }: { slug: string; bg: string; textColor?: string }) {
  const style: React.CSSProperties = { background: bg, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }
  switch (slug) {
    case 'a-modest-argument-against-the-rebrand':
      return <div style={style}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(22px, 3.5vw, 42px)', lineHeight: 1.1, letterSpacing: '-1px', color: 'rgba(255,255,255,0.9)' }}>
            Are you sure you<br />want a <span style={{ textDecoration: 'line-through', textDecorationColor: '#E8825A', textDecorationThickness: '3px' }}>rebrand</span>?
          </div>
        </div>
      </div>
    case 'the-brief-is-always-wrong':
      return <div style={style}>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(56px, 9vw, 100px)', lineHeight: 0.9, letterSpacing: '-3px', color: textColor, opacity: 0.85 }}>The<br />Brief.</div>
      </div>
    case 'on-making-a-wordmark':
      return <div style={style}>
        <div style={{ fontSize: 'clamp(64px, 10vw, 120px)', lineHeight: 0.9, letterSpacing: '-5px', fontVariationSettings: "'wght' 540", fontWeight: 540, color: textColor }}>Heli<span style={{ display: 'inline-block', transform: 'translateY(2px)', color: 'var(--c-block-coral)' }}>o</span></div>
      </div>
    case 'dont-design-the-menu':
      return <div style={style}>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.92, letterSpacing: '-2px', color: textColor }}>Querida</div>
      </div>
    case 'two-founders-no-department':
      return <div style={style}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5, color: textColor, marginBottom: '12px' }}>Studio</div>
          <div style={{ fontSize: 'clamp(56px, 9vw, 112px)', lineHeight: 0.9, letterSpacing: '-4px', fontVariationSettings: "'wght' 540", fontWeight: 540, color: textColor }}>002</div>
        </div>
      </div>
    case 'an-afterthought-on-naming':
      return <div style={style}>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.92, letterSpacing: '-2px', color: 'rgba(255,255,255,0.88)', textAlign: 'center' }}>After-<br />thought.</div>
      </div>
    default:
      return <div style={style} />
  }
}

const posts = [
  {
    slug: 'a-modest-argument-against-the-rebrand',
    title: 'A modest argument against the rebrand.',
    titleJsx: <>A modest argument against <em>the rebrand</em>.</>,
    category: 'Essay',
    issue: 'Issue 02',
    date: 'Apr 2026',
    readTime: '11 min',
    bg: 'var(--c-block-navy)',
    textColor: 'rgba(255,255,255,0.9)',
    excerpt: 'Most brands we meet need a quieter, slower thing than the one they came in asking for. Here is the conversation we now start with.',
    featured: true,
  },
  {
    slug: 'the-brief-is-always-wrong',
    title: 'The brief is always wrong, and that\'s the part of the job we love most.',
    category: 'Essay',
    issue: 'Issue 03',
    date: 'Feb 2026',
    readTime: '9 min',
    bg: 'var(--c-block-coral)',
  },
  {
    slug: 'on-making-a-wordmark',
    title: 'On making a wordmark you\'ll still like in eleven years.',
    category: 'Process',
    issue: 'Issue 01',
    date: 'Dec 2025',
    readTime: '6 min',
    bg: 'var(--c-block-lime)',
  },
  {
    slug: 'dont-design-the-menu',
    title: 'Don\'t design the menu. Design the way the menu changes.',
    category: 'Opinion',
    issue: 'Issue 01',
    date: 'Oct 2025',
    readTime: '4 min',
    bg: 'var(--c-block-cream)',
  },
  {
    slug: 'two-founders-no-department',
    title: 'Two founders, no department: a small studio\'s first six months.',
    category: 'Studio',
    issue: 'Issue 01',
    date: 'Nov 2025',
    readTime: '7 min',
    bg: 'var(--c-block-lilac)',
  },
  {
    slug: 'an-afterthought-on-naming',
    title: 'An afterthought on naming the studio "Afterthought."',
    category: 'Studio',
    issue: 'Issue 01',
    date: 'Jul 2025',
    readTime: '5 min',
    bg: 'var(--c-ink)',
  },
]

const featured = posts[0]
const grid = posts.slice(1)

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
            <CardImage slug={featured.slug} bg={featured.bg} textColor={featured.textColor} />
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

        {/* ── ARTICLE GRID ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '64px', marginBottom: '20px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.42 }}>From the archive</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.42 }}>{posts.length} published</span>
        </div>

        <div className="j-grid">
          {grid.map(post => (
            <a key={post.slug} className="j-card" href={`/thinking/${post.slug}`}>
              <div className="j-card__img" style={{ background: post.bg, position: 'relative' }}>
                <CardImage slug={post.slug} bg={post.bg} />
              </div>
              <div className="j-card__body">
                <span className="j-card__kicker">{post.category} · {post.date}</span>
                <div className="j-card__title">{post.title}</div>
                <div className="j-card__foot">
                  <span className="j-card__time">{post.readTime} read</span>
                  <span className="j-card__arrow">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ── NEWSLETTER ── */}
        <div id="newsletter" style={{ marginTop: '96px' }}>
          <div className="color-block color-block--lime">
            <span className="eyebrow cb-eyebrow">The newsletter</span>
            <h2 className="cb-title display-lg">Once a quarter. Not a minute earlier.</h2>
            <p className="body-lg cb-body">We send a short letter four times a year — one of the essays above, two or three sentences about what we&apos;re making, and the occasional book recommendation. We don&apos;t sell the list, run a tracker, or write a tenth note about Q4 trends.</p>
            <NewsletterForm />
            <p className="caption" style={{ opacity: 0.6, marginTop: '16px' }}>Four notes a year. Unsubscribe in one click. Currently 217 readers.</p>
          </div>
        </div>

      </div>
    </>
  )
}
