'use client'

import { useState } from 'react'

export default function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const enc = encodeURIComponent
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`
  const x = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="post-share">
      <span className="post-share__label">Share</span>
      <div className="post-share__row">
        <button type="button" className="post-share__btn" onClick={copy} aria-label="Copy link">
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
        <a className="post-share__btn" href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="post-share__btn" href={x} target="_blank" rel="noopener noreferrer">X</a>
      </div>
    </div>
  )
}
