import type { Metadata } from 'next'
import { ServiceCards } from '@/components/ServiceCards'
import type { Service } from '@/components/ServiceCards'

export const metadata: Metadata = {
  title: 'Services — Afterthought',
  description: 'Brand identity, naming, motion, packaging, and digital — what Afterthought does, how it works, and what we don\'t take on.',
}

const services: Service[] = [
  {
    num: '01',
    color: 'lime',
    title: 'Brand Identity & Strategy',
    tags: ['Visual', 'Verbal', 'Systems'],
    description: 'The full thing — from a single positioning sentence to a working visual system. We research the category, write the brief in our own words, then build an identity that holds up across every surface it needs to touch.',
    deliverables: ['Brand strategy & positioning', 'Logo & mark system', 'Colour, type, and grid', 'Brand guidelines (usable, not decorative)', 'Core application suite'],
    for: 'Founders building from scratch. Established businesses who\'ve outgrown their identity.',
  },
  {
    num: '02',
    color: 'cream',
    title: 'Naming & Verbal Identity',
    tags: ['Naming', 'Tone of voice', 'Copy'],
    description: 'We find the name that says the thing you didn\'t know you meant. Then we build the language system around it — tone, voice, the sentence that goes on the homepage, the words that hold up in a pitch.',
    deliverables: ['Name candidates + rationale', 'Linguistic and trademark screening', 'Taglines and positioning lines', 'Tone of voice guidelines', 'Core copy (web, pitch, packaging)'],
    for: 'New ventures. Re-launches. Companies whose name no longer tells the right story.',
  },
  {
    num: '03',
    color: 'sky',
    title: 'Motion & Animation',
    tags: ['Brand motion', 'Film', 'UI animation'],
    description: 'Brand identity systems that move. We design motion for logos, campaigns, social content, and product UI — always from brand first, never decoration for its own sake.',
    deliverables: ['Motion identity system', 'Brand film & social content', 'Animated logo suite (Lottie / After Effects)', 'Title sequences and transitions', 'UI animation specs'],
    for: 'Brands that live on screen. Founders who need their story told in 30 seconds.',
  },
  {
    num: '04',
    color: 'coral',
    title: 'Packaging & Retail Systems',
    tags: ['CPG', 'Hospitality', 'Print'],
    description: 'Physical identity — the thing that sits on a shelf, arrives in a bag, or greets someone at a door. We design for production reality, not just for the render.',
    deliverables: ['Structural and surface design', 'Typography and illustration direction', 'Production-ready print files', 'Retail environment touchpoints', 'Range architecture'],
    for: 'Consumer brands. Hospitality groups. Anyone whose product touches a person\'s hands.',
  },
  {
    num: '05',
    color: 'mint',
    title: 'Digital & Web',
    tags: ['Web', 'Product', 'Design systems'],
    description: 'Design for screens that need to do something. We work at the intersection of brand and product — from marketing sites to internal tools — and hand off work that developers can actually build.',
    deliverables: ['Marketing site design', 'Design system & component library', 'Product UX & interface design', 'Developer-ready specs (Figma)', 'Motion and interaction guidelines'],
    for: 'Startups launching a product. Established brands rebuilding their digital presence.',
  },
  {
    num: '06',
    color: 'lilac',
    title: 'Campaigns & Creative Direction',
    tags: ['Launch', 'OOH', 'Brand films'],
    description: 'The moment a brand goes public — we help plan it and make it. From launch campaigns to annual brand films, we concept, direct, and produce. For production at scale, we bring in our trusted collaborators.',
    deliverables: ['Campaign concept & art direction', 'OOH and print design', 'Social campaign suite', 'Brand film concept and direction', 'Photography direction'],
    for: 'Brands making a deliberate public moment. Founders who need the launch to count.',
  },
  {
    num: '07',
    color: 'pink',
    title: 'Social Media & Distribution',
    tags: ['Content', 'Social', 'Distribution'],
    description: 'We help brands build a real presence — not just post more. That means a content system rooted in the brand, a point of view worth following, and a distribution strategy that compounds over time rather than chasing the algorithm.',
    deliverables: ['Content strategy & editorial calendar', 'Social identity system (templates, formats, type)', 'Platform-native content production', 'Caption and copy voice', 'Distribution playbook & channel strategy'],
    for: 'Brands with something to say but no system to say it consistently. Founders building an audience alongside a product.',
  },
]

