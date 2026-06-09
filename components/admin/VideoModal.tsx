'use client'

import { useEffect, useState } from 'react'

function isValidVideoUrl(url: string): boolean {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|vimeo\.com\/)/i.test(url)
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (url: string) => void
}

export default function VideoModal({ open, onClose, onSubmit }: Props) {
  const [url, setUrl] = useState('')

  useEffect(() => { if (open) setUrl('') }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const valid = isValidVideoUrl(url.trim())
  const submit = () => { if (valid) { onSubmit(url.trim()); onClose() } }

  return (
    <div className="image-picker-overlay" onClick={onClose}>
      <div className="image-picker-modal image-picker-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="image-picker-header">
          <span className="image-picker-title">Embed a video</span>
          <button type="button" className="image-picker-close" onClick={onClose}>✕</button>
        </div>
        <div className="video-modal__body">
          <label className="video-modal__label">YouTube or Vimeo link</label>
          <input
            className="video-modal__input"
            autoFocus
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
            placeholder="https://www.youtube.com/watch?v=…"
          />
          <p className="video-modal__hint">
            {url.trim() && !valid
              ? 'That doesn’t look like a YouTube or Vimeo link.'
              : 'It will appear as a responsive player in your post.'}
          </p>
          <div className="video-modal__actions">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="admin-btn-primary" disabled={!valid} onClick={submit}>Embed video</button>
          </div>
        </div>
      </div>
    </div>
  )
}
