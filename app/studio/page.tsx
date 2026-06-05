import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio — Afterthought',
  description:
    'About Afterthought — a two-founder design studio by Anurag Gautam and Tina Gidwani, based in Bangalore, working internationally.',
}

export default function Studio() {
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
          <article className="founder">
            <div className="founder__portrait founder__portrait--anurag">
              <div className="founder__initials">AG</div>
            </div>
            <span className="founder__role">Co-founder · Design lead</span>
            <h3 className="founder__name">Anurag Gautam</h3>
            <p className="founder__bio">Anurag leads the visual side of the studio — identity, type, packaging, the way a system holds up six months after it ships. Before Afterthought, he was a senior designer at studios in London and Bangalore, working on identities for hospitality groups, museums and one well-known airline he is too polite to name.</p>
            <p className="founder__bio">He draws better than he writes and, to his own surprise, has begun to enjoy writing about why.</p>
            <div className="founder__links">
              <a href="mailto:anurag@afterthought.studio">anurag@afterthought.studio</a>
              <a href="#">Are.na ↗</a>
              <a href="#">LinkedIn ↗</a>
            </div>
          </article>

          <article className="founder">
            <div className="founder__portrait founder__portrait--tina">
              <div className="founder__initials">TG</div>
            </div>
            <span className="founder__role">Co-founder · Strategy &amp; words</span>
            <h3 className="founder__name">Tina Gidwani</h3>
            <p className="founder__bio">Tina runs strategy and verbal identity — the brief, the name, and the sentence we keep coming back to. She spent six years at a larger studio in New York leading naming and positioning for early-stage companies in climate, health and finance, then a year at a publishing house re-thinking the tone of voice of a 70-year-old magazine.</p>
            <p className="founder__bio">She is the studio&apos;s first reader, the studio&apos;s last editor, and the reason we don&apos;t ship the first round.</p>
            <div className="founder__links">
              <a href="mailto:tina@afterthought.studio">tina@afterthought.studio</a>
              <a href="#">Are.na ↗</a>
              <a href="#">LinkedIn ↗</a>
            </div>
          </article>
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

      <section id="capabilities" className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">What we make</span>
          <div className="capabilities">
            <div className="capabilities__intro">
              <h2 className="cb-title">Six disciplines, two people, and a small circle of trusted collaborators.</h2>
              <p className="body-lg" style={{ maxWidth: '460px' }}>We take on roughly four engagements a year. For projects that need motion, illustration, photography or production at scale, we bring in a small group of people we&apos;ve worked with before. We tell you who they are at the kickoff.</p>
            </div>
            <ul className="cap-list">
              <li className="cap-list__item"><span className="cap-list__num">01</span><span className="cap-list__name">Brand identity &amp; strategy</span><span className="cap-list__details">Lead · Verbal · Visual</span></li>
              <li className="cap-list__item"><span className="cap-list__num">02</span><span className="cap-list__name">Naming &amp; verbal identity</span><span className="cap-list__details">Names · Voice · Stories</span></li>
              <li className="cap-list__item"><span className="cap-list__num">03</span><span className="cap-list__name">Packaging &amp; retail systems</span><span className="cap-list__details">CPG · Hospitality</span></li>
              <li className="cap-list__item"><span className="cap-list__num">04</span><span className="cap-list__name">Digital product &amp; web</span><span className="cap-list__details">Web · iOS · Tools</span></li>
              <li className="cap-list__item"><span className="cap-list__num">05</span><span className="cap-list__name">Editorial &amp; publication</span><span className="cap-list__details">Book · Annual · Catalog</span></li>
              <li className="cap-list__item"><span className="cap-list__num">06</span><span className="cap-list__name">Campaigns &amp; creative direction</span><span className="cap-list__details">Launch · Brand films · OOH</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">How an engagement runs</span>
          <h2 className="cb-title display-lg">Four phases, twelve to twenty weeks, one person on each side.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '48px' }} className="phases-grid">
            <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.18)' }}>
              <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '16px' }}>Phase 01 · Weeks 1–3</span>
              <h3 style={{ fontSize: '22px', lineHeight: 1.20, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '12px' }}>Listen, write, set aside.</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.80 }}>We re-write the brief in our own words and run it past you. The first useful artefact of the project.</p>
            </div>
            <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.18)' }}>
              <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '16px' }}>Phase 02 · Weeks 3–8</span>
              <h3 style={{ fontSize: '22px', lineHeight: 1.20, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '12px' }}>First round, second thought.</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.80 }}>Two directions, made far enough to argue with. One of them, usually the calmer one, becomes the project.</p>
            </div>
            <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.18)' }}>
              <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '16px' }}>Phase 03 · Weeks 8–16</span>
              <h3 style={{ fontSize: '22px', lineHeight: 1.20, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '12px' }}>Build the actual thing.</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.80 }}>System, type, applications, the website if there is one. Weekly working sessions, fortnightly reviews.</p>
            </div>
            <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.18)' }}>
              <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '16px' }}>Phase 04 · Weeks 16–20</span>
              <h3 style={{ fontSize: '22px', lineHeight: 1.20, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '12px' }}>Hand over, stay near.</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.80 }}>A one-page guide, a working file, and a small retainer to keep the system honest in the first six months.</p>
            </div>
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

      <style>{`
        @media (max-width: 960px) { .phases-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .phases-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
