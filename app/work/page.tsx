import type { Metadata } from 'next'
import { getPublishedProjects } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Work — Afterthought',
  description: 'Selected projects by Afterthought — brand identity, naming, motion design and visual systems for founders and growing businesses.',
}

export default async function Work() {
  let projects: Awaited<ReturnType<typeof getPublishedProjects>> = []
  try {
    projects = await getPublishedProjects()
  } catch {
    projects = []
  }

  const count = projects.length.toString().padStart(3, '0')

  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>Work — {count} projects</span>
        </div>
        <h1 className="display-xl page-header__title">Selected projects. Each one we&apos;d do <em>again</em>.</h1>
        <p className="page-header__sub body-lg">Every project gets a full write-up of the brief, the thinking, and what shipped.</p>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        {projects.length > 0 ? (
          <div className="work-grid">
            {projects.map(project => (
              <a key={project.id} className="tile tile-wide" href={`/work/${project.slug}`}>
                <div
                  className="tile__visual"
                  style={
                    project.cover_image
                      ? { backgroundImage: `url(${project.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: project.hero_color }
                  }
                >
                  {!project.cover_image && (
                    <div style={{ fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 1, letterSpacing: '-3px', fontVariationSettings: "'wght' 500", fontWeight: 500, color: 'rgba(255,255,255,0.18)', padding: '0 24px', textAlign: 'center' }}>
                      {project.client}
                    </div>
                  )}
                </div>
                <div className="tile__meta">
                  <div className="tile__meta-left">
                    <span className="tile__eyebrow">{project.case_label} · {project.client} · {project.scope} · {project.year}</span>
                    <div className="tile__title">{project.summary}</div>
                  </div>
                  <div className="tile__arrow">→</div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="body-lg" style={{ opacity: 0.5 }}>Case studies coming soon.</p>
        )}
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">What&apos;s next</span>
          <h2 className="cb-title display-lg">The shelf has room for more.</h2>
          <p className="body-lg cb-body">We take on a small number of projects at a time. We&apos;re especially curious about young companies in grooming, food &amp; hospitality, B2B, and any brief whose first sentence reads like a question rather than a directive.</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/contact">Send a brief →</a>
            <a className="btn btn-on-color" style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--c-ink)' }} href="/studio">How we work →</a>
          </div>
        </div>
      </section>
    </>
  )
}
