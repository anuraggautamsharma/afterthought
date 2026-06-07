'use client'

import { useState, useEffect } from 'react'
import { subscribeConfirm, resolveConfirm, type ConfirmOptions } from '@/lib/confirmStore'

export default function ConfirmModal() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null)

  useEffect(() => {
    return subscribeConfirm(setOpts)
  }, [])

  useEffect(() => {
    if (!opts) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resolveConfirm(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [opts])

  if (!opts) return null

  return (
    <div
      className="admin-confirm-overlay"
      onClick={() => resolveConfirm(false)}
    >
      <div
        className="admin-confirm-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="admin-confirm-title">{opts.title}</div>
        {opts.message && (
          <div className="admin-confirm-msg">{opts.message}</div>
        )}
        <div className="admin-confirm-actions">
          <button
            type="button"
            className="admin-btn-secondary"
            style={{ width: 'auto', padding: '9px 20px', fontSize: '14px' }}
            onClick={() => resolveConfirm(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={opts.danger ? 'admin-btn-danger' : 'admin-btn-primary'}
            style={{ width: 'auto', padding: '9px 20px', fontSize: '14px' }}
            onClick={() => resolveConfirm(true)}
          >
            {opts.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
