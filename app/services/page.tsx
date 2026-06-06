import type { Metadata } from 'next'
import { ServiceCards } from '@/components/ServiceCards'
import type { Service as ServiceCard } from '@/components/ServiceCards'
import { getServices } from '@/lib/services'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services — Afterthought',
  description: 'Brand identity, naming, motion, packaging, and digital — what Afterthought does, how it works, and what we don\'t take on.',
}

export default async function Services() {
  let services: ServiceCard[] = []
  try {
    const rows = await getServices()
    services = rows.map(s => ({
      num: s.num,
      color: s.color,
      title: s.title,
      tags: s.tags ?? [],
      description: s.description,
      deliverables: s.deliverables ?? [],
      for: s.who_for,
    }))
  } catch {
    services = []
  }

  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse"></span>
          <span>Services · What we make</span>
        </div>
        <h1 className="display-xl page-header__title">
          Seven disciplines. <em>One clear point of view.</em>
        </h1>
        <p className="page-header__sub body-lg">
          We take on roughly four engagements a year. Every project gets two founders, not a team assigned after the pitch. Below is what we do, what we deliver, and who it&apos;s for.
        </p>
      </section>

      {/* ── SERVICE DECK ── */}
      <div className="container">
        <ServiceCards services={services} />
      </div>

      {/* ── PROCESS ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">How an engagement runs</span>
          <h2 className="cb-title display-lg">Four phases, twelve to twenty weeks, one person on each side.</h2>
          <div className="phases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '48px' }}>
            {[
              { phase: '01', weeks: 'Weeks 1–3', title: 'Listen, write, set aside.', body: 'We re-write the brief in our own words and run it past you. The first useful artefact of the project.' },
              { phase: '02', weeks: 'Weeks 3–8', title: 'First round, second thought.', body: 'Two directions, made far enough to argue with. One of them, usually the calmer one, becomes the project.' },
              { phase: '03', weeks: 'Weeks 8–16', title: 'Build the actual thing.', body: 'System, type, applications, the website if there is one. Weekly working sessions, fortnightly reviews.' },
              { phase: '04', weeks: 'Weeks 16–20', title: 'Hand over, stay near.', body: 'A one-page guide, a working file, and a small retainer to keep the system honest in the first six months.' },
            ].map(p => (
              <div key={p.phase} style={{ paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.18)' }}>
                <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '16px' }}>Phase {p.phase} · {p.weeks}</span>
                <h3 style={{ fontSize: '22px', lineHeight: 1.20, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.80 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT WE DON'T DO ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="svc-limits">
          <div className="svc-limits__head">
            <span className="eyebrow">For the record</span>
            <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '24px' }}>What we don&apos;t take on.</h2>
            <p className="body-lg" style={{ opacity: 0.65, maxWidth: '520px' }}>Saying no is how we stay good at what we say yes to. Being clear about this upfront saves everyone a month.</p>
          </div>
          <div className="svc-limits__grid">
            {[
              { title: 'Logo-only briefs', body: 'We don\'t design logos in isolation. A mark without a system is a shape. We need a project, not a file.' },
              { title: 'Rush work', body: 'We don\'t do 72-hour turnarounds. Good work takes the time it takes. If you need it yesterday, we\'re not the right studio.' },
              { title: 'Pure execution', body: 'We don\'t adapt someone else\'s brand system. We\'re most useful at the start of a problem, not downstream of someone else\'s answer.' },
              { title: 'Things we don\'t believe in', body: 'If the product harms people or the founder can\'t say what it\'s for, we\'ll pass. This has happened twice. We don\'t regret it.' },
            ].map(l => (
              <div key={l.title} className="svc-limit">
                <div className="svc-limit__title">{l.title}</div>
                <p className="svc-limit__body">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--navy">
          <span className="eyebrow cb-eyebrow">Start something</span>
          <h2 className="cb-title display-lg">Have a brief? <em>We&apos;d like to read it.</em></h2>
          <p className="body-lg cb-body" style={{ opacity: 0.85 }}>Send us a few sentences about the project — what it is, what you need, and when. We reply to everything, even when the answer is not yet.</p>
          <div style={{ marginTop: '48px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a className="btn btn-secondary-dark" href="/contact">Send a brief →</a>
            <a className="btn btn-secondary-dark" href="mailto:hello@afterthought.studio">hello@afterthought.studio</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .phases-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .phases-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
