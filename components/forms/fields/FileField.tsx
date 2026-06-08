'use client'

import { useRef, useState, DragEvent } from 'react'
import { FormField } from '@/lib/forms'
import { uploadFormFileAction } from '@/app/forms/[slug]/actions'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

interface StoredFile {
  name: string
  size: number
  type: string
  path: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileField({ field, value, onChange, readOnly }: FieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<{ name: string; size: number }[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const config = field.file_config
  const maxFiles = config?.max_files ?? 1
  const maxSizeMb = config?.max_size_mb ?? 10
  const acceptedTypes = config?.accepted_types ?? []

  const files: StoredFile[] = Array.isArray(value)
    ? (value as StoredFile[]).filter(f => f && typeof f === 'object' && 'path' in f)
    : []

  const disabled = readOnly || field.read_only
  const busy = uploading.length > 0

  async function processFiles(fileList: FileList | null) {
    if (!fileList || disabled) return
    setErrorMsg('')

    // Client-side size gate first (instant feedback before any upload).
    const toUpload: File[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      if (files.length + toUpload.length >= maxFiles) break
      if (f.size > maxSizeMb * 1024 * 1024) {
        setErrorMsg(`“${f.name}” is too large — max ${maxSizeMb} MB.`)
        continue
      }
      toUpload.push(f)
    }
    if (toUpload.length === 0) return

    setUploading(toUpload.map(f => ({ name: f.name, size: f.size })))
    const uploaded: StoredFile[] = []
    for (const f of toUpload) {
      const fd = new FormData()
      fd.append('file', f)
      fd.append('formId', field.form_id)
      fd.append('maxMb', String(maxSizeMb))
      try {
        const res = await uploadFormFileAction(fd)
        if (res.ok && res.file) uploaded.push(res.file as StoredFile)
        else setErrorMsg(res.error ?? `Couldn’t upload “${f.name}”.`)
      } catch {
        setErrorMsg(`Couldn’t upload “${f.name}”. Please try again.`)
      }
    }
    setUploading([])

    if (uploaded.length > 0) {
      const combined = maxFiles === 1 ? uploaded : [...files, ...uploaded]
      onChange(combined.slice(0, maxFiles))
    }
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index)
    onChange(next)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const acceptAttr = acceptedTypes.length > 0 ? acceptedTypes.join(',') : undefined

  return (
    <div className="form-file-field">
      {!disabled && files.length < maxFiles && (
        <div
          className={`form-file-zone${dragging ? ' form-file-zone--dragging' : ''}${busy ? ' form-file-zone--busy' : ''}`}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); if (!busy) setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => !busy && handleDrop(e)}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (!busy && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click() }}
          aria-label="Upload files"
        >
          {busy ? (
            <>
              <div className="form-file-zone__spinner" />
              <p className="form-file-zone__text">Uploading…</p>
            </>
          ) : (
            <>
              <div className="form-file-zone__icon">↑</div>
              <p className="form-file-zone__text">
                <span className="form-file-zone__cta">Click to browse</span>
                {' '}or drag &amp; drop
              </p>
              {acceptedTypes.length > 0 && (
                <p className="form-file-zone__hint">{acceptedTypes.join(', ')}</p>
              )}
              <p className="form-file-zone__hint">Max {maxSizeMb} MB per file</p>
              {maxFiles > 1 && (
                <p className="form-file-zone__hint">Up to {maxFiles} files</p>
              )}
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            multiple={maxFiles > 1}
            style={{ display: 'none' }}
            onChange={e => processFiles(e.target.files)}
          />
        </div>
      )}

      {errorMsg && <p className="form-file-error">{errorMsg}</p>}

      {(files.length > 0 || uploading.length > 0) && (
        <ul className="form-file-list">
          {files.map((f, i) => (
            <li key={`f-${i}`} className="form-file-item">
              <span className="form-file-item__name">{f.name}</span>
              <span className="form-file-item__size">{formatBytes(f.size)}</span>
              {!disabled && (
                <button
                  type="button"
                  className="form-file-item__remove"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${f.name}`}
                >
                  ×
                </button>
              )}
            </li>
          ))}
          {uploading.map((f, i) => (
            <li key={`u-${i}`} className="form-file-item form-file-item--uploading">
              <span className="form-file-item__name">{f.name}</span>
              <span className="form-file-item__size">{formatBytes(f.size)} · uploading…</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
