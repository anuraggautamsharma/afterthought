'use client'

import { useState, useEffect } from 'react'
import { subscribeToasts, type ToastItem } from '@/lib/toastStore'

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return subscribeToasts(setToasts)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="admin-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`admin-toast admin-toast--${t.type}`}>
          <span className="admin-toast__icon">
            {t.type === 'success' && '✓'}
            {t.type === 'error' && '⚠'}
            {t.type === 'info' && 'ℹ'}
          </span>
          <span className="admin-toast__message">{t.message}</span>
          <button
            className="admin-toast__dismiss"
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
