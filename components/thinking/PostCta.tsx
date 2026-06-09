// Lead CTA shown at the end of every essay, above the newsletter block.
// Readers finishing a post are the warmest visitors the journal gets — give
// them a route to the studio, not just the mailing list.
export default function PostCta() {
  return (
    <section className="container" style={{ paddingBottom: '24px' }}>
      <div className="color-block color-block--navy">
        <span className="eyebrow cb-eyebrow">Work with us</span>
        <h2 className="cb-title display-lg">Have a project in mind?</h2>
        <p className="body-lg cb-body">We take on a small number of projects at a time — identity, naming, packaging, digital. Tell us what you&apos;re making and we&apos;ll tell you honestly whether we&apos;re the right studio for it.</p>
        <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a className="btn btn-on-color" style={{ background: 'var(--c-block-lime)', color: 'var(--c-ink)' }} href="/contact">Start a project →</a>
          <a className="btn btn-on-color" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }} href="/work">See our work →</a>
        </div>
      </div>
    </section>
  )
}
