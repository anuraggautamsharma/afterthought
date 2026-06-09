'use client'

import { useEffect } from 'react'
import MediaLibrary from './MediaLibrary'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function ImagePicker({ open, onClose, onSelect }: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const handleSelect = (url: string) => {
    onSelect(url)
    onClose()
  }

  return (
    <div className="image-picker-overlay" onClick={onClose}>
      <div className="image-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="image-picker-header">
          <span className="image-picker-title">Select image</span>
          <span className="image-picker-hint">Use images ~1600px wide for crisp results</span>
          <button type="button" className="image-picker-close" onClick={onClose}>✕</button>
        </div>
        <div className="image-picker-body">
          <MediaLibrary selectable onSelect={handleSelect} />
        </div>
      </div>
    </div>
  )
}
