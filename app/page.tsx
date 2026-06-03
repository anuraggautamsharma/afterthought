import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Afterthought — A design & creative studio',
  description:
    'Afterthought is an independent design & creative studio based in Bangalore, working internationally. Brand identity, naming, packaging and digital, by Anurag Gautam and Tina Gidwani.',
}

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero__eyebrow eyebrow">
            <span className="pulse"></span>
            <span>Independent design &amp; creative studio · Est. 2025</span>
          </div>
          <h1 className="display-xl hero__title">We make the second&nbsp;thoughts that brands wish they&apos;d had <em>first</em>.</h1>
          <div className="hero__meta">
            <div className="hero__meta-block">
              <span className="caption">What we do</span>
              <p className="body-lg">Brand identity, naming, packaging and digital — made for founders, institutions and the occasional well-meaning monopoly. We start where the obvious answer runs out.</p>
            </div>
            <div className="hero__cta-row">
              <a className="btn btn-primary" href="/contact">Start a project</a>
              <a className="btn btn-secondary" href="/work">See our work</a>
            </div>
          </div>
        </div>
      </header>

      <section className="showreel" data-screen-label="Showreel">
        <div className="container">
          <div className="showreel__head">
            <span className="caption">Showreel</span>
            <span className="caption">2025 / 2026 · 02:34</span>
          </div>

          <div className="showreel__stage" id="showreel-stage">
            <video
              id="showreel-video"
              className="showreel__video"
              muted
              loop
              playsInline
              preload="none"
            ></video>

            <div className="showreel__poster" aria-hidden="true">
              <div className="sr-gradient"></div>
              <div className="sr-orb sr-orb--1"></div>
              <div className="sr-orb sr-orb--2"></div>
              <div className="sr-orb sr-orb--3"></div>
              <div className="sr-name">Afterthought</div>
            </div>

            <div className="showreel__overlay" id="showreel-overlay">
              <button className="showreel__play-btn" aria-label="Play showreel">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <path d="M2 1.5L18 12L2 22.5V1.5Z" fill="currentColor"></path>
                </svg>
              </button>
            </div>

            <div className="showreel__bar">
              <span className="caption showreel__dur">02 : 34</span>
              <button className="showreel__mute" id="showreel-mute" aria-label="Toggle sound">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 4.5H4L7.5 2V12L4 9.5H1V4.5Z" fill="currentColor"></path>
                  <path d="M9 5C9.9 5.9 9.9 8.1 9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"></path>
                  <path d="M10.5 3.5C12.3 5.3 12.3 8.7 10.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"></path>
                </svg>
                <span>Sound off</span>
              </button>
            </div>
          </div>

          <div className="showreel__foot">
            <p className="body-sm showreel__desc">A glimpse of what we&apos;ve made — identities, naming, packaging, digital. Work that earns its place in the world by earning its place in the brief first.</p>
            <a className="btn showreel__cta" href="/work">View all work →</a>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div className="section-head__left">
            <span className="caption">Selected work — 2025 / 2026</span>
            <h2 className="display-lg section-head__title">Two projects, so far. Both we&apos;d happily do again.</h2>
          </div>
          <div className="section-head__right">
            <p className="body-sm">We started Afterthought in 2025. Below are the first two engagements — one a young climate company, one an old neighbourhood place pretending to be young.</p>
          </div>
        </div>

        <div className="work-grid">
          <a className="tile tile--lime tile-wide" href="/work/helio">
            <div className="tile__visual">
              <div className="vis-helio">
                <div className="vis-helio__left">
                  <div className="vis-helio__caption"><span>Naming · Identity · Web</span><span>2025</span></div>
                  <div className="vis-helio__line"></div>
                  <div className="vis-helio__wordmark">Heli<span className="o">o</span></div>
                  <div className="vis-helio__line"></div>
                  <div className="vis-helio__caption"><span>A climate-tech holding company</span><span>R0 — R3</span></div>
                </div>
                <div className="vis-helio__right"><div className="vis-helio__sun"></div></div>
              </div>
            </div>
            <div className="tile__meta">
              <div className="tile__title-block">
                <span className="caption">Case 001 / Helio</span>
                <div className="tile__title">From a brief about heat pumps to a brand about hope.</div>
              </div>
              <div className="tile__tags"><span className="tile__tag">Identity</span><span className="tile__tag">Naming</span><span className="tile__tag">Web</span></div>
            </div>
          </a>

          <a className="tile tile--coral tile-wide" href="/work/querida">
            <div className="tile__visual">
              <div className="vis-querida">
                <div className="vis-querida__name">Querida</div>
                <div className="vis-querida__menu">
                  <div className="vis-querida__menu-row"><span>Pan con tomate</span><span className="dots"></span><span>06</span></div>
                  <div className="vis-querida__menu-row"><span>Boquerones, sherry</span><span className="dots"></span><span>09</span></div>
                  <div className="vis-querida__menu-row"><span>Tortilla, dressed leaves</span><span className="dots"></span><span>11</span></div>
                  <div className="vis-querida__menu-row"><span>Almond cake, citrus</span><span className="dots"></span><span>08</span></div>
                </div>
              </div>
            </div>
            <div className="tile__meta">
              <div className="tile__title-block">
                <span className="caption">Case 002 / Querida</span>
                <div className="tile__title">A neighbourhood place that takes itself seriously, but only just.</div>
              </div>
              <div className="tile__tags"><span className="tile__tag">Restaurant</span><span className="tile__tag">Wordmark</span><span className="tile__tag">Print</span></div>
            </div>
          </a>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--navy">
          <span className="eyebrow cb-eyebrow">What we&apos;re after</span>
          <h2 className="cb-title display-lg">The brands that don&apos;t know what they look like <em>yet</em>.</h2>
          <p className="body-lg cb-body" style={{ opacity: 0.85 }}>We&apos;re most interested in the moment before a category has a visual language — young companies, new products, institutions trying to mean something to a new generation. The brief that arrives without all the answers is the one we want. We&apos;re less useful when the solution is already obvious.</p>
          <div style={{ marginTop: '56px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <span className="caption" style={{ opacity: 0.7 }}>Bangalore · Working internationally · Est. 2025</span>
            <a className="btn btn-secondary-dark" href="/work">See the work →</a>
          </div>
        </div>
      </section>
    </>
  )
}
