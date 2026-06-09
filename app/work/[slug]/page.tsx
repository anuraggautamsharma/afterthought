import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, stripEmphasis } from '@/lib/projects'
import PostRenderer from '@/components/thinking/PostRenderer'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Not found — Afterthought' }

  const title = project.meta_title || stripEmphasis(project.title)
  const description = project.meta_description || project.summary
  const image = project.og_image || project.cover_image

  return {
    title: `${title} — Afterthought`,
    description,
    alternates: { canonical: `/work/${slug}/` },
    openGraph: {
      title,
      description: description ?? undefined,
      images: image ? [{ url: image }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      images: image ? [image] : undefined,
    },
  }
}

/** Render a title with *emphasis* markers into JSX with <em>. */
function renderTitle(title: string) {
  return title.split('*').map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || project.status !== 'published') notFound()

  const url = `${SITE_URL}/work/${project.slug}/`
  const image = project.og_image || project.cover_image
  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: stripEmphasis(project.title),
    description: project.meta_description || project.summary || undefined,
    ...(image ? { image } : {}),
    url,
    creator: { '@id': `${SITE_URL}/#organization` },
    ...(project.year ? { dateCreated: project.year } : {}),
    about: project.scope || undefined,
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/work/` },
      { '@type': 'ListItem', position: 3, name: stripEmphasis(project.title), item: url },
    ],
  }

  return (
    <>
      <JsonLd data={[creativeWork, breadcrumb]} />
      {/* ── HERO ── */}
      <div className="cs-hero">
        <div
          className="cs-hero__image"
          style={
            project.cover_image
              ? { backgroundImage: `url(${project.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: project.hero_color }
          }
        >
          {!project.cover_image && (
            <div style={{ fontSize: 'clamp(64px, 12vw, 180px)', lineHeight: 1, letterSpacing: '-5px', fontVariationSettings: "'wght' 500", fontWeight: 500, color: 'rgba(255,255,255,0.16)', textAlign: 'center', padding: '0 24px' }}>
              {project.client}
            </div>
          )}
        </div>
        <div className="cs-hero__gradient" />
        <div className="cs-hero__info">
          <div className="container">
            <div className="cs-hero__eyebrow">
              <a href="/work">← Work</a>
              <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
              <span>{project.case_label}</span>
            </div>
            <h1 className="display-xl cs-hero__title">{renderTitle(project.title)}</h1>
          </div>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="cs-meta container">
        <div className="cs-meta__item">
          <span className="cs-meta__label">Client</span>
          <span className="cs-meta__val">{project.client}</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Scope</span>
          <span className="cs-meta__val">{project.scope}</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">Year</span>
          <span className="cs-meta__val">{project.year}</span>
        </div>
        <div className="cs-meta__item">
          <span className="cs-meta__label">{project.credit_label}</span>
          <span className="cs-meta__val">{project.credit_value}</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <PostRenderer content={project.content} />

      {/* ── CTA ── */}
      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">Have a project?</span>
          <h2 className="cb-title display-lg">The shelf has room for one more.</h2>
          <p className="body-lg cb-body">We take on a small number of projects at a time. If you have a naming challenge, an identity that needs rethinking, or a brand to build from scratch — we&apos;d like to hear from you.</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/contact">Send a brief →</a>
            <a className="btn btn-on-color" style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--c-ink)' }} href="/work">See all work →</a>
          </div>
        </div>
      </section>
    </>
  )
}
