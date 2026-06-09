'use client'

import { useState } from 'react'
import { type Editor } from '@tiptap/react'
import { FloatingMenu } from '@tiptap/react/menus'
import ImagePicker from './ImagePicker'
import VideoModal from './VideoModal'

interface Props { editor: Editor | null }

export default function Toolbar({ editor }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  if (!editor) return null

  const insertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run()
  }
  const insertVideo = (url: string) => {
    editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href
    const url  = prompt('URL:', prev)
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }

  // Only show the floating insert menu on a truly empty paragraph line.
  const showInsertMenu = () => {
    const { selection } = editor.state
    if (!selection.empty) return false
    const node = selection.$anchor.parent
    return node.type.name === 'paragraph' && node.content.size === 0
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
            className="admin-toolbar-btn admin-toolbar-btn--icon"
            onClick={() => setPickerOpen(true)}>
            <span className="material-symbols-outlined" aria-hidden>image</span>
            Image
          </button>
          <button type="button" aria-label="Embed video"
            className="admin-toolbar-btn admin-toolbar-btn--icon"
            onClick={() => setVideoOpen(true)}>
            <span className="material-symbols-outlined" aria-hidden>smart_display</span>
            Video
          </button>
        </div>
      </div>

      {/* Floating insert menu — appears on empty lines (Notion-style) */}
      <FloatingMenu editor={editor} shouldShow={showInsertMenu} options={{ placement: 'bottom-start', offset: 6 }}>
        <div className="editor-insert">
          <button type="button" className="editor-insert__btn" onClick={() => setPickerOpen(true)}>
            <span className="material-symbols-outlined" aria-hidden>image</span>Image
          </button>
          <button type="button" className="editor-insert__btn" onClick={() => setVideoOpen(true)}>
            <span className="material-symbols-outlined" aria-hidden>smart_display</span>Video
          </button>
          <button type="button" className="editor-insert__btn" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <span className="material-symbols-outlined" aria-hidden>title</span>Heading
          </button>
          <button type="button" className="editor-insert__btn" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <span className="material-symbols-outlined" aria-hidden>format_quote</span>Quote
          </button>
          <button type="button" className="editor-insert__btn" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <span className="material-symbols-outlined" aria-hidden>horizontal_rule</span>Divider
          </button>
        </div>
      </FloatingMenu>

      <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={insertImage} />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} onSubmit={insertVideo} />
    </>
  )
}
