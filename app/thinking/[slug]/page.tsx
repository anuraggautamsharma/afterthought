import type { Metadata } from 'next'

interface PostMeta {
  title: string
  titleJsx?: React.ReactNode
  category: string
  date: string
  issue: string
  readTime: string
  authors: string
  excerpt: string
  heroColor: string
  heroTextColor?: string
}

const posts: Record<string, PostMeta> = {
  'a-modest-argument-against-the-rebrand': {
    title: 'A modest argument against the rebrand.',
    category: 'Essay',
    date: '04 / 2026',
    issue: 'Issue 02',
    readTime: '11 min read',
    authors: 'Anurag Gautam & Tina Gidwani',
    excerpt: 'Most brands we meet need a quieter, slower thing than the one they came in asking for. Here is the conversation we now start with.',
    heroColor: 'var(--c-block-navy)',
    heroTextColor: 'var(--c-inverse-ink)',
  },
  'the-brief-is-always-wrong': {
    title: 'The brief is always wrong, and that\'s the part of the job we love most.',
    category: 'Essay',
    date: '02 / 2026',
    issue: 'Issue 03',
    readTime: '9 min read',
    authors: 'Anurag Gautam',
    excerpt: 'A short defence of the first month — the one nobody schedules for, and what we tend to do with it.',
    heroColor: 'var(--c-block-coral)',
  },
  'on-making-a-wordmark': {
    title: 'On making a wordmark you\'ll still like in eleven years.',
    category: 'Process',
    date: '12 / 2025',
    issue: 'Issue 01',
    readTime: '6 min read',
    authors: 'Tina Gidwani',
    excerpt: 'Drawn from the Helio re-launch — how we settle on a single letterform when there are four good ones.',
    heroColor: 'var(--c-block-lime)',
  },
  'dont-design-the-menu': {
    title: 'Don\'t design the menu. Design the way the menu changes.',
    category: 'Opinion',
    date: '10 / 2025',
    issue: 'Issue 01',
    readTime: '4 min read',
    authors: 'Tina Gidwani & Anurag Gautam',
    excerpt: 'A short rule we now apply to every restaurant brief — and the project that taught it to us.',
    heroColor: 'var(--c-block-cream)',
  },
  'two-founders-no-department': {
    title: 'Two founders, no department: a small studio\'s first six months.',
    category: 'Studio',
    date: '11 / 2025',
    issue: 'Issue 01',
    readTime: '7 min read',
    authors: 'Anurag Gautam & Tina Gidwani',
    excerpt: 'What it actually looked like in the first half-year — the good decisions, the ones we\'d do differently, and the one we keep making.',
    heroColor: 'var(--c-block-lilac)',
  },
  'an-afterthought-on-naming': {
    title: 'An afterthought on naming the studio "Afterthought."',
    category: 'Studio',
    date: '07 / 2025',
    issue: 'Issue 01',
    readTime: '5 min read',
    authors: 'Anurag Gautam',
    excerpt: 'The name started as a joke. Then it became the most honest thing we\'d said about the studio in six months of trying to name it.',
    heroColor: 'var(--c-ink)',
    heroTextColor: 'var(--c-inverse-ink)',
  },
}

const relatedSlugs: Record<string, string[]> = {
  'a-modest-argument-against-the-rebrand': ['the-brief-is-always-wrong', 'on-making-a-wordmark', 'dont-design-the-menu'],
  'the-brief-is-always-wrong': ['a-modest-argument-against-the-rebrand', 'on-making-a-wordmark', 'two-founders-no-department'],
  'on-making-a-wordmark': ['a-modest-argument-against-the-rebrand', 'dont-design-the-menu', 'two-founders-no-department'],
  'dont-design-the-menu': ['a-modest-argument-against-the-rebrand', 'on-making-a-wordmark', 'an-afterthought-on-naming'],
  'two-founders-no-department': ['an-afterthought-on-naming', 'a-modest-argument-against-the-rebrand', 'the-brief-is-always-wrong'],
  'an-afterthought-on-naming': ['two-founders-no-department', 'a-modest-argument-against-the-rebrand', 'the-brief-is-always-wrong'],
}

export function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return { title: 'Not found — Afterthought' }
  return {
    title: `${post.title} — Afterthought`,
    description: post.excerpt,
  }
}

