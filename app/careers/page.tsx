import type { Metadata } from 'next'
import JobCard from '@/components/JobCard'
import { getOpenJobs } from '@/lib/jobs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Careers — Afterthought',
  description: 'Work with Afterthought — open roles and freelance collaborations at an independent design studio in Bangalore.',
}

export default async function Careers() {
  let jobs: Awaited<ReturnType<typeof getOpenJobs>> = []
  try {
    jobs = await getOpenJobs()
  } catch {
    jobs = []
  }

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse"></span>
          <span>Careers · Collaborations</span>
        </div>
        <h1 className="display-xl page-header__title">
          We&apos;re small on purpose. <em>Grow with us.</em>
        </h1>
        <p className="page-header__sub body-lg">
          Afterthought is two people and a clear point of view. When we bring someone in — full-time or project-based — it&apos;s because the work demands it and the fit is real.
        </p>
      </section>

      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        {/* ── OPEN ROLES ── */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--c-hairline)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.45 }}>Open roles</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.45 }}>{jobs.length} open</span>
          </div>

          {jobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <p className="body-lg" style={{ opacity: 0.55 }}>
              No open roles right now — but we&apos;re always glad to hear from people we should know. Say hello through the freelance &amp; collaborations route below.
            </p>
          )}
        </div>

        {/* ── FREELANCE ── */}
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">Freelance & collaborations</span>
          <h2 className="cb-title display-lg">You do great work. <em>So do we.</em></h2>
          <p className="body-lg cb-body">
            We work with independent designers, writers, strategists, and makers on a project basis. No retainers, no long commitments — just good briefs done well.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/careers/freelance">See how to work with us →</a>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.5px', opacity: 0.55 }}>Brand design · Motion · Strategy · Copy · Dev · Photography</span>
          </div>
        </div>

        {/* ── CULTURE NOTE ── */}
        <div className="principles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '80px' }}>
          {[
            { num: '01', title: 'Craft first.', body: 'We care about the work above everything else. Every detail is worth getting right.' },
            { num: '02', title: 'No bullshit.', body: 'Straight feedback, honest timelines, and real conversations. We don\'t do agency theatre.' },
            { num: '03', title: 'Small is intentional.', body: 'We choose quality over volume. The studio stays small so the work stays sharp.' },
          ].map(({ num, title, body }) => (
            <div key={num} className="principle">
              <span className="principle__num">{num}</span>
              <div className="principle__title">{title}</div>
              <p className="principle__body">{body}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
