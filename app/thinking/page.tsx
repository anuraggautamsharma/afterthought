import type { Metadata } from 'next'
import NewsletterForm from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Thinking — Afterthought',
  description: 'The Afterthought journal — slow essays from the desk.',
}

const posts = [
  {
    slug: 'a-modest-argument-against-the-rebrand',
    title: 'A modest argument against the rebrand.',
    titleJsx: <>A modest argument against <em>the rebrand</em>.</>,
    category: 'Essay',
    issue: 'Issue 02',
    date: '04 / 2026',
    readTime: '11 min',
    authors: 'Anurag Gautam & Tina Gidwani',
    excerpt: 'Most brands we meet need a quieter, slower thing than the one they came in asking for. Here is the conversation we now start with — and the four signals we listen for before we agree to redraw a single line.',
    featured: true,
  },
  {
    slug: 'the-brief-is-always-wrong',
    title: 'The brief is always wrong, and that\'s the part of the job we love most.',
    category: 'Essay',
    issue: 'Issue 03',
    date: '02 / 2026',
    readTime: '9 min',
  },
  {
    slug: 'on-making-a-wordmark',
    title: 'On making a wordmark you\'ll still like in eleven years.',
    category: 'Process',
    issue: 'Issue 01',
    date: '12 / 2025',
    readTime: '6 min',
  },
  {
    slug: 'dont-design-the-menu',
    title: 'Don\'t design the menu. Design the way the menu changes.',
    category: 'Opinion',
    issue: 'Issue 01',
    date: '10 / 2025',
    readTime: '4 min',
  },
  {
    slug: 'two-founders-no-department',
    title: 'Two founders, no department: a small studio\'s first six months.',
    category: 'Studio',
    issue: 'Issue 01',
    date: '11 / 2025',
    readTime: '7 min',
  },
  {
    slug: 'an-afterthought-on-naming',
    title: 'An afterthought on naming the studio "Afterthought."',
    category: 'Studio',
    issue: 'Issue 01',
    date: '07 / 2025',
    readTime: '5 min',
  },
]

const featured = posts[0]
const rest = posts.slice(1)

export default function Thinking() {
  return (
    <>
      {/* ── PAGE HEADER ── */}
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse"></span>
          <span>The journal · Vol. 01 · Quarterly</span>
        </div>
        <h1 className="display-xl page-header__title">Notes from the desk — slow essays, the occasional <em>opinion</em>.</h1>
        <p className="page-header__sub body-lg">We write four times a year, roughly. Short essays, the odd process post, and the kind of view of the industry you&apos;d usually only hear at the end of a good kickoff.</p>
      </section>

      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        {/* ── FEATURED POST ── */}
        <a className="j-feat" href={`/thinking/${featured.slug}`}>
          <div className="j-feat__kicker">
            <span className="j-feat__kicker-dot"></span>
            <span>Latest · {featured.category} · {featured.issue}</span>
          </div>
          <h2 className="j-feat__title display-xl">{featured.titleJsx ?? featured.title}</h2>
          <div className="j-feat__foot">
            <p className="j-feat__excerpt">{featured.excerpt}</p>
            <span className="j-feat__read">Read the essay · {featured.readTime} →</span>
          </div>
        </a>

        {/* ── POST LIST ── */}
        <div className="j-list-head">
          <span className="j-list-head__label">All issues</span>
          <span className="j-list-head__label">{posts.length} published</span>
        </div>

        <ul className="j-list">
          {rest.map((post) => (
            <li key={post.slug} className="j-list__item">
              <a className="j-list__link" href={`/thinking/${post.slug}`}>
                <div>
                  <span className="j-list__kicker">{post.category} · {post.date}</span>
                  <div className="j-list__title">{post.title}</div>
                </div>
                <div className="j-list__right">
                  <span className="j-list__time">{post.readTime}</span>
                  <span className="j-list__arrow">→</span>
                </div>
              </a>
            </li>
          ))}
        </ul>

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
