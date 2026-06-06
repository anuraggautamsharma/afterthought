import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page not found · Afterthought',
}

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__inner">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">
          This page doesn&apos;t<br /><em>exist yet.</em>
        </h1>
        <p className="not-found__body">
          The link might be wrong, or this page may have moved.<br />
          Let&apos;s get you back somewhere useful.
        </p>
        <div className="not-found__links">
          <Link href="/" className="not-found__cta">← Back to home</Link>
          <Link href="/work" className="not-found__link">View our work</Link>
          <Link href="/contact" className="not-found__link">Get in touch</Link>
        </div>
      </div>

      <style>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px var(--gutter);
          background: var(--c-canvas);
        }

        .not-found__inner {
          max-width: 560px;
          width: 100%;
        }

        .not-found__code {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--c-ink);
          opacity: 0.28;
          margin-bottom: 28px;
        }

        .not-found__title {
          font-size: clamp(44px, 7vw, 72px);
          font-variation-settings: 'wght' 340;
          font-weight: 340;
          letter-spacing: -1.5px;
          line-height: 1.05;
          color: var(--c-ink);
          margin-bottom: 24px;
        }

        .not-found__title em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
        }

        .not-found__body {
          font-size: 17px;
          line-height: 1.65;
          opacity: 0.45;
          margin-bottom: 48px;
        }

        .not-found__links {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .not-found__cta {
          font-size: 15px;
          font-variation-settings: 'wght' 500;
          font-weight: 500;
          color: var(--c-ink);
          text-decoration: none;
          background: var(--c-ink);
          color: var(--c-canvas);
          padding: 12px 24px;
          border-radius: var(--r-pill);
          transition: opacity 0.15s;
          letter-spacing: -0.1px;
        }

        .not-found__cta:hover { opacity: 0.78; }

        .not-found__link {
          font-size: 15px;
          color: var(--c-ink);
          text-decoration: none;
          opacity: 0.45;
          transition: opacity 0.15s;
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
        }

        .not-found__link:hover { opacity: 1; }
      `}</style>
    </main>
  )
}
