'use client'

import { useState, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { getFormUsageAction, type FormShareInfo } from '@/app/admin/forms/actions'
import { toast } from '@/lib/toastStore'

interface Props {
  formId: string
  slug: string
  status: 'draft' | 'published' | 'closed'
  /** Visual style of the trigger button. */
  variant?: 'ghost' | 'secondary'
  label?: string
}

export default function ShareFormButton({ formId, slug, status, variant = 'ghost', label = 'Share' }: Props) {
  const [open, setOpen] = useState(false)
  const [info, setInfo] = useState<FormShareInfo | null>(null)
  const [qr, setQr] = useState<string>('')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const publicUrl = origin ? `${origin}/forms/${info?.slug ?? slug}` : ''
  const embedCode = publicUrl
    ? `<iframe src="${publicUrl}" width="100%" height="700" frameborder="0" style="border:0;border-radius:12px"></iframe>`
    : ''

  // Load usage info + QR when the modal opens
  useEffect(() => {
    if (!open) return
    getFormUsageAction(formId).then(setInfo).catch(() => {})
  }, [open, formId])

  useEffect(() => {
    if (!open || !publicUrl) return
    QRCode.toDataURL(publicUrl, { width: 320, margin: 1 })
      .then(setQr)
      .catch(() => setQr(''))
  }, [open, publicUrl])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const copy = useCallback((text: string, what: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${what} copied`),
      () => toast.error('Copy failed'),
    )
  }, [])

  const downloadQr = useCallback(() => {
    if (!qr) return
    const a = document.createElement('a')
    a.href = qr
    a.download = `${info?.slug ?? slug}-qr.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [qr, info?.slug, slug])

  const usageText = (() => {
    if (!info) return null
    switch (info.usage.kind) {
      case 'page': return `Live on your ${info.usage.label} (${info.usage.path})`
      case 'job': return `Application form for “${info.usage.label}” (${info.usage.path})`
      case 'standalone': return 'Standalone — shared via link, QR or embed'
    }
  })()

  return (
    <>
      <button
        type="button"
        className={variant === 'secondary' ? 'admin-btn-secondary' : 'admin-btn-ghost'}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      {open && (
        <div className="admin-share-backdrop" onClick={() => setOpen(false)}>
          <div className="admin-share" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="admin-share__head">
              <h2 className="admin-share__title">Share form</h2>
              <button type="button" className="admin-share__close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            {status !== 'published' && (
              <div className="admin-share__notice">
                This form is <strong>{status}</strong>. The link won’t work publicly until you publish it.
              </div>
            )}

            {usageText && (
              <div className="admin-share__usage">
                <span className="admin-share__usage-dot" />
                {usageText}
              </div>
            )}

            {/* Public link */}
            <div className="admin-share__block">
              <label className="admin-share__label">Public link</label>
              <div className="admin-share__row">
                <input className="admin-share__input" readOnly value={publicUrl} onFocus={e => e.target.select()} />
                <button type="button" className="admin-btn-primary admin-btn-primary--sm" onClick={() => copy(publicUrl, 'Link')}>
                  Copy
                </button>
                {publicUrl && (
                  <a className="admin-btn-ghost" href={publicUrl} target="_blank" rel="noopener noreferrer">Open ↗</a>
                )}
              </div>
            </div>

            {/* QR + Embed side by side */}
            <div className="admin-share__cols">
              <div className="admin-share__block">
                <label className="admin-share__label">QR code</label>
                <div className="admin-share__qr">
                  {qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qr} alt="QR code" width={150} height={150} />
                  ) : (
                    <div className="admin-share__qr-placeholder">Generating…</div>
                  )}
                </div>
                <button type="button" className="admin-btn-ghost" onClick={downloadQr} disabled={!qr}>
                  Download PNG
                </button>
              </div>

              <div className="admin-share__block admin-share__block--grow">
                <label className="admin-share__label">Embed on another site</label>
                <textarea className="admin-share__code" readOnly value={embedCode} rows={5} onFocus={e => e.target.select()} />
                <button type="button" className="admin-btn-ghost" onClick={() => copy(embedCode, 'Embed code')}>
                  Copy embed code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
