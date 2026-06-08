import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJobBySlug } from '@/lib/jobs'
import RoleApplyForm from '@/components/RoleApplyForm'
import EmbeddedForm from '@/components/forms/EmbeddedForm'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const role = await getJobBySlug(slug)
  if (!role) return {}
  return {
    title: `${role.title} — Careers at Afterthought`,
    description: role.summary,
  }
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const role = await getJobBySlug(slug)
  if (!role || role.status !== 'open') notFound()

  return (
    <>
      {/* ── ROLE HEADER ── */}
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <a href="/careers" style={{ opacity: 0.5, textDecoration: 'none', color: 'inherit' }}>Careers</a>
          <span style={{ opacity: 0.3, margin: '0 8px' }}>→</span>
          <span>{role.title}</span>
        </div>
        <h1 className="display-xl page-header__title">{role.title}</h1>
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <span className="job-card__tag">{role.type}</span>
          <span className="job-card__tag">{role.location}</span>
        </div>
      </section>

      <div className="container role-page">

        {/* ── OVERVIEW + WHAT YOU'LL DO ── */}
        <div className="role-page__top">
          <div className="role-page__overview">
            <span className="role-section-label">Overview</span>
            {role.description.split('\n\n').map((para, i) => (
              <p key={i} className="body-lg" style={{ marginBottom: '20px', opacity: 0.8 }}>{para}</p>
            ))}
          </div>

          <div className="role-page__sidebar">
            <div className="role-info-card">
              <div className="role-info-row">
                <span className="role-info-key">Role</span>
                <span className="role-info-val">{role.title}</span>
              </div>
              <div className="role-info-row">
                <span className="role-info-key">Type</span>
                <span className="role-info-val">{role.type}</span>
              </div>
              <div className="role-info-row">
                <span className="role-info-key">Location</span>
                <span className="role-info-val">{role.location}</span>
              </div>
              <div className="role-info-row" style={{ borderBottom: 'none' }}>
                <span className="role-info-key">Studio</span>
                <span className="role-info-val">Afterthought, Bangalore</span>
              </div>
              <a href="#apply" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '24px' }}>
                Apply for this role →
              </a>
            </div>
          </div>
        </div>

        {/* ── WHAT YOU'LL DO ── */}
        <div className="role-page__section">
          <span className="role-section-label">What you&apos;ll do</span>
          <ul className="role-list">
            {role.what_youll_do.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* ── REQUIREMENTS ── */}
        <div className="role-page__cols">
          <div>
            <span className="role-section-label">What we&apos;re looking for</span>
            <ul className="role-list">
              {role.looking_for.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div>
            <span className="role-section-label">Nice to have</span>
            <p className="body-md" style={{ opacity: 0.7, lineHeight: 1.7 }}>{role.nice_to_have}</p>

            <span className="role-section-label" style={{ marginTop: '40px' }}>Why Afterthought</span>
            <p className="body-md" style={{ opacity: 0.7, lineHeight: 1.7 }}>{role.why_afterthought}</p>
          </div>
        </div>

        {/* ── APPLICATION FORM ── */}
        <div className="role-page__apply" id="apply">
          <div className="role-apply-head">
            <span className="role-section-label">Apply</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontVariationSettings: '"wght" 480', fontWeight: 480, letterSpacing: '-0.8px', marginBottom: '12px' }}>
              Sounds like you? <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Let&apos;s talk.</em>
            </h2>
            <p className="body-md" style={{ opacity: 0.6, maxWidth: '560px' }}>
              No cover letter needed — just fill this in honestly. We care more about how you think than how you write about yourself.
            </p>
          </div>
          {role.application_form_id ? (
            <div style={{ maxWidth: '640px' }}>
              <EmbeddedForm formId={role.application_form_id} hideHeader jobId={role.id} />
            </div>
          ) : (
            <RoleApplyForm id={role.slug} />
          )}
        </div>

      </div>
    </>
  )
}
