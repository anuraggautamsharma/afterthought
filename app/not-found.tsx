import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Not found · Afterthought',
}

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf__wrap">

        {/* Background number — sits behind everything */}
        <div className="nf__bg" aria-hidden="true">404</div>

        <div className="nf__content">
          <p className="nf__eyebrow">Error 404</p>
          <h1 className="nf__title">
            This wasn&apos;t<br />
            <em>in the brief.</em>
          </h1>
          <p className="nf__sub">
            The page you&apos;re looking for doesn&apos;t exist —<br />
            or has moved on to better things.
          </p>
          <div className="nf__actions">
            <Link href="/" className="nf__btn">Take me home</Link>
            <Link href="/work" className="nf__ghost">See our work ↗</Link>
          </div>
        </div>

      </div>

      <style>{`
        .nf {
          min-height: calc(100svh - 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px var(--gutter);
        }

        .nf__wrap {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
          position: relative;
          display: flex;
          align-items: center;
          min-height: 480px;
        }

        .nf__bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: clamp(160px, 22vw, 320px);
          font-variation-settings: 'wght' 800;
          font-weight: 800;
          color: #EDEAE4;
          letter-spacing: -0.04em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          overflow: hidden;
          border-radius: 4px;
        }

        .nf__content {
          position: relative;
          max-width: 520px;
        }

        .nf__eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.3;
          margin-bottom: 28px;
        }

        .nf__title {
          font-size: clamp(48px, 7vw, 80px);
          font-variation-settings: 'wght' 340;
          font-weight: 340;
          letter-spacing: -2px;
          line-height: 1.02;
          color: var(--c-ink);
          margin-bottom: 24px;
        }

        .nf__title em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          letter-spacing: -1px;
        }

        .nf__sub {
          font-size: 16px;
          line-height: 1.65;
          opacity: 0.4;
          margin-bottom: 48px;
        }

        .nf__actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .nf__btn {
          display: inline-flex;
          align-items: center;
          background: var(--c-ink);
          color: var(--c-canvas);
          font-size: 14px;
          font-variation-settings: 'wght' 500;
          font-weight: 500;
          letter-spacing: -0.1px;
          padding: 14px 28px;
          border-radius: var(--r-pill);
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .nf__btn:hover { opacity: 0.75; }

        .nf__ghost {
          font-size: 14px;
          font-variation-settings: 'wght' 460;
          font-weight: 460;
          color: var(--c-ink);
          text-decoration: none;
          opacity: 0.38;
          transition: opacity 0.15s;
          letter-spacing: -0.1px;
        }

        .nf__ghost:hover { opacity: 1; }

        @media (max-width: 600px) {
          .nf { padding: 48px 24px; }
          .nf__bg { justify-content: center; opacity: 0.5; }
          .nf__title { letter-spacing: -1.5px; }
          .nf__sub br { display: none; }
        }
      `}</style>
    </main>
  )
}
