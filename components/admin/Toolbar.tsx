'use client'

import { type Editor } from '@tiptap/react'

interface Props { editor: Editor | null }

export default function Toolbar({ editor }: Props) {
  if (!editor) return null

  const addImage = () => {
    const url = prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addYoutube = () => {
    const url = prompt('YouTube or Vimeo URL:')
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href
    const url  = prompt('URL:', prev)
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="admin-toolbar">
      {/* Text style */}
      <button type="button" className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">B</button>
      <button type="button" className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><em>I</em></button>
      <button type="button" className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('link') ? 'is-active' : ''}`}
        onClick={setLink} title="Link">⌘K</button>

      <div className="admin-toolbar__sep" />

      {/* Headings */}
      <button type="button"
        className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button"
        className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

      <div className="admin-toolbar__sep" />

      {/* Blocks */}
      <button type="button"
        className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">≡</button>
      <button type="button"
        className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1.</button>
      <button type="button"
        className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Pull quote">&ldquo;</button>
      <button type="button"
        className="admin-toolbar-btn admin-toolbar-btn--wide"
        onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">—</button>

      <div className="admin-toolbar__sep" />

      {/* Media */}
      <button type="button" className="admin-toolbar-btn admin-toolbar-btn--wide"
        onClick={addImage} title="Add image">IMG</button>
      <button type="button" className="admin-toolbar-btn admin-toolbar-btn--wide"
        onClick={addYoutube} title="Embed video">▶</button>
    </div>
  )
}
