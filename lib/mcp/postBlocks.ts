// Converts a simple, AI-friendly block list into TipTap doc JSON for posts.
// Inline text supports **bold**, *italic* and [label](url).

export interface PostBlock {
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'bullet_list' | 'ordered_list' | 'divider' | 'mermaid'
  text?: string
  level?: number
  url?: string
  alt?: string
  ratio?: 'natural' | '16-9' | 'square'
  items?: string[]
}

type TextNode = { type: 'text'; text: string; marks?: { type: string; attrs?: Record<string, unknown> }[] }

/** Parses inline **bold**, *italic*, [label](url) into TipTap text nodes. */
export function parseInline(text = ''): TextNode[] {
  const nodes: TextNode[] = []
  const push = (t: string, marks?: TextNode['marks']) => {
    if (t) nodes.push(marks ? { type: 'text', text: t, marks } : { type: 'text', text: t })
  }
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) push(text.slice(last, m.index))
    if (m[1]) push(m[2], [{ type: 'link', attrs: { href: m[3] } }])
    else if (m[4]) push(m[5], [{ type: 'bold' }])
    else if (m[6]) push(m[7], [{ type: 'italic' }])
    last = re.lastIndex
  }
  if (last < text.length) push(text.slice(last))
  return nodes
}

function para(text?: string) {
  const content = parseInline(text ?? '')
  return content.length ? { type: 'paragraph', content } : { type: 'paragraph' }
}

function listItems(items: string[] = []) {
  return items.filter(i => i.trim()).map(i => ({ type: 'listItem', content: [para(i)] }))
}

function blockToNode(b: PostBlock): object | null {
  switch (b.type) {
    case 'paragraph':
      return para(b.text)
    case 'heading':
      return { type: 'heading', attrs: { level: b.level === 3 ? 3 : 2 }, content: parseInline(b.text ?? '') }
    case 'image':
      if (!b.url) return null
      return { type: 'image', attrs: { src: b.url, alt: b.alt ?? '', ratio: b.ratio ?? 'natural' } }
    case 'video':
      if (!b.url) return null
      return { type: 'youtube', attrs: { src: b.url } }
    case 'quote':
      return { type: 'blockquote', content: [para(b.text)] }
    case 'bullet_list':
      return { type: 'bulletList', content: listItems(b.items) }
    case 'ordered_list':
      return { type: 'orderedList', content: listItems(b.items) }
    case 'divider':
      return { type: 'horizontalRule' }
    case 'mermaid':
      if (!b.text?.trim()) return null
      // Stored as a fenced code block; the post page renders it to SVG.
      return { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: b.text }] }
    default:
      return null
  }
}

/** Builds a TipTap doc from blocks. */
export function buildPostContent(blocks: PostBlock[]): object {
  const content = blocks.map(blockToNode).filter(Boolean)
  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] }
}

/** Fallback: plain text → paragraphs (blank line separated). */
export function plainTextToContent(body: string): object {
  const paras = (body || '').split(/\n\n+/).map(p => p.trim()).filter(Boolean)
  return {
    type: 'doc',
    content: paras.length ? paras.map(p => ({ type: 'paragraph', content: parseInline(p) })) : [{ type: 'paragraph' }],
  }
}
