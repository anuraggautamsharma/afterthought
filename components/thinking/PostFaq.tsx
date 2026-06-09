import JsonLd from '@/components/JsonLd'

export interface Faq {
  q: string
  a: string
}

/**
 * Renders an FAQ accordion at the end of a post plus FAQPage structured data
 * (great for AI answer engines and Google rich results). Uses native
 * <details>/<summary> so it needs no client JS.
 */
export default function PostFaq({ faqs }: { faqs: Faq[] }) {
  if (!faqs?.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="post-faq">
      <JsonLd data={schema} />
      <div className="post-faq__inner">
        <span className="post-faq__label">FAQ</span>
        <h2 className="post-faq__title">Frequently asked questions</h2>
        <div className="post-faq__list">
          {faqs.map((f, i) => (
            <details key={i} className="post-faq__item">
              <summary className="post-faq__q">{f.q}</summary>
              <div className="post-faq__a">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
