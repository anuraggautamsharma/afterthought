import { slugify } from './slugify'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface ProseNode {
  type?: string
  text?: string
  attrs?: { level?: number }
  content?: ProseNode[]
}

function nodeText(node: ProseNode): string {
  if (node.type === 'text') return node.text ?? ''
  return (node.content ?? []).map(nodeText).join('')
}

/**
 * Extracts H2/H3 headings (in document order) from a TipTap doc, assigning each
 * a unique slug id. The same ids are injected into the rendered HTML by
 * PostRenderer, so the table-of-contents anchors line up.
 */
export function extractHeadings(content: unknown): TocHeading[] {
  const doc = content as ProseNode
  const top = doc?.content ?? []
  const out: TocHeading[] = []
  const seen = new Map<string, number>()

  for (const node of top) {
    const level = node.attrs?.level
    if (node.type === 'heading' && (level === 2 || level === 3)) {
      const text = nodeText(node).trim()
      if (!text) continue
      const base = slugify(text) || 'section'
      const n = seen.get(base) ?? 0
      seen.set(base, n + 1)
      out.push({ id: n === 0 ? base : `${base}-${n}`, text, level })
    }
  }
  return out
}
