import type { Metadata } from 'next'
import FreelanceForm from '@/components/FreelanceForm'

export const metadata: Metadata = {
  title: 'Freelance & Collaborations — Afterthought',
  description: 'Work with Afterthought on a project basis. We collaborate with independent designers, writers, strategists, and makers.',
}

const lookingFor = [
  { niche: 'Brand & Visual Design', detail: 'Designers who can step into an ongoing identity project or lead execution on a defined brief. Strong craft and system thinking required.' },
  { niche: 'Motion & Animation', detail: 'Motion designers for brand films, social content, and UI animation. We work fast and expect the same — bring your own process.' },
  { niche: 'Strategy & Naming', detail: "Writers and strategists who can hold their own in a creative conversation. We don't want decks full of buzzwords — we want thinking." },
  { niche: 'Copywriting', detail: 'Brand voice, naming support, web copy, and long-form. You should care as much about the work as we do.' },
  { niche: 'Web Development', detail: 'Developers who can build what we design without needing it over-specified. We work in Next.js, Webflow, and occasionally custom stacks.' },
  { niche: 'Photography & Film', detail: 'Photographers and directors for brand campaigns, product shoots, and behind-the-scenes documentation. Based in Bangalore preferred.' },
  { niche: 'Illustration', detail: "Illustrators with a clear point of view. We're not looking for a generalist — we want someone whose style and sensibility aligns with ours." },
]

export default function FreelancePage() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <a href="/careers" style={{ opacity: 0.5, textDecoration: 'none', color: 'inherit' }}>Careers</a>
          <span style={{ opacity: 0.3, margin: '0 8px' }}>→</span>
          <span>Freelance & Collaborations</span>
        </div>
        <h1 className="display-xl page-header__title">
          You do great work. <em>So do we.</em>
        </h1>
        <p className="page-header__sub body-lg">
          We work with independent designers, writers, strategists, and makers on a project basis. No retainers, no long commitments — just good briefs done well.
        </p>
      </section>

      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>

        {/* ── HOW IT WORKS ── */}
        <div className="role-page__top">
          <div className="role-page__overview">
            <span className="role-section-label">How it works</span>
            <p className="body-lg" style={{ marginBottom: '20px', opacity: 0.8 }}>
              When a project needs something we don't have in-house — a specific skill set, a fresh perspective, or simply more hands — we bring in collaborators we trust. We don't maintain a large roster. We'd rather work with a small number of people we know well.
            </p>
            <p className="body-lg" style={{ opacity: 0.8 }}>
              The engagement model is project-based. We scope the brief, agree on deliverables and timeline, and you own your piece of it. We don't micromanage — we hire people whose work we respect and then get out of their way.
            </p>
          </div>

          <div className="role-page__sidebar">
            <div className="role-info-card">
              <div className="role-info-row">
                <span className="role-info-key">Engagement</span>
                <span className="role-info-val">Project-based</span>
              </div>
              <div className="role-info-row">
                <span className="role-info-key">Commitment</span>
                <span className="role-info-val">No retainers</span>
              </div>
              <div className="role-info-row">
                <span className="role-info-key">Location</span>
                <span className="role-info-val">Bangalore or remote</span>
              </div>
              <div className="role-info-row" style={{ borderBottom: 'none' }}>
                <span className="role-info-key">Response time</span>
                <span className="role-info-val">We read everything</span>
              </div>
              <a href="#apply" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '24px' }}>
                Tell us about your work →
              </a>
            </div>
          </div>
        </div>

        {/* ── WHAT WE LOOK FOR ── */}
        <div style={{ marginBottom: '80px' }}>
          <span className="role-section-label">What we look for</span>
          <div className="freelance-niches">
            {lookingFor.map(({ niche, detail }) => (
              <div key={niche} className="freelance-niche">
                <div className="freelance-niche__title">{niche}</div>
                <p className="freelance-niche__detail">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── APPLICATION FORM ── */}
        <div className="role-page__apply" id="apply" style={{ borderTop: '1px solid var(--c-hairline)', paddingTop: '64px' }}>
          <div className="role-apply-head">
            <span className="role-section-label">Get in touch</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontVariationSettings: '"wght" 480', fontWeight: 480, letterSpacing: '-0.8px', marginBottom: '12px' }}>
              Sounds like a fit? <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Let&apos;s talk.</em>
            </h2>
            <p className="body-md" style={{ opacity: 0.6, maxWidth: '560px' }}>
              Tell us what you do and show us your work. We keep applications on file and reach out when there's a project that fits.
            </p>
          </div>
          <FreelanceForm />
        </div>

      </div>
    </>
  )
}
