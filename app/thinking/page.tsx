import type { Metadata } from 'next'
import { getPublishedPostsIndex, focalToPosition } from '@/lib/posts'
import NewsletterForm from '@/components/NewsletterForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PER_PAGE = 12

export const metadata: Metadata = {
  title: 'Thinking — Afterthought',
  description: 'The Afterthought journal — essays on design, craft, and practice from the studio.',
  alternates: { canonical: '/thinking/' },
}

function formatDate(str: string | null) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export default async function Thinking({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const { posts, total } = await getPublishedPostsIndex(page, PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  // The first post on page 1 is the big featured card; everything else is a row.
  const featured = page === 1 ? posts[0] ?? null : null
  const rest = page === 1 ? posts.slice(1) : posts

  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse"></span>
          <span>The journal · Vol. 01 · New essays weekly</span>
        </div>
        <h1 className="display-xl page-header__title">Essays, process notes and the occasional <em>strong opinion</em>.</h1>
        <p className="page-header__sub body-lg">We write when something is worth saying — essays on practice, notes on process, and opinions we&apos;re willing to put our name on. New pieces every week.</p>
      </section>

      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        {featured ? (
          <Link className="j-feat" href={`/thinking/${featured.slug}`}>
            {featured.cover_image ? (
              <div
                className="j-feat__img"
                style={{
                  backgroundImage: `url(${featured.cover_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: focalToPosition(featured.cover_focal),
                }}
              />
            ) : (
              <div className="j-feat__img" style={{ background: 'var(--c-block-navy)' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.06, letterSpacing: '-2px', color: 'rgba(255,255,255,0.92)', maxWidth: '700px' }}>
                      {featured.title}
                    </div>
                    <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                      {featured.category} · {formatDate(featured.published_at)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="j-feat__gradient" />
            <div className="j-feat__content">
              <div className="j-feat__kicker">
                <span className="j-feat__dot" />
                <span>Latest · {featured.category}</span>
              </div>
              <h2 className="j-feat__title">{featured.title}</h2>
              <div className="j-feat__meta">
                <span>{formatDate(featured.published_at)}</span>
                <span className="j-feat__meta-sep">·</span>
                <span>{featured.read_time} min read</span>
                <span className="j-feat__meta-sep">·</span>
                <span>Read the essay →</span>
              </div>
            </div>
          </Link>
        ) : page === 1 ? (
          <div className="j-more-box" style={{ padding: '48px', background: 'var(--c-surface-soft)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.5px', marginBottom: '16px' }}>First essay coming soon.</div>
            <p className="body-sm" style={{ opacity: 0.6, maxWidth: '440px', margin: '0 auto' }}>New essays land every week — subscribe below and we&apos;ll send the first one when it&apos;s ready.</p>
          </div>
        ) : null}

        {rest.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '64px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.42 }}>{page > 1 ? `Page ${page}` : 'From the archive'}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.42 }}>{total} {total === 1 ? 'essay' : 'essays'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {rest.map(post => (
                <Link key={post.id} href={`/thinking/${post.slug}`} className="j-list__item"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '18px 0', borderTop: '1px solid var(--c-hairline)', textDecoration: 'none', color: 'inherit' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 }}>
                    <span
                      aria-hidden
                      style={{
                        width: '76px', height: '50px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden',
                        background: 'var(--c-block-navy)',
                        ...(post.cover_image
                          ? { backgroundImage: `url(${post.cover_image})`, backgroundSize: 'cover', backgroundPosition: focalToPosition(post.cover_focal) }
                          : {}),
                      }}
                    />
                    <span style={{ fontSize: '18px', fontVariationSettings: "'wght' 460", fontWeight: 460, letterSpacing: '-0.2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', opacity: 0.4, flexShrink: 0 }}>{formatDate(post.published_at)}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--c-hairline)' }}>
            {page > 1 ? (
              <Link href={page - 1 === 1 ? '/thinking' : `/thinking?page=${page - 1}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', textDecoration: 'none', color: 'inherit' }}>← Newer</Link>
            ) : <span />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', opacity: 0.42 }}>{page} / {totalPages}</span>
            {page < totalPages ? (
              <Link href={`/thinking?page=${page + 1}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', textDecoration: 'none', color: 'inherit' }}>Older →</Link>
            ) : <span />}
          </div>
        )}

        {total === 0 && page === 1 && (
          <div className="j-more-box" style={{ padding: '48px', background: 'var(--c-surface-soft)', borderRadius: 'var(--r-lg)', textAlign: 'center', marginTop: '48px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.5px', marginBottom: '16px' }}>More on the way.</div>
            <p className="body-sm" style={{ opacity: 0.6, maxWidth: '440px', margin: '0 auto' }}>We publish every week — essays on practice, process, and the occasional opinion we&apos;re willing to defend. Subscribe below and we&apos;ll send the next one when it&apos;s ready.</p>
          </div>
        )}

        <div id="newsletter" style={{ marginTop: '96px' }}>
          <div className="color-block color-block--lime">
            <span className="eyebrow cb-eyebrow">The newsletter</span>
            <h2 className="cb-title display-lg">One short letter. Only the good stuff.</h2>
            <p className="body-lg cb-body">We send a short letter with the strongest of what we publish — an essay or two, a few sentences about what we&apos;re making, and the occasional book recommendation. We don&apos;t sell the list, run a tracker, or write a tenth note about Q4 trends.</p>
            <NewsletterForm />
            <p className="caption" style={{ opacity: 0.6, marginTop: '16px' }}>No noise. Unsubscribe in one click.</p>
          </div>
        </div>
      </div>
    </>
  )
}
