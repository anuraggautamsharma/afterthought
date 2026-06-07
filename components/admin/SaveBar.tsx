'use client'

interface Props {
  state: 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
  savedAt?: Date | null
  errorMsg?: string
  onRetry?: () => void
}

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function SaveBar({ state, savedAt, errorMsg, onRetry }: Props) {
  if (state === 'idle') return null

  return (
    <div className={`admin-save-bar admin-save-bar--${state}`}>
      {state === 'dirty' && (
        <span>● Unsaved changes</span>
      )}
      {state === 'saving' && (
        <>
          <span className="admin-save-bar__spinner" />
          <span>Saving…</span>
        </>
      )}
      {state === 'saved' && (
        <span>✓ Saved{savedAt ? ` · ${formatTime(savedAt)}` : ''}</span>
      )}
      {state === 'error' && (
        <>
          <span>⚠ Failed{errorMsg ? ` · ${errorMsg}` : ''}</span>
          {onRetry && (
            <button
              type="button"
              className="admin-save-bar__retry"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </>
      )}
    </div>
  )
}
