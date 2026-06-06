'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Toolbar from './Toolbar'

interface Props {
  content: object
  onChange: (json: object) => void
}

export default function PostEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ controls: true, nocookie: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Start writing your essay…' }),
    ],
    content: Object.keys(content).length ? content : undefined,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: { class: 'prose-content' },
    },
    immediatelyRender: false,
  })

  return (
    <div>
      <Toolbar editor={editor} />
      <div className="admin-tiptap-wrap">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
