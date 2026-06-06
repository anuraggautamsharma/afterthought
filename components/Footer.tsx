import type { SiteSettings } from '@/lib/settings'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: 'Instagram', href: settings.social_instagram },
    { label: 'LinkedIn',  href: settings.social_linkedin  },
    { label: 'Behance',   href: settings.social_behance   },
    { label: 'Medium',    href: settings.social_medium    },
  ].filter(s => s.href)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <img className="footer__logo" src="/assets/logo-horizontal.png" alt="Afterthought" />
        <div className="footer__cols">
          <div className="footer__col footer__about">
            <h5>The studio</h5>
            <p>Afterthought is an independent design and creative studio based in {settings.location}, working internationally on brand identity, naming, and motion.</p>
            <p>{settings.status_long}.</p>
          </div>
          <div className="footer__col">
            <h5>Work</h5>
            <ul>
              <li><a href="/work">All projects</a></li>
              <li><a href="/work/justach">Justach</a></li>
              <li><a href="/work/pipelinelab">The Pipeline Lab</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Studio</h5>
            <ul>
              <li><a href="/studio">About</a></li>
              <li><a href="/studio#founders">Founders</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Thinking</h5>
            <ul>
              <li><a href="/thinking">Journal</a></li>
              <li><a href="/thinking#newsletter">Newsletter</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Connect</h5>
            <ul>
              {socials.length > 0 ? (
                socials.map(s => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                  </li>
                ))
              ) : (
                <li><a href={`mailto:${settings.email_general}`}>{settings.email_general}</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Afterthought Studio</span>
          <span>Bangalore — Working internationally — Made on second thought.</span>
        </div>
      </div>
    </footer>
  )
}
