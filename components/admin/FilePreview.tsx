'use client'

import { useState } from 'react'
import Icon from '@/components/Icon'

interface Props {
  name: string
  type?: string
  url?: string
}

export default function FilePreview({ name, type, url }: Props) {
  const [open, setOpen] = useState(false)

  if (!url) {
    return (
      <span className="admin-filepreview__missing" title="This file was attached before uploads were stored">
        {name} <span style={{ opacity: 0.5 }}>(not stored)</span>
      </span>
    )
  }

  const t = type ?? ''
  const isImage = t.startsWith('image/') || /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name)
  const isPdf = t === 'application/pdf' || /\.pdf$/i.test(name)
  const canPreview = isImage || isPdf

  return (
    <div className="admin-filepreview">
      <div className="admin-filepreview__bar">
        <Icon name={isImage ? 'image' : isPdf ? 'picture_as_pdf' : 'description'} size={16} className="admin-filepreview__icon" />
        <span className="admin-filepreview__name">{name}</span>
        {canPreview && (
          <button type="button" className="admin-filepreview__btn" onClick={() => setOpen(o => !o)}>
            {open ? 'Hide' : 'Preview'}
          </button>
        )}
        <a className="admin-filepreview__btn" href={url} target="_blank" rel="noopener noreferrer">Open ↗</a>
        <a className="admin-filepreview__btn" href={url} download={name}>Download ↓</a>
      </div>

      {open && isImage && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="admin-filepreview__imgwrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={name} className="admin-filepreview__img" />
        </a>
      )}
      {open && isPdf && (
        <iframe src={url} title={name} className="admin-filepreview__pdf" />
      )}
    </div>
  )
}
