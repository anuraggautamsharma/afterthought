import type { Metadata } from 'next'
import FreelanceForm from '@/components/FreelanceForm'
import JobCard from '@/components/JobCard'

export const metadata: Metadata = {
  title: 'Careers — Afterthought',
  description: 'Work with Afterthought — open roles and freelance collaborations at an independent design studio in Bangalore.',
}

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
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--c-hairline)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.45 }}>Open roles</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.45 }}>2 open</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <JobCard
              id="motion-designer"
              title="Motion Graphic Designer"
              type="Full-time"
              location="Bangalore · Remote considered"
              description="We're looking for a motion designer who treats animation as a language, not an afterthought. You'll work across brand films, social content, title sequences, and UI animation — often from brief to final render with full creative ownership."
              lookingFor={[
                '3+ years of professional motion design experience',
                'Strong command of After Effects; Cinema 4D or Blender a plus',
                'A reel that shows range — brand motion, not just Instagram loops',
                'Understanding of timing, easing, and motion principles at a craft level',
                'Ability to work from brand guidelines and extend them into motion systems',
                'Comfortable owning briefs end-to-end with minimal hand-holding',
              ]}
              niceToHave="Experience with expressions or scripting in After Effects, familiarity with Lottie/web animation, or a background in traditional animation or film."
            />

            <JobCard
              id="visual-designer"
              title="Visual Designer"
              type="Full-time"
              location="Bangalore · Remote considered"
              description="We need a visual designer who thinks in systems, not just screens. You'll lead brand identity work — from initial concepts to complete guidelines — for clients ranging from early-stage startups to established businesses seeking reinvention."
              lookingFor={[
                '3+ years working on brand identity or visual design projects',
                'Proficiency in Figma and the Adobe suite (Illustrator, Photoshop, InDesign)',
                'A portfolio with at least one complete brand identity case study',
                'Strong typographic sensibility and understanding of colour systems',
                'Ability to present and defend design decisions clearly to clients',
                'Detail-obsessed — you notice the kerning, always',
              ]}
              niceToHave="Experience with naming or verbal identity, motion design basics for brand handoffs, or packaging and print production knowledge."
            />
          </div>
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
