import { getPublishedPostsIndex } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** RSS 2.0 feed of the journal — latest 20 published essays. */
export async function GET() {
  const { posts } = await getPublishedPostsIndex(1, 20)

  const items = posts.map(p => {
    const url = `${SITE_URL}/thinking/${p.slug}/`
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}
      <category>${esc(p.category)}</category>
      ${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ''}
      ${p.cover_image ? `<enclosure url="${esc(p.cover_image)}" type="image/png" length="0"/>` : ''}
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Afterthought — Thinking</title>
    <link>${SITE_URL}/thinking/</link>
    <description>Essays on design, craft, and practice from the Afterthought studio.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
    },
  })
}
