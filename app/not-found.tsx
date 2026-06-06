import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Not found · Afterthought',
}

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf__inner">

        <div className="nf__digits" aria-label="404">
          <div className="nf__digit nf__digit--a" aria-hidden="true">4</div>
          <div className="nf__digit nf__digit--b" aria-hidden="true">0</div>
          <div className="nf__digit nf__digit--c" aria-hidden="true">4</div>
        </div>

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
          text-align: center;
          background:
            radial-gradient(ellipse 55% 60% at 10% 20%,  rgba(215,242,108,0.35) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 90% 80%,  rgba(205,186,242,0.4)  0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 85% 15%,  rgba(244,168,135,0.28) 0%, transparent 60%),
            radial-gradient(ellipse 35% 40% at 15% 85%,  rgba(199,233,213,0.3)  0%, transparent 60%),
            #FAFAF8;
        }

        .nf__inner {
          max-width: 560px;
          width: 100%;
          position: relative;
        }

        /* ── Digit blocks ── */
        .nf__digits {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .nf__digit {
          width: 128px;
          height: 168px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 84px;
          font-variation-settings: 'wght' 740;
          font-weight: 740;
          letter-spacing: -5px;
          line-height: 1;
          color: rgba(0,0,0,0.72);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          cursor: default;
        }

        .nf__digit:hover {
          transform: rotate(0deg) translateY(-8px) scale(1.06) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .nf__digit--a {
          background: #D7F26C;
          transform: rotate(-5deg) translateY(6px);
          box-shadow: 0 8px 24px rgba(167,202,48,0.35);
        }
        .nf__digit--b {
          background: #CDBAF2;
          transform: rotate(3deg) translateY(-8px);
          box-shadow: 0 8px 24px rgba(140,100,240,0.25);
        }
        .nf__digit--c {
          background: #F4A887;
          transform: rotate(-2.5deg) translateY(4px);
          box-shadow: 0 8px 24px rgba(220,110,60,0.28);
        }

        /* ── Text ── */
        .nf__eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.28;
          margin-bottom: 18px;
        }

        .nf__title {
          font-size: clamp(42px, 6.5vw, 72px);
          font-variation-settings: 'wght' 340;
          font-weight: 340;
          letter-spacing: -2px;
          line-height: 1.04;
          color: var(--c-ink);
          margin-bottom: 20px;
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
          color: #FFFFFF;
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
        }

        .nf__ghost:hover { opacity: 1; }

        @media (max-width: 600px) {
          .nf__br { display: none; }
          .nf__digit {
            width: 92px;
            height: 122px;
            font-size: 60px;
            border-radius: 18px;
          }
          .nf__digits { gap: 10px; margin-bottom: 36px; }
        }
      `}</style>
    </main>
  )
}
