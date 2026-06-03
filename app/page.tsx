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
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__bg-word">Afterthought</span>
        </div>
        <div className="container">
          <div className="hero__eyebrow eyebrow">
            <span className="pulse"></span>
            <span>Independent design &amp; creative studio · Est. 2025</span>
          </div>
          <h1 className="display-xl hero__title">
            <span className="hero__clip"><span>We make the second&nbsp;</span></span>
            <span className="hero__clip"><span>thoughts that brands</span></span>
            <span className="hero__clip"><span>wish they&apos;d had <em>first</em>.</span></span>
          </h1>
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

      <section className="showreel" id="showreel-section">
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
            <div className="sr-grain"></div>
          </div>

          <div className="showreel__overlay" id="showreel-overlay">
            <button className="showreel__play-btn" aria-label="Play showreel">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                <path d="M2 1.5L18 12L2 22.5V1.5Z" fill="currentColor"></path>
              </svg>
            </button>
          </div>

          <div className="showreel__hud">
            <div className="showreel__progress-track">
              <div className="showreel__progress-fill" id="showreel-progress"></div>
            </div>
            <button className="showreel__mute" id="showreel-mute" aria-label="Toggle sound">
              <svg className="sr-icon sr-icon--off" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 5H4.5L7.5 2.5V12.5L4.5 10H1V5Z" fill="currentColor"/>
                <line x1="10.5" y1="5" x2="14" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="14" y1="5" x2="10.5" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <svg className="sr-icon sr-icon--on" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 5H4.5L7.5 2.5V12.5L4.5 10H1V5Z" fill="currentColor"/>
                <path d="M10.5 5.5C11.7 6.7 11.7 8.3 10.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M12.5 3.5C14.7 5.7 14.7 9.3 12.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
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
