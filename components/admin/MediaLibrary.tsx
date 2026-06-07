'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { uploadMediaAction, listMediaAction, deleteMediaAction } from '@/app/admin/media/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'

interface MediaItem {
  name: string
  url: string
  size: number
  createdAt: string
}

interface Props {
  selectable?: boolean
  onSelect?: (url: string) => void
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function MediaLibrary({ selectable, onSelect }: Props) {
  const [items, setItems]               = useState<MediaItem[]>([])
  const [loading, setLoading]           = useState(true)
  const [dragging, setDragging]         = useState(false)
  const [copied, setCopied]             = useState<string | null>(null)
  const [error, setError]               = useState<string | null>(null)
  const [uploadCount, setUploadCount]   = useState(0)
  const [totalCount, setTotalCount]     = useState(0)
  const fileInputRef                    = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await listMediaAction()
    setItems(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const upload = async (files: FileList | File[]) => {
    const arr = Array.from(files)
    if (!arr.length) return
    setTotalCount(arr.length)
    setUploadCount(arr.length)
    setError(null)
    for (const file of arr) {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadMediaAction(fd)
      if ('error' in result) {
        toast.error(result.error)
        setError(result.error)
        break
      }
      setUploadCount(prev => prev - 1)
    }
    await load()
    setUploadCount(0)
    setTotalCount(0)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    upload(e.dataTransfer.files)
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async (name: string) => {
    const confirmed = await openConfirm({
      title: `Delete "${name}"?`,
      message: 'This file will be permanently removed.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!confirmed) return
    const result = await deleteMediaAction(name)
    if ('error' in result) {
      toast.error(result.error)
      setError(result.error)
      return
    }
    setItems(prev => prev.filter(i => i.name !== name))
  }

  const uploading = uploadCount > 0

  return (
    <div className="media-library">
      {error && (
        <div className="media-error">{error}</div>
      )}

      {/* Upload zone */}
      <div
        className={`media-upload-zone ${dragging ? 'is-dragging' : ''} ${uploading ? 'is-uploading' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => e.target.files && upload(e.target.files)}
        />
        <div className="media-upload-zone__icon">
          {uploading ? (
            <div className="media-upload-spinner" />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          )}
        </div>
        <p className="media-upload-zone__text">
          {uploading
            ? `Uploading ${totalCount - uploadCount + 1} of ${totalCount}…`
            : 'Drop images here or click to upload'}
        </p>
        <p className="media-upload-zone__hint">PNG, JPG, GIF, WebP, SVG</p>
        {uploading && (
          <div className="media-upload-progress">
            <div className="media-upload-progress__bar" />
          </div>
        )}
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="media-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="media-item media-item--skeleton">
              <div className="media-skeleton-thumb" />
              <div className="media-skeleton-info">
                <div className="media-skeleton-line" />
                <div className="media-skeleton-line media-skeleton-line--short" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="media-empty">No images uploaded yet</div>
      ) : (
        <div className="media-grid">
          {items.map(item => (
            <div
              key={item.name}
              className={`media-item ${selectable ? 'media-item--selectable' : ''}`}
              onClick={() => selectable && onSelect?.(item.url)}
            >
              <div className="media-item__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} loading="lazy" />
              </div>
              <div className="media-item__info">
                <span className="media-item__name" title={item.name}>{item.name}</span>
                <span className="media-item__size">{formatBytes(item.size)}</span>
              </div>
              {!selectable && (
                <div className="media-item__actions">
                  <button
                    type="button"
                    className="media-item__btn"
                    onClick={e => { e.stopPropagation(); handleCopy(item.url) }}
                  >
                    {copied === item.url ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    className="media-item__btn media-item__btn--danger"
                    onClick={e => { e.stopPropagation(); handleDelete(item.name) }}
                  >
                    Delete
                  </button>
                </div>
              )}
              {selectable && (
                <div className="media-item__select-overlay">
                  <span>Select</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
