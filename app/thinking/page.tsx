import type { Metadata } from 'next'
import NewsletterForm from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Thinking — Afterthought',
  description: 'The Afterthought journal — slow essays from the desk.',
}

export default function Thinking() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span>The journal · Vol. 01 · Quarterly</span>
        </div>
        <h1 className="display-xl page-header__title">Notes from the desk — slow essays, the occasional <em>opinion</em>.</h1>
        <p className="page-header__sub body-lg">We write four times a year, roughly. Short essays, the odd process post, and the kind of view of the industry you&apos;d usually only hear at the end of a kickoff. Subscribe and you&apos;ll get one a quarter, in the post box and in the inbox.</p>
      </section>

      <section className="container" style={{ paddingBottom: '32px' }}>
        <a className="journal-feature" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <span className="journal-feature__cat">Essay · Anurag &amp; Tina · 11 min read</span>
            <h2 className="journal-feature__title">A modest argument against <em>the rebrand</em>.</h2>
            <p className="journal-feature__excerpt">Most brands we meet need a quieter, slower thing than the one they came in asking for. Here is the conversation we now start with — and the four signals we listen for before we agree to redraw a single line.</p>
            <div className="journal-feature__meta">
              <span className="caption" style={{ opacity: 0.55 }}>04 / 2026 · Issue 02</span>
              <span className="btn btn-on-color" style={{ background: 'var(--c-ink)', color: 'var(--c-canvas)' }}>Read the essay →</span>
            </div>
          </div>
          <div className="journal-feature__visual">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1, letterSpacing: '-2px' }}>Are you sure<br />you want a <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--c-accent-magenta)', textDecorationThickness: '3px' }}>rebrand</span>?</div>
              <div style={{ marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.55 }}>Issue 02 cover · April 2026</div>
            </div>
          </div>
        </a>
      </section>

      <section className="container section-tight">
        <div className="section-head">
          <div className="section-head__left">
            <span className="caption">Recent</span>
            <h2 className="display-md section-head__title">A few we wrote earlier.</h2>
          </div>
          <div className="section-head__right">
            <p className="body-sm">We don&apos;t publish often, so this is more or less the archive.</p>
          </div>
        </div>

        <div className="thinking-grid">
          <a className="think-card think-card--cream" href="#">
            <div>
              <div className="think-card__top">
                <span className="think-card__cat">Essay · 9 min</span>
                <span className="think-card__date">02 / 26</span>
              </div>
              <h3 className="think-card__title">The brief is always wrong, and that&apos;s the part of the job we love most.</h3>
              <p className="think-card__desc">A short defence of the first month — the one nobody schedules for, and what we tend to do with it.</p>
            </div>
            <span className="think-card__cta">Read the essay →</span>
          </a>
          <a className="think-card think-card--cream" href="#">
            <div>
              <div className="think-card__top">
                <span className="think-card__cat">Process · 6 min</span>
                <span className="think-card__date">12 / 25</span>
              </div>
              <h3 className="think-card__title">On making a wordmark you&apos;ll still like in eleven years.</h3>
              <p className="think-card__desc">Drawn from the Helio re-launch — how we settle on a single letterform when there are four good ones.</p>
            </div>
            <span className="think-card__cta">Read the post →</span>
          </a>
          <a className="think-card think-card--cream" href="#">
            <div>
              <div className="think-card__top">
                <span className="think-card__cat">Opinion · 4 min</span>
                <span className="think-card__date">10 / 25</span>
              </div>
              <h3 className="think-card__title">Don&apos;t design the menu. Design the way the menu changes.</h3>
              <p className="think-card__desc">A short rule we now apply to every restaurant brief — and the project that taught it to us.</p>
            </div>
            <span className="think-card__cta">Read the note →</span>
          </a>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div className="section-head__left">
            <span className="caption">The archive</span>
            <h2 className="display-md section-head__title">Everything we&apos;ve published so far.</h2>
          </div>
          <div className="section-head__right">
            <p className="body-sm">A short list, kept honest by being short. We add to it about four times a year.</p>
          </div>
        </div>

        <ul className="journal-list">
          <li><a href="#"><span className="journal-list__num">№ 006</span><span className="journal-list__title">Don&apos;t design the menu. Design the way the menu changes.</span><span className="journal-list__cat">Opinion</span><span className="journal-list__date">10 · 25</span></a></li>
          <li><a href="#"><span className="journal-list__num">№ 005</span><span className="journal-list__title">A modest argument against the rebrand.</span><span className="journal-list__cat">Essay</span><span className="journal-list__date">04 · 26</span></a></li>
          <li><a href="#"><span className="journal-list__num">№ 004</span><span className="journal-list__title">On making a wordmark you&apos;ll still like in eleven years.</span><span className="journal-list__cat">Process</span><span className="journal-list__date">12 · 25</span></a></li>
          <li><a href="#"><span className="journal-list__num">№ 003</span><span className="journal-list__title">The brief is always wrong, and that&apos;s the part of the job we love most.</span><span className="journal-list__cat">Essay</span><span className="journal-list__date">02 · 26</span></a></li>
          <li><a href="#"><span className="journal-list__num">№ 002</span><span className="journal-list__title">Two founders, no department: a small studio&apos;s first six months.</span><span className="journal-list__cat">Studio</span><span className="journal-list__date">11 · 25</span></a></li>
          <li><a href="#"><span className="journal-list__num">№ 001</span><span className="journal-list__title">An afterthought on naming the studio &quot;Afterthought.&quot;</span><span className="journal-list__cat">Studio</span><span className="journal-list__date">07 · 25</span></a></li>
        </ul>
      </section>

      <section className="container" id="newsletter" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">The newsletter</span>
          <h2 className="cb-title display-lg">Once a quarter. Not a minute earlier.</h2>
          <p className="body-lg cb-body">We send a short letter four times a year — one of the essays above, two or three sentences about what we&apos;re making, and the occasional book recommendation. We don&apos;t sell the list, run a tracker, or write a tenth note about Q4 trends.</p>
          <NewsletterForm />
          <p className="caption" style={{ opacity: 0.6, marginTop: '16px' }}>Four notes a year. Unsubscribe in one click. Currently 217 readers.</p>
        </div>
      </section>
    </>
  )
}
