import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Afterthought',
  description: 'Start a project with Afterthought. We read every note ourselves.',
}

export default function Contact() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse" style={{ background: 'var(--c-semantic-success)', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
          <span>Currently reading briefs for Summer 2026</span>
        </div>
        <h1 className="display-xl page-header__title">Tell us the thing you keep <em>almost</em> saying out loud.</h1>
        <p className="page-header__sub body-lg">We read every note ourselves and reply within a week — sometimes with a meeting, sometimes with a short, honest &quot;not us, but try them.&quot; Either way, you&apos;ll hear from one of us, not a form-letter.</p>
      </section>

      <section id="start" className="container">
        <div className="contact-grid">
          <ContactForm />

          <aside className="contact-side">
            <h3>Or, more directly.</h3>
            <div className="contact-meta">
              <div className="contact-meta__row"><span className="caption">New work</span><a href="mailto:hello@afterthought.studio">hello@afterthought.studio</a></div>
              <div className="contact-meta__row"><span className="caption">Press</span><a href="mailto:press@afterthought.studio">press@afterthought.studio</a></div>
              <div className="contact-meta__row"><span className="caption">Anurag</span><a href="mailto:anurag@afterthought.studio">anurag@afterthought.studio</a></div>
              <div className="contact-meta__row"><span className="caption">Tina</span><a href="mailto:tina@afterthought.studio">tina@afterthought.studio</a></div>
            </div>

            <div className="contact-side__cities">
              <div className="city-card">
                <div className="city-card__name">Studio</div>
                <div className="city-card__addr">100 Feet Road<br />Indiranagar, Bangalore 560038<br />India</div>
                <div className="city-card__time">UTC +5:30 · By appointment</div>
              </div>
              <div className="city-card">
                <div className="city-card__name">Working</div>
                <div className="city-card__addr">Internationally — currently with clients in India, Europe and the US. Most meetings on a call.</div>
                <div className="city-card__time">Travelling 2–3× a project</div>
              </div>
            </div>

            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--c-surface-soft)', borderRadius: 'var(--r-lg)' }}>
              <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '10px' }}>A small note on fit</span>
              <p className="body-sm" style={{ lineHeight: 1.55 }}>We take on roughly four engagements a year. If we can&apos;t say yes — usually because the calendar is full or the brief is better served by friends of ours — we&apos;ll tell you within the week, and almost always send you a name or two.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">FAQ — the four we get most</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px', marginTop: '32px' }} className="faq-grid">
            <div>
              <h3 style={{ fontSize: '22px', lineHeight: 1.25, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '10px' }}>Are you taking on new work?</h3>
              <p className="body-sm" style={{ opacity: 0.8 }}>Yes — we&apos;re currently reading briefs for Summer 2026. We have room for roughly two more projects this year.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '22px', lineHeight: 1.25, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '10px' }}>Do you work outside India?</h3>
              <p className="body-sm" style={{ opacity: 0.8 }}>Often — and increasingly. Roughly half our work to date has been for clients in another country. Most kickoffs happen on a call, with two or three working visits a project.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '22px', lineHeight: 1.25, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '10px' }}>What&apos;s a typical engagement worth?</h3>
              <p className="body-sm" style={{ opacity: 0.8 }}>A full identity sits between ₹40L–1Cr (about $50–125k). Smaller pieces — naming, a single deliverable, a campaign — start lower. We share a clear estimate after the first call.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '22px', lineHeight: 1.25, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '10px' }}>Will we be working with you, or a team?</h3>
              <p className="body-sm" style={{ opacity: 0.8 }}>Us. Always. We bring in collaborators for motion, illustration or production at scale, and tell you who they are at the kickoff.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) { .faq-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