/* ─── Hero visual per post ─────────────────────────────── */
function HeroVisual({ slug, post }: { slug: string; post: PostMeta }) {
  const ink = post.heroTextColor ?? 'var(--c-ink)'
  switch (slug) {
    case 'a-modest-argument-against-the-rebrand':
      return (
        <div style={{ textAlign: 'center', padding: '0 32px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 1.08, letterSpacing: '-2px', color: ink }}>
            Are you sure<br />you want a{' '}
            <span style={{ textDecoration: 'line-through', textDecorationColor: '#E8825A', textDecorationThickness: '4px' }}>rebrand</span>?
          </div>
          <div style={{ marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.45, color: ink }}>
            Issue 02 cover · April 2026
          </div>
        </div>
      )
    case 'on-making-a-wordmark':
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(80px, 14vw, 200px)', lineHeight: 0.9, letterSpacing: '-7px', fontVariationSettings: "'wght' 540", fontWeight: 540, color: ink }}>
            Heli<span style={{ display: 'inline-block', transform: 'translateY(3px)', color: 'var(--c-block-coral)' }}>o</span>
          </div>
          <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.5, color: ink }}>
            Helio wordmark · 2025
          </div>
        </div>
      )
    case 'dont-design-the-menu':
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1.05, letterSpacing: '-2px', color: ink }}>Querida</div>
          <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', opacity: 0.55, color: ink }}>A small kitchen · Spanish, mostly</div>
        </div>
      )
    default:
      return (
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1, letterSpacing: '-2px', color: ink, padding: '0 32px', textAlign: 'center' }}>
          {post.category}
        </div>
      )
  }
}

/* ─── Body content per post ────────────────────────────── */
function PostBody({ slug }: { slug: string }) {
  switch (slug) {
    case 'a-modest-argument-against-the-rebrand':
      return <RebrandEssay />
    default:
      return (
        <div className="post-body container">
          <p className="post-lead" style={{ opacity: 0.45, fontStyle: 'italic' }}>This essay is coming soon.</p>
          <p>We publish four times a year, roughly. <a href="/thinking" style={{ color: 'inherit', borderBottom: '1px solid currentColor' }}>See what&apos;s already up</a>, or subscribe below and we&apos;ll send it when it&apos;s ready.</p>
        </div>
      )
  }
}

