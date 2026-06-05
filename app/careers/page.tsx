import type { Metadata } from 'next'
import FreelanceForm from '@/components/FreelanceForm'

export const metadata: Metadata = {
  title: 'Careers — Afterthought',
  description: 'Work with Afterthought — open roles and freelance collaborations at an independent design studio in Bangalore.',
}

const roles: { title: string; type: string; desc: string }[] = [
  // No open roles yet — add here when hiring
]

export default function Careers() {
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
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--c-hairline)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.45 }}>Open roles</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.45 }}>{roles.length} open</span>
          </div>

          {roles.length === 0 ? (
            <div style={{ padding: '56px 48px', background: 'var(--c-surface-soft)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.5px', marginBottom: '16px' }}>
                Nothing open right now.
              </div>
              <p className="body-sm" style={{ opacity: 0.6, maxWidth: '480px', margin: '0 auto' }}>
                We&apos;re a two-person studio and we&apos;re not in a rush to change that. When we do hire, we post it here first. If you want to be the first to know, subscribe to the journal below.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {roles.map(role => (
                <div key={role.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '28px 0', borderBottom: '1px solid var(--c-hairline)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontVariationSettings: '"wght" 480', fontWeight: 480, letterSpacing: '-0.3px', marginBottom: '6px' }}>{role.title}</div>
                    <p className="body-sm" style={{ opacity: 0.65, maxWidth: '560px' }}>{role.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5 }}>{role.type}</span>
                    <a className="btn btn-primary" href="/contact">Apply →</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FREELANCE ── */}
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">Freelance & collaborations</span>
          <h2 className="cb-title display-lg">You do great work. <em>So do we.</em></h2>
          <p className="body-lg cb-body">
            We work with independent designers, writers, strategists, and makers on a project basis. No retainers, no long commitments — just good briefs done well. If that sounds like your kind of engagement, tell us about your work.
          </p>
          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <FreelanceForm />
          </div>
        </div>

        {/* ── CULTURE NOTE ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '80px' }}>
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