export default function Services() {
  return (
    <>
      <section className="page-header container">
        <div className="page-header__eyebrow eyebrow">
          <span className="pulse"></span>
          <span>Services · What we make</span>
        </div>
        <h1 className="display-xl page-header__title">
          Seven disciplines. <em>One clear point of view.</em>
        </h1>
        <p className="page-header__sub body-lg">
          We take on roughly four engagements a year. Every project gets two founders, not a team assigned after the pitch. Below is what we do, what we deliver, and who it&apos;s for.
        </p>
      </section>

      {/* ── SERVICE DECK ── */}
      <div className="container">
        <ServiceCards services={services} />
      </div>

      {/* ── PROCESS ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--cream">
          <span className="eyebrow cb-eyebrow">How an engagement runs</span>
          <h2 className="cb-title display-lg">Four phases, twelve to twenty weeks, one person on each side.</h2>
          <div className="phases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '48px' }}>
            {[
              { phase: '01', weeks: 'Weeks 1–3', title: 'Listen, write, set aside.', body: 'We re-write the brief in our own words and run it past you. The first useful artefact of the project.' },
              { phase: '02', weeks: 'Weeks 3–8', title: 'First round, second thought.', body: 'Two directions, made far enough to argue with. One of them, usually the calmer one, becomes the project.' },
              { phase: '03', weeks: 'Weeks 8–16', title: 'Build the actual thing.', body: 'System, type, applications, the website if there is one. Weekly working sessions, fortnightly reviews.' },
              { phase: '04', weeks: 'Weeks 16–20', title: 'Hand over, stay near.', body: 'A one-page guide, a working file, and a small retainer to keep the system honest in the first six months.' },
            ].map(p => (
              <div key={p.phase} style={{ paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.18)' }}>
                <span className="caption" style={{ opacity: 0.55, display: 'block', marginBottom: '16px' }}>Phase {p.phase} · {p.weeks}</span>
                <h3 style={{ fontSize: '22px', lineHeight: 1.20, letterSpacing: '-0.35px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.80 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT WE DON'T DO ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="svc-limits">
          <div className="svc-limits__head">
            <span className="eyebrow">For the record</span>
            <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '24px' }}>What we don&apos;t take on.</h2>
            <p className="body-lg" style={{ opacity: 0.65, maxWidth: '520px' }}>Saying no is how we stay good at what we say yes to. Being clear about this upfront saves everyone a month.</p>
          </div>
          <div className="svc-limits__grid">
            {[
              { title: 'Logo-only briefs', body: 'We don\'t design logos in isolation. A mark without a system is a shape. We need a project, not a file.' },
              { title: 'Rush work', body: 'We don\'t do 72-hour turnarounds. Good work takes the time it takes. If you need it yesterday, we\'re not the right studio.' },
              { title: 'Pure execution', body: 'We don\'t adapt someone else\'s brand system. We\'re most useful at the start of a problem, not downstream of someone else\'s answer.' },
              { title: 'Things we don\'t believe in', body: 'If the product harms people or the founder can\'t say what it\'s for, we\'ll pass. This has happened twice. We don\'t regret it.' },
            ].map(l => (
              <div key={l.title} className="svc-limit">
                <div className="svc-limit__title">{l.title}</div>
                <p className="svc-limit__body">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container" style={{ paddingBottom: 'var(--s-section)' }}>
        <div className="color-block color-block--navy">
          <span className="eyebrow cb-eyebrow">Start something</span>
          <h2 className="cb-title display-lg">Have a brief? <em>We&apos;d like to read it.</em></h2>
          <p className="body-lg cb-body" style={{ opacity: 0.85 }}>Send us a few sentences about the project — what it is, what you need, and when. We reply to everything, even when the answer is not yet.</p>
          <div style={{ marginTop: '48px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a className="btn btn-secondary-dark" href="/contact">Send a brief →</a>
            <a className="btn btn-secondary-dark" href="mailto:hello@afterthought.studio">hello@afterthought.studio</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .phases-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .phases-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