function RebrandEssay() {
  return (
    <div className="post-body container">
      <p className="post-lead">The rebrand arrives with a particular kind of urgency. The pitch deck is ready, the new CEO is impatient, and somewhere in the brief is a sentence that reads: &quot;We want to feel more premium.&quot; What nobody says in the first meeting — and what we have learned, slowly, to ask in the second — is what happened to make the current brand feel wrong.</p>

      <p>Most of the time, the answer is not &ldquo;the logo is bad.&rdquo; It&apos;s something more specific: the company got bigger, or pivoted, or hired someone who keeps saying the word &ldquo;contemporary,&rdquo; or lost the original designer who knew why every decision was made. The brand didn&apos;t fail. It just stopped being explained.</p>

      <p>We have a rule we apply before we agree to any rebrand: we ask the client to give us a tour of the current identity. Not a critique — a tour. What does this colour mean? Why this typeface and not another? What did you want people to feel when they first saw this? Usually within twenty minutes, a rebranding project becomes a recalibration project. The work is still there. The logic is still there. What was missing was someone to translate it.</p>

      <blockquote className="post-pullquote">&ldquo;A new mark on a confused company is still a confused company. The brief comes to us because the team can&apos;t agree on what they look like.&rdquo;</blockquote>

      <p>This is the uncomfortable thing about rebrands: they are, more often than not, a symptom of something organisational. The brief comes to us because the team can&apos;t agree on what they look like, and they&apos;ve decided — reasonably, if optimistically — that a new visual identity will settle the argument. It won&apos;t. Or not for long.</p>

      <h2>The four signals we listen for</h2>

      <p><strong>One:</strong> Nobody can explain why the current brand looks the way it does. Not the founder, not the head of marketing, not the designer who updated it last February. It exists, and everyone uses it, and no one knows what it means.</p>

      <p><strong>Two:</strong> The brand has multiple unofficial versions in the wild and nobody has noticed. The investor deck uses a darker version of the navy. The website uses the old wordmark. The swag vendor was given a JPEG in 2021 and ran with it. The system has fractured, slowly, and the fractures have become normal.</p>

      <p><strong>Three:</strong> The most recent update was made by an intern during a quiet summer, and it somehow stuck. Nobody approved it. Nobody rejected it. It became the version.</p>

      <p><strong>Four:</strong> The client says &ldquo;I&apos;d know it when I see it&rdquo; when asked what they want. This is not a bad answer, exactly — it means the instinct is there, and instincts can be worked with. But it usually means the client has a feeling, not a brief, and the feeling is &ldquo;better.&rdquo;</p>

      <figure className="post-image">
        <div className="post-image__visual" style={{ background: 'var(--c-surface-soft)', minHeight: '280px' }}>
          <div style={{ textAlign: 'center', padding: '0 32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '24px' }}>The spectrum of the brief</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '560px', textAlign: 'left' }}>
              {[['Recalibrate', 'The idea is right. The execution drifted.'], ['Extend', 'The idea is right. The system never grew.'], ['Rethink', 'The idea itself has run out.']].map(([label, desc]) => (
                <div key={label} style={{ padding: '20px', background: 'var(--c-canvas)', borderRadius: '8px', border: '1px solid var(--c-hairline)' }}>
                  <div style={{ fontSize: '14px', fontVariationSettings: "'wght' 560", fontWeight: 560, marginBottom: '8px' }}>{label}</div>
                  <div style={{ fontSize: '12px', lineHeight: 1.5, opacity: 0.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <figcaption>Our internal framing before any engagement. Most briefs that arrive as &ldquo;rebrand&rdquo; are actually &ldquo;recalibrate.&rdquo;</figcaption>
      </figure>

      <h2>What we offer instead</h2>

      <p>These are not signs that the brand has failed. They&apos;re signs that the organisation lost track of what it was building, and the brand just got there first.</p>

      <p>What we offer in those cases is not a rebrand. It&apos;s closer to a translation. We read the existing system — even the inconsistent, apologetic, out-of-context version of it — and we find the idea that was always in there, half-expressed. We write it down. We extend it, carefully. And when the work is done, it usually doesn&apos;t look like a revolution. It looks like the thing it always should have been.</p>

      <p>The clients who insist on the revolution are not wrong to want it. Sometimes the existing brand is genuinely broken, or tied to something the company no longer is, or simply so anonymous that continuing to use it is a kind of institutional shrug. In those cases, we start from zero and we enjoy it. But we ask the questions first. The tour is always worth taking.</p>

      <hr className="post-rule" />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', opacity: 0.5 }}>Published in Issue 02 of the Afterthought Journal, April 2026. If you found this useful, the next issue comes out in July — <a href="/thinking#newsletter" style={{ color: 'inherit', borderBottom: '1px solid currentColor' }}>subscribe here</a>.</p>
    </div>
  )
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]

  if (!post) {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <p>Post not found. <a href="/thinking" style={{ borderBottom: '1px solid currentColor' }}>Back to journal →</a></p>
      </div>
    )
  }

  const related = (relatedSlugs[slug] ?? []).map(s => ({ slug: s, ...posts[s] })).filter(Boolean)

  return (
    <article>

      {/* ── HEADER ── */}
      <div className="container">
        <header className="post-header">
          <div className="post-header__eyebrow">
            <a href="/thinking">← Journal</a>
            <span className="post-header__byline-sep">·</span>
            <span>{post.category}</span>
            <span className="post-header__byline-sep">·</span>
            <span>{post.issue}</span>
          </div>
          <h1 className="display-xl post-header__title">{post.title}</h1>
          <div className="post-header__byline">
            <span>{post.authors}</span>
            <span className="post-header__byline-sep">·</span>
            <span>{post.date}</span>
            <span className="post-header__byline-sep">·</span>
            <span>{post.readTime}</span>
          </div>
        </header>
      </div>

      {/* ── HERO IMAGE ── */}
      <div className="container">
        <div className="post-hero-image" style={{ background: post.heroColor }}>
          <HeroVisual slug={slug} post={post} />
        </div>
      </div>

      {/* ── BODY ── */}
      <PostBody slug={slug} />

      {/* ── SUBSCRIBE ── */}
      <section className="container">
        <div className="color-block color-block--lime">
          <span className="eyebrow cb-eyebrow">The newsletter</span>
          <h2 className="cb-title display-lg">Once a quarter. Not a minute earlier.</h2>
          <p className="body-lg cb-body">We send a short letter four times a year — one of the essays above, two or three sentences about what we&apos;re making, and the occasional book recommendation.</p>
          <div style={{ marginTop: '36px' }}>
            <a className="btn btn-primary" href="/thinking#newsletter">Subscribe to the journal →</a>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <div className="container post-related">
          <span className="post-related__label">More from the journal</span>
          <div className="post-related__grid">
            {related.map(r => (
              <a key={r.slug} className="post-related__item" href={`/thinking/${r.slug}`}>
                <span className="post-related__item-cat">{r.category}</span>
                <span className="post-related__item-title">{r.title}</span>
                <span className="post-related__item-date">{r.date}</span>
              </a>
            ))}
          </div>
        </div>
      )}

    </article>
  )
}
