import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import { extractHeadings } from '@/lib/toc'

const extensions = [StarterKit, Image, Youtube, Link]

export default function PostRenderer({ content, bare = false }: { content: object; bare?: boolean }) {
  if (!content || !Object.keys(content).length) return null

  let html = generateHTML(content as Parameters<typeof generateHTML>[0], extensions)

  // Inject anchor ids onto H2/H3 so the table of contents can link to them.
  // Ids come from the same util the TOC uses, so they always match (in order).
  const headings = extractHeadings(content)
  let i = 0
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (m, lvl, inner) => {
    if (!String(inner).replace(/<[^>]+>/g, '').trim()) return m
    const id = headings[i++]?.id
    return id ? `<h${lvl} id="${id}">${inner}</h${lvl}>` : m
  })

  return (
    <div className={bare ? 'post-body' : 'post-body container'} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
