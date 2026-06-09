'use client'

import { useState } from 'react'

export default function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* user cancelled — no-op */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <button type="button" className="post-share-btn" onClick={share} aria-label="Share this article">
      <span className="material-symbols-outlined" aria-hidden>ios_share</span>
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}
