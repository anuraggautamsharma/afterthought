'use client'

import { useRef, useState, DragEvent } from 'react'
import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

interface FileEntry {
  name: string
  size: number
  type: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileField({ field, value, onChange, readOnly }: FieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const config = field.file_config
  const maxFiles = config?.max_files ?? 1
  const maxSizeMb = config?.max_size_mb ?? 10
  const acceptedTypes = config?.accepted_types ?? []

  const files: FileEntry[] = Array.isArray(value) ? (value as FileEntry[]) : []

  function processFiles(fileList: FileList | null) {
    if (!fileList || readOnly || field.read_only) return
    const newEntries: FileEntry[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      if (files.length + newEntries.length >= maxFiles) break
      if (f.size > maxSizeMb * 1024 * 1024) continue
      newEntries.push({ name: f.name, size: f.size, type: f.type })
    }
    if (newEntries.length > 0) {
      const combined = maxFiles === 1 ? newEntries : [...files, ...newEntries]
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
      {!readOnly && !field.read_only && files.length < maxFiles && (
        <div
          className={`form-file-zone${dragging ? ' form-file-zone--dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
          aria-label="Upload files"
        >
          <div className="form-file-zone__icon">↑</div>
          <p className="form-file-zone__text">
            <span className="form-file-zone__cta">Click to browse</span>
            {' '}or drag & drop
          </p>
          {acceptedTypes.length > 0 && (
            <p className="form-file-zone__hint">{acceptedTypes.join(', ')}</p>
          )}
          <p className="form-file-zone__hint">Max {maxSizeMb} MB per file</p>
          {maxFiles > 1 && (
            <p className="form-file-zone__hint">Up to {maxFiles} files</p>
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
      {files.length > 0 && (
        <ul className="form-file-list">
          {files.map((f, i) => (
            <li key={i} className="form-file-item">
              <span className="form-file-item__name">{f.name}</span>
              <span className="form-file-item__size">{formatBytes(f.size)}</span>
              {!readOnly && !field.read_only && (
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
        </ul>
      )}
    </div>
  )
}
