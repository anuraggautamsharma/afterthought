import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'

const extensions = [StarterKit, Image, Youtube, Link]

export default function PostRenderer({ content }: { content: object }) {
  if (!content || !Object.keys(content).length) return null

  const html = generateHTML(content as Parameters<typeof generateHTML>[0], extensions)

  return (
    <div className="post-body container" dangerouslySetInnerHTML={{ __html: html }} />
  )
}
