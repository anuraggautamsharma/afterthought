import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import PostRenderer from '@/components/thinking/PostRenderer'
import NewsletterForm from '@/components/NewsletterForm'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Not found — Afterthought' }

  const title       = post.meta_title       || post.title
  const description = post.meta_description || post.excerpt
  const image       = post.og_image         || post.cover_image

  return {
    title: `${title} — Afterthought`,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      images: image ? [{ url: image }] : undefined,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      images: image ? [image] : undefined,
    },
  }
}

function formatDate(str: string | null) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.status !== 'published') notFound()

  return (
    <article>
      {/* Hero */}
      {post.cover_image ? (
        <div className="post-hero-full" style={{ backgroundImage: `url(${post.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      ) : (
        <div className="post-hero-full" style={{ background: 'var(--c-block-navy)' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 1.0, letterSpacing: '-3px', color: 'rgba(255,255,255,0.92)' }}>
                {post.title}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title strip */}
      <div className="container">
        <div className="post-title">
          <div className="post-title__eyebrow">
            <a href="/thinking">← Journal</a>
            <span className="post-title__sep">·</span>
            <span>{post.category}</span>
          </div>
          <h1 className="display-xl post-title__h1">{post.title}</h1>
          <div className="post-title__byline">
            <span>{post.author}</span>
            <span className="post-title__sep">·</span>
            <span>{formatDate(post.published_at)}</span>
            <span className="post-title__sep">·</span>
            <span>{post.read_time} min read</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <PostRenderer content={post.content} />

      {/* Subscribe */}
      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">The newsletter</span>
          <h2 className="cb-title display-lg">Once a quarter. Not a minute earlier.</h2>
          <p className="body-lg cb-body">We send a short letter four times a year — one of the essays above, two or three sentences about what we&apos;re making, and the occasional book recommendation.</p>
          <NewsletterForm />
          <p className="caption" style={{ opacity: 0.6, marginTop: '16px' }}>Four notes a year. Unsubscribe in one click.</p>
        </div>
      </section>
    </article>
  )
}
