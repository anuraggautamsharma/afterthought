'use client'

import { useState } from 'react'
import { type Editor } from '@tiptap/react'
import ImagePicker from './ImagePicker'

interface Props { editor: Editor | null }

export default function Toolbar({ editor }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)

  if (!editor) return null

  const handleImageSelect = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run()
  }

  const addYoutube = () => {
    const url = prompt('YouTube URL:')
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
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar__group">
          <button type="button" aria-label="Bold"
            className={`admin-toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}>
            <strong>B</strong>
          </button>
          <button type="button" aria-label="Italic"
            className={`admin-toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}>
            <em>I</em>
          </button>
          <button type="button" aria-label="Link"
            className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('link') ? 'is-active' : ''}`}
            onClick={setLink}>
            Link
          </button>
        </div>

        <div className="admin-toolbar__sep" />

        <div className="admin-toolbar__group">
          <button type="button" aria-label="Heading 2"
            className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            H2
          </button>
          <button type="button" aria-label="Heading 3"
            className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            H3
          </button>
        </div>

        <div className="admin-toolbar__sep" />

        <div className="admin-toolbar__group">
          <button type="button" aria-label="Bullet list"
            className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}>
            • List
          </button>
          <button type="button" aria-label="Numbered list"
            className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            1. List
          </button>
          <button type="button" aria-label="Blockquote"
            className={`admin-toolbar-btn admin-toolbar-btn--wide ${editor.isActive('blockquote') ? 'is-active' : ''}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            Quote
          </button>
          <button type="button" aria-label="Divider"
            className="admin-toolbar-btn admin-toolbar-btn--wide"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            ——
          </button>
        </div>

        <div className="admin-toolbar__sep" />

        <div className="admin-toolbar__group">
          <button type="button" aria-label="Insert image"
            className="admin-toolbar-btn admin-toolbar-btn--wide"
            onClick={() => setPickerOpen(true)}>
            Image
          </button>
          <button type="button" aria-label="Embed video"
            className="admin-toolbar-btn admin-toolbar-btn--wide"
            onClick={addYoutube}>
            Video
          </button>
        </div>
      </div>

      <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleImageSelect} />
    </>
  )
}
