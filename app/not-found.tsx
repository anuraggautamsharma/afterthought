import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Not found · Afterthought',
}

export default function NotFound() {
  return (
    <main className="nf">

      <div className="nf__bg" aria-hidden="true">404</div>

      <div className="nf__inner">
        <p className="nf__eyebrow">Error 404</p>
        <h1 className="nf__title">
          This wasn&apos;t<br />
          <em>in the brief.</em>
        </h1>
        <p className="nf__sub">
          The page you&apos;re looking for doesn&apos;t exist —<br className="nf__br" />
          or has moved on to better things.
        </p>
        <div className="nf__actions">
          <Link href="/" className="nf__btn">Take me home</Link>
          <Link href="/work" className="nf__ghost">See our work ↗</Link>
        </div>
      </div>

      <style>{`
        .nf {
          min-height: calc(100svh - 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 32px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .nf__bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(200px, 30vw, 420px);
          font-variation-settings: 'wght' 800;
          font-weight: 800;
          color: #EDEAE4;
          letter-spacing: -0.05em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
        }

        .nf__inner {
          position: relative;
          max-width: 560px;
          width: 100%;
        }

        .nf__eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.3;
          margin-bottom: 24px;
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
          margin-bottom: 44px;
        }

        .nf__actions {
          display: flex;
          align-items: center;
          justify-content: center;
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
          border-radius: 999px;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .nf__btn:hover { opacity: 0.75; }

        .nf__ghost {
          font-size: 14px;
          color: var(--c-ink);
          text-decoration: none;
          opacity: 0.38;
          transition: opacity 0.15s;
          letter-spacing: -0.1px;
        }

        .nf__ghost:hover { opacity: 1; }

        @media (max-width: 600px) {
          .nf__br { display: none; }
          .nf__bg { font-size: 52vw; }
        }
      `}</style>
    </main>
  )
}
