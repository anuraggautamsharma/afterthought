import type { Metadata } from 'next'

interface PostMeta {
  title: string
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
  'the-future-of-design-belongs-to-the-messy-middle': {
    title: 'The Future of Design Belongs to the Messy Middle.',
    category: 'Essay',
    date: 'Jun 2026',
    issue: 'Issue 01',
    readTime: '8 min read',
    authors: 'Anurag Gautam & Tina Gidwani',
    excerpt: 'Design today lives in the space between speed and taste, automation and intuition, business pressure and creative freedom. That is where the real work begins.',
    heroColor: 'var(--c-block-navy)',
    heroTextColor: 'rgba(255,255,255,0.92)',
  },
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

function HeroVisual({ textColor }: { textColor: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 40px' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(48px, 7vw, 100px)', lineHeight: 0.96, letterSpacing: '-3px', color: textColor }}>
        The Messy<br />Middle.
      </div>
      <div style={{ marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: textColor, opacity: 0.35 }}>
        Issue 01 · June 2026
      </div>
    </div>
  )
}

function MessyMiddleEssay() {
  return (
    <div className="post-body container">

      <p className="post-lead">Design is no longer a straight line. It is not just brief, moodboard, wireframe, design, delivery. It is not just about making something look beautiful. And it is definitely not just about using the newest AI tool before everyone else does.</p>

      <p>Design today lives in the messy middle.</p>

      <p>The space between speed and taste.<br />
      Between automation and intuition.<br />
      Between business pressure and creative freedom.<br />
      Between what AI can generate and what only a designer can feel.</p>

      <p>At Afterthought, we believe this is where the real work begins.</p>

      <h2>AI can make design faster. But it cannot make it meaningful.</h2>

      <p>AI has changed the way designers work. It can generate options, speed up research, support ideation, create prototypes, and reduce the time spent on repetitive tasks. According to Figma&apos;s State of the Designer 2026 report, 89% of designers say AI helps them work faster, 80% say it improves collaboration, and 91% say AI tools improve their designs.</p>

      <p>But faster does not always mean better.</p>

      <p>A design can be produced quickly and still feel empty. A brand identity can look polished and still say nothing. A website can be technically impressive and still fail to create trust.</p>

      <p>That is why the designer&apos;s role is becoming more important, not less.</p>

      <blockquote className="post-pullquote">
        &ldquo;AI can give you outputs. But designers give those outputs direction. AI can create variation. But designers create meaning.&rdquo;
      </blockquote>

      <h2>Craft is the new difference between average and unforgettable.</h2>

      <p>When everyone has access to the same tools, taste becomes the real advantage.</p>

      <p>The future will not belong to the people who simply know how to prompt better. It will belong to the people who know what to keep, what to remove, what to refine, and what to protect.</p>

      <p>Craft is not just decoration.</p>

      <p>Craft is the small decision that makes a brand feel premium. The pause in an animation that makes the story land. The spacing that makes a layout breathe. The typography that makes a message feel confident. The visual system that makes a company look like it knows where it is going.</p>

      <p>In Figma&apos;s research, designers connected craft with visual polish, thoughtful problem-solving, intuitive UX, emotion, delight, and consistency. For us, craft is simpler than that:</p>

      <blockquote className="post-pullquote">
        &ldquo;Craft is care made visible. It is what separates a design that was made from a design that was considered.&rdquo;
      </blockquote>

      <h2>Creative freedom is not a luxury. It is how better work happens.</h2>

      <p>Great design needs freedom. Not chaos. Not random exploration. Not endless experimentation without direction. But the kind of freedom where designers are trusted to think, question, challenge, and shape the final outcome.</p>

      <p>Figma&apos;s report notes that creative autonomy is a major contributor to designer satisfaction, with 87% of designers saying decision-making power helps them do their best work. At the same time, 91% say clear goals and expectations help them perform better.</p>

      <p>That balance matters. Creative teams do not need micromanagement. They need clarity. They need to know the business goal, the audience, the problem, the positioning, and the emotional response the work should create. Once that is clear, the best ideas usually come when designers are given room to think beyond the obvious.</p>

      <p>At Afterthought, we do not see design as execution alone. We see it as strategy made visible.</p>

      <h2>The best designers are becoming translators.</h2>

      <p>The designer of 2026 is not just someone who makes screens, logos, posts, or motion graphics. The designer is becoming a translator.</p>

      <p>A translator of business goals into visual systems.<br />
      A translator of audience behaviour into experience.<br />
      A translator of brand personality into design language.<br />
      A translator of abstract ideas into things people can see, feel, and remember.</p>

      <p>This is why the messy middle matters. Because most brands do not fail because they lack visuals. They fail because their visuals do not have a point of view.</p>

      <p>They look correct, but not distinct. They look modern, but not memorable. They look expensive, but not meaningful.</p>

      <p>In a world where AI can generate endless creative options, the strongest brands will not be the ones with the most content. They will be the ones with the clearest taste.</p>

      <h2>What this means for brands.</h2>

      <p>For founders, marketers, and growing companies, the message is clear: do not use design only when something needs to &ldquo;look good.&rdquo;</p>

      <p>Bring design into the room earlier.</p>

      <p>Use it when you are defining your positioning. Use it when you are shaping your product experience. Use it when you are building trust. Use it when you are trying to explain why your brand should matter.</p>

      <p>Because design is no longer the final layer. It is part of the thinking. The brands that understand this will move faster, communicate better, and build stronger emotional memory in the minds of their audience.</p>

      <h2>The Afterthought perspective.</h2>

      <p>At Afterthought, we are interested in the work that happens after the obvious idea.</p>

      <p>After the first reference.<br />
      After the first draft.<br />
      After the easy visual.<br />
      After the trend everyone is already copying.</p>

      <p>That is where better design usually begins.</p>

      <p>We use tools, systems, AI, research, motion, strategy, and storytelling. But the goal is never just output. The goal is to create work with intention. Work that feels sharp. Work that feels considered. Work that gives a brand a stronger voice. Work that helps businesses look as serious as the value they provide.</p>

      <p>Because the future of design is not just faster. It is more thoughtful. And in a world full of instant visuals, thoughtfulness may become the rarest form of craft.</p>

      <hr className="post-rule" />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', opacity: 0.5 }}>Published in Issue 01 of the Afterthought Journal, June 2026. If you found this useful, subscribe below — the next issue comes out in September.</p>

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

  const textColor = post.heroTextColor ?? 'var(--c-ink)'

  return (
    <article>

      {/* ── FULL-BLEED HERO ── */}
      <div className="post-hero-full" style={{ background: post.heroColor }}>
        <HeroVisual textColor={textColor} />
      </div>

      {/* ── TITLE STRIP ── */}
      <div className="container">
        <div className="post-title">
          <div className="post-title__eyebrow">
            <a href="/thinking">← Journal</a>
            <span className="post-title__sep">·</span>
            <span>{post.category}</span>
            <span className="post-title__sep">·</span>
            <span>{post.issue}</span>
          </div>
          <h1 className="display-xl post-title__h1">{post.title}</h1>
          <div className="post-title__byline">
            <span>{post.authors}</span>
            <span className="post-title__sep">·</span>
            <span>{post.date}</span>
            <span className="post-title__sep">·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <MessyMiddleEssay />

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

    </article>
  )
}
