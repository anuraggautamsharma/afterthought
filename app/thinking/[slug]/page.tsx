import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { focalToPosition } from '@/lib/posts'
import PostRenderer from '@/components/thinking/PostRenderer'
import NewsletterForm from '@/components/NewsletterForm'
import JsonLd from '@/components/JsonLd'
import TableOfContents from '@/components/thinking/TableOfContents'
import ShareButton from '@/components/thinking/ShareButton'
import PostFaq from '@/components/thinking/PostFaq'
import MermaidClient from '@/components/thinking/MermaidClient'
import { extractHeadings } from '@/lib/toc'
import { SITE_URL } from '@/lib/site'

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
    alternates: { canonical: `/thinking/${slug}/` },
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

  const url = `${SITE_URL}/thinking/${post.slug}/`
  const headings = extractHeadings(post.content)
  const image = post.og_image || post.cover_image
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    ...(image ? { image } : {}),
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': `${SITE_URL}/#organization` },
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    mainEntityOfPage: url,
    url,
    articleSection: post.category || undefined,
    ...(post.focus_keyword ? { keywords: post.focus_keyword } : {}),
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Thinking', item: `${SITE_URL}/thinking/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <article>
      <JsonLd data={[blogPosting, breadcrumb]} />

      {/* Title strip — comes first (editorial layout) */}
      <div className="container">
        <div className="post-title">
          <div className="post-title__eyebrow">
            <a href="/thinking">← Journal</a>
            <span className="post-title__sep">·</span>
            <span>{post.category}</span>
          </div>
          <h1 className="display-xl post-title__h1">{post.title}</h1>
          <div className="post-title__byline">
            <span className="post-title__meta">
              <span>{post.author}</span>
              <span className="post-title__sep">·</span>
              <span>{formatDate(post.published_at)}</span>
              <span className="post-title__sep">·</span>
              <span>{post.read_time} min read</span>
            </span>
            <ShareButton url={url} title={post.title} />
          </div>
        </div>
      </div>

      {/* Contained cover image — focal point controls the crop */}
      {post.cover_image && (
        <div className="container">
          <div className="post-cover">
            <div className="post-cover__frame">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 720px"
                style={{ objectFit: 'cover', objectPosition: focalToPosition(post.cover_focal) }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Body — with table of contents on longer posts */}
      {headings.length >= 3 ? (
        <div className="post-main post-main--toc">
          <TableOfContents headings={headings} />
          <PostRenderer content={post.content} bare />
        </div>
      ) : (
        <PostRenderer content={post.content} />
      )}

      {/* Renders any mermaid code blocks in the body into SVG diagrams. */}
      <MermaidClient />

      {/* FAQ — only renders when the post has questions */}
      <PostFaq faqs={post.faqs ?? []} />

      {/* Subscribe */}
      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">The newsletter</span>
          <h2 className="cb-title display-lg">One short letter. Only the good stuff.</h2>
          <p className="body-lg cb-body">We send a short letter with the strongest of what we publish — an essay or two, a few sentences about what we&apos;re making, and the occasional book recommendation.</p>
          <NewsletterForm />
          <p className="caption" style={{ opacity: 0.6, marginTop: '16px' }}>No noise. Unsubscribe in one click.</p>
        </div>
      </section>
    </article>
  )
}
