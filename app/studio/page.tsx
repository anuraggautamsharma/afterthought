import type { Metadata } from 'next'
import { getTeam } from '@/lib/team'
import { TEAM_SEED } from '@/lib/team-seed'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Studio — Afterthought',
  description:
    'About Afterthought — a design studio led by Anurag Gautam and Tina Gidwani, based in Bangalore, working internationally across brand identity, naming, motion, and digital.',
  alternates: { canonical: '/studio/' },
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
        <h1 className="display-xl page-header__title">A partner-led design studio for companies at <em>decisive</em> moments.</h1>
        <p className="page-header__sub body-lg">Afterthought is an independent design and creative studio founded by Anurag Gautam and Tina Gidwani, based in Bangalore and working internationally. We build brand identities, naming systems, packaging and digital experiences for startups, enterprises and institutions.</p>
      </section>

      <section className="container">
        <div className="studio-intro">
          <div className="studio-intro__label">
            <span className="eyebrow">A short introduction</span>
          </div>
          <div className="studio-intro__body">
            <p>We spent our careers inside large studios and client organisations before founding our own. The lesson we kept: the best work happens when the people who win the work are the people who do the work — and it degrades every time the brief is handed down a layer.</p>
            <p>So Afterthought runs on the partner-led model. A founder leads every engagement from the first conversation to final delivery, backed by a senior team across strategy, design, motion and production. The structure is deliberate — clients deal with principals, decisions happen in the room, and nothing is lost in translation. We do most of our best thinking on the second pass, which is where the name comes from.</p>
            <p><em>Afterthought</em> — the thing you would have said, if you&apos;d had a minute more.</p>
          </div>
        </div>
      </section>

      <section id="founders" className="container section">
        <div className="section-head">
          <div className="section-head__left">
            <span className="caption">The partners</span>
            <h2 className="display-lg section-head__title">Partner-led, <em>by design</em>.</h2>
          </div>
          <div className="section-head__right">
            <p className="body-sm">We met in 2018 on a major re-brand and have worked the same projects since — client-side, studio-side, and now as partners. Afterthought exists to run engagements the way we believe serious brand work should be run: principals in the room, start to finish.</p>
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
          <p className="body-lg cb-body">Brand identity, naming, motion, packaging, digital, campaigns, and social — partner-led engagements, from strategy through implementation.</p>
          <div style={{ marginTop: '40px' }}>
            <a className="btn btn-primary" href="/services">See all services →</a>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lilac contact-block">
          <span className="eyebrow cb-eyebrow">Start a conversation</span>
          <div className="contact-block__grid">
            <div>
              <h2 className="contact-block__title">If your brand is approaching a <em>decisive</em> moment, we should talk.</h2>
              <p className="contact-block__sub body-lg">Every enquiry is read by a partner and answered within the week — with a considered view on the work, not a sales deck.</p>
              <div className="contact-block__cta">
                <a className="btn btn-primary" href="/contact">Send a brief →</a>
                <a className="btn btn-magenta" href="mailto:hello@afterthought.studio">hello@afterthought.studio</a>
              </div>
            </div>
            <div className="contact-meta">
              <div className="contact-meta__row"><span className="caption">Studio</span><a href="/contact">Indiranagar, Bangalore 560038</a></div>
              <div className="contact-meta__row"><span className="caption">Hours</span><a href="/contact">IST · We answer on a working week</a></div>
              <div className="contact-meta__row"><span className="caption">Newsletter</span><a href="/thinking">The journal · new essays weekly</a></div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
