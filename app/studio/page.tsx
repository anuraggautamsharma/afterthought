import type { Metadata } from 'next'
import { getTeam } from '@/lib/team'
import { TEAM_SEED } from '@/lib/team-seed'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Studio — Afterthought',
  description:
    'About Afterthought — a two-founder design studio by Anurag Gautam and Tina Gidwani, based in Bangalore, working internationally.',
}

export default async function Studio() {
  let team: Awaited<ReturnType<typeof getTeam>> = []
  try {
    team = await getTeam()
  } catch {
    team = []
  }

  // Fall back to the seed copy so the page never looks empty before import.
  const founders = team.length ? team : TEAM_SEED

  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>The studio · Bangalore — Working internationally</span>
        </div>
        <h1 className="display-xl page-header__title">A small studio, two stubborn opinions, and a long list of things we won&apos;t <em>quite</em> do.</h1>
        <p className="page-header__sub body-lg">Afterthought is a design and creative studio founded in 2025 by Anurag Gautam and Tina Gidwani. We work on brand identity, naming, packaging and digital — with founders, institutions and the occasional well-meaning monopoly.</p>
      </section>

      <section className="container">
        <div className="studio-intro">
          <div className="studio-intro__label">
            <span className="eyebrow">A short introduction</span>
          </div>
          <div className="studio-intro__body">
            <p>We are two designers who have spent the last decade in other people&apos;s studios. Most of what we learned there was useful. Some of it was that the best work tends to happen when the two people in the room are the two people doing it, and that the worst work happens when there are too many people in the room.</p>
            <p>So we made a small studio. Two founders, a roster of trusted collaborators, and roughly four engagements a year. We work across two cities because that is where we live; we work in two languages because that is who we are; and we do most of our best thinking on the second pass, which is where the name comes from.</p>
            <p><em>Afterthought</em> — the thing you would have said, if you&apos;d had a minute more.</p>
          </div>
        </div>
      </section>

      <section id="founders" className="container section">
        <div className="section-head">
          <div className="section-head__left">
            <span className="caption">The founders</span>
            <h2 className="display-lg section-head__title">Two of us. We answer the email ourselves.</h2>
          </div>
          <div className="section-head__right">
            <p className="body-sm">We met in 2018 on a re-brand neither of us were quite leading. We&apos;ve worked on most of the same projects since. Afterthought is the first thing we&apos;ve started together.</p>
          </div>
        </div>

        <div className="founders-grid">
          {founders.map((f, idx) => (
            <article className="founder" key={f.name ?? idx}>
              <div
                className="founder__portrait"
                style={
                  f.photo
                    ? { backgroundImage: `url(${f.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: f.accent_color }
                }
              >
                {!f.photo && <div className="founder__initials">{f.initials}</div>}
              </div>
              <span className="founder__role">{f.role}</span>
              <h3 className="founder__name">{f.name}</h3>
              {(f.bio ?? '').split('\n\n').map((para, i) => (
                <p key={i} className="founder__bio">{para}</p>
              ))}
              <div className="founder__links">
                {f.email && <a href={`mailto:${f.email}`}>{f.email}</a>}
                {f.arena_url && <a href={f.arena_url} target="_blank" rel="noopener noreferrer">Are.na ↗</a>}
                {f.linkedin_url && <a href={f.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div className="section-head__left">
            <span className="caption">How we work</span>
            <h2 className="display-lg section-head__title">A short, useful theory of the work.</h2>
          </div>
          <div className="section-head__right">
            <p className="body-sm">A four-part manifesto we re-read most Mondays. The four lines below have so far survived.</p>
          </div>
        </div>
        <div className="manifesto-grid">
          <article className="principle">
            <span className="principle__num">Principle 01</span>
            <h3 className="principle__title">Start with the second thought.</h3>
            <p className="principle__body">The obvious answer is the one everyone else already has. Our job begins after that one is on the table and politely set aside.</p>
          </article>
          <article className="principle">
            <span className="principle__num">Principle 02</span>
            <h3 className="principle__title">Make it before you describe it.</h3>
            <p className="principle__body">A deck slide and a designed object both take about an afternoon. One of them is more honest about whether the idea is any good.</p>
          </article>
          <article className="principle">
            <span className="principle__num">Principle 03</span>
            <h3 className="principle__title">The brief is a draft.</h3>
            <p className="principle__body">Every brief we&apos;ve ever received has been wrong about something — almost never on purpose. The first month is for finding the one true sentence underneath.</p>
          </article>
          <article className="principle">
            <span className="principle__num">Principle 04</span>
            <h3 className="principle__title">Leave it better than the launch.</h3>
            <p className="principle__body">Identities atrophy without care. We build systems our clients can operate themselves, and stay near the phone when they decide to grow them.</p>
          </article>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">What we make</span>
          <h2 className="cb-title display-lg">Seven disciplines. <em>One clear point of view.</em></h2>
          <p className="body-lg cb-body">Brand identity, naming, motion, packaging, digital, campaigns, and social — all of it done with two founders, not handed off after the pitch.</p>
          <div style={{ marginTop: '40px' }}>
            <a className="btn btn-primary" href="/services">See all services →</a>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lilac contact-block">
          <span className="eyebrow cb-eyebrow">Tell us a thing</span>
          <div className="contact-block__grid">
            <div>
              <h2 className="contact-block__title">If this sounds like a studio you&apos;d want on the <em>third</em> draft, write to us.</h2>
              <p className="contact-block__sub body-lg">We answer every email ourselves. A short, honest reply within a week — even when the answer is &quot;not us, but try them.&quot;</p>
              <div className="contact-block__cta">
                <a className="btn btn-primary" href="/contact">Send a brief →</a>
                <a className="btn btn-magenta" href="mailto:hello@afterthought.studio">hello@afterthought.studio</a>
              </div>
            </div>
            <div className="contact-meta">
              <div className="contact-meta__row"><span className="caption">Studio</span><a href="/contact">Indiranagar, Bangalore 560038</a></div>
              <div className="contact-meta__row"><span className="caption">Hours</span><a href="/contact">IST · We answer on a working week</a></div>
              <div className="contact-meta__row"><span className="caption">Newsletter</span><a href="/thinking">Quarterly · 4 a year</a></div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
