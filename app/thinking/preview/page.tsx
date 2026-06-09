import type { Metadata } from 'next'
import PostRenderer from '@/components/thinking/PostRenderer'
import TableOfContents from '@/components/thinking/TableOfContents'
import ShareRow from '@/components/thinking/ShareRow'
import { extractHeadings } from '@/lib/toc'

// TEMPORARY preview route — exercises every content element the editor/MCP can
// emit, so the public post styling can be reviewed on real markup. Unlisted
// (not in DB → not in sitemap/listings) and noindex. Safe to delete.

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Content preview — Afterthought',
  robots: { index: false, follow: false },
}

const sample = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'This is a lead paragraph — the opening of an essay. It sets the tone and should read comfortably at the larger reading size, with generous line-height and the calm, low-contrast weight the studio uses throughout.' }] },
    { type: 'paragraph', content: [
      { type: 'text', text: 'A normal body paragraph follows. It can contain ' },
      { type: 'text', marks: [{ type: 'bold' }], text: 'bold emphasis' },
      { type: 'text', text: ', some ' },
      { type: 'text', marks: [{ type: 'italic' }], text: 'italic phrasing' },
      { type: 'text', text: ', and an ' },
      { type: 'text', marks: [{ type: 'link', attrs: { href: 'https://www.afterthought.design/work/' } }], text: 'inline link to the work page' },
      { type: 'text', text: ' that should sit quietly in the column rather than shouting in default blue.' },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'A section heading (H2)' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Sections break up a long read. The heading above is the primary structural marker; below it, smaller subheadings can organise the detail.' }] },
    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'A subheading (H3)' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Lists should match the body type — same size, same weight, with restrained markers:' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A first bullet point with a complete thought.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A second point that runs a little longer to confirm the line-height and spacing read well across multiple lines of wrapped text.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A third, shorter one.' }] }] },
    ] },
    { type: 'paragraph', content: [{ type: 'text', text: 'And a numbered sequence:' }] },
    { type: 'orderedList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Listen, write, set aside.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'First round, second thought.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Build the actual thing.' }] }] },
    ] },
    { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Saying no is how we stay good at what we say yes to.' }] }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'An image sits full-width in the reading column, with rounded corners and breathing room above and below:' }] },
    { type: 'image', attrs: { src: 'https://picsum.photos/1200/675', alt: 'Placeholder image' } },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Media inside a post' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'A video embed should be responsive — a clean 16:9 box, not a fixed 640×480 frame:' }] },
    { type: 'youtube', attrs: { src: 'https://www.youtube.com/watch?v=bMknfKXIFA8' } },
    { type: 'horizontalRule' },
    { type: 'heading', attrs: { level: 4 }, content: [{ type: 'text', text: 'Minor label (H4)' }] },
    { type: 'paragraph', content: [
      { type: 'text', text: 'Occasionally a post needs ' },
      { type: 'text', marks: [{ type: 'code' }], text: 'inline code' },
      { type: 'text', text: ', and sometimes a whole block of it:' },
    ] },
    { type: 'codeBlock', content: [{ type: 'text', text: 'const studio = "Afterthought"\nconsole.log(`Hello from ${studio}`)' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'And a closing paragraph to end the piece.' }] },
  ],
}

export default function PreviewPage() {
  const headings = extractHeadings(sample)
  return (
    <article>
      <div className="post-hero-full" style={{ background: 'var(--c-block-navy)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 1.0, letterSpacing: '-3px', color: 'rgba(255,255,255,0.92)' }}>
              Content styling preview
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="post-title">
          <div className="post-title__eyebrow">
            <a href="/thinking">← Journal</a>
            <span className="post-title__sep">·</span>
            <span>Preview</span>
          </div>
          <h1 className="display-xl post-title__h1">Every element, one page</h1>
          <div className="post-title__byline">
            <span>Afterthought</span>
            <span className="post-title__sep">·</span>
            <span>Internal preview</span>
            <span className="post-title__sep">·</span>
            <span>3 min read</span>
          </div>
        </div>
      </div>

      <div className="post-main post-main--toc">
        <TableOfContents headings={headings} />
        <PostRenderer content={sample} bare />
      </div>

      <div className="container">
        <ShareRow url="https://www.afterthought.design/thinking/preview/" title="Every element, one page" />
      </div>
    </article>
  )
}
