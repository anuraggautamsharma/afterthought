export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <img className="footer__logo" src="/assets/logo-horizontal.png" alt="Afterthought" />
        <div className="footer__cols">
          <div className="footer__col footer__about">
            <h5>The studio</h5>
            <p>Afterthought is an independent design and creative studio based in Bangalore, working internationally on brand identity, naming, and motion.</p>
            <p>Est. 2025 · Currently reading briefs for Summer 2026.</p>
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
              <li><a href="/studio#capabilities">Capabilities</a></li>
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
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Behance</a></li>
              <li><a href="#">Medium</a></li>
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
