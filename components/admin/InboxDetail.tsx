'use client'

import { useEffect, useTransition } from 'react'
import Link from 'next/link'
import type { Submission } from '@/lib/submissions'
import { markReadAction, archiveAction, deleteSubmissionAction } from '@/app/admin/inbox/actions'

const TYPE_LABELS: Record<string, string> = {
  contact: 'Brief',
  newsletter: 'Newsletter signup',
  application: 'Job application',
  freelance: 'Freelance application',
}

function fmtValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  if (v === null || v === undefined || v === '') return '—'
  return String(v)
}

function prettyKey(k: string): string {
  return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function InboxDetail({ submission: s }: { submission: Submission }) {
  const [pending, startTransition] = useTransition()

  // Mark as read on open.
  useEffect(() => {
    if (!s.is_read) markReadAction(s.id, true)
  }, [s.id, s.is_read])

  const dataEntries = Object.entries(s.data ?? {}).filter(([, v]) =>
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== undefined
  )

  const created = new Date(s.created_at).toLocaleString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="admin-jobform">
      <div className="admin-editor-topbar">
        <Link href={s.is_archived ? '/admin/inbox?archived=1' : '/admin/inbox'} className="admin-editor-back">← Inbox</Link>
        <div className="admin-settings__save" style={{ gap: '8px' }}>
          <button className="admin-btn-ghost" disabled={pending}
            onClick={() => startTransition(() => { markReadAction(s.id, !s.is_read) })}>
            {s.is_read ? 'Mark unread' : 'Mark read'}
          </button>
          <button className="admin-btn-ghost" disabled={pending}
            onClick={() => startTransition(() => { archiveAction(s.id, !s.is_archived) })}>
            {s.is_archived ? 'Restore' : 'Archive'}
          </button>
          <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending}
            onClick={() => { if (confirm('Delete this submission permanently?')) startTransition(() => { deleteSubmissionAction(s.id) }) }}>
            Delete
          </button>
        </div>
      </div>

      <section className="admin-settings-card">
        <div className="admin-inbox-detail__head">
          <span className={`admin-inbox-badge admin-inbox-badge--${s.type}`}>{TYPE_LABELS[s.type] ?? s.type}</span>
          <span className="admin-inbox-detail__time">{created}</span>
        </div>

        <h1 className="admin-inbox-detail__name">{s.name || '(no name)'}</h1>
        {s.email && (
          <a href={`mailto:${s.email}`} className="admin-inbox-detail__email">{s.email}</a>
        )}
        {s.subject && <p className="admin-inbox-detail__subject">{s.subject}</p>}

        {s.message && (
          <div className="admin-inbox-detail__message">
            {s.message.split('\n').map((line, i) => <p key={i}>{line || ' '}</p>)}
          </div>
        )}

        {dataEntries.length > 0 && (
          <div className="admin-inbox-detail__fields">
            {dataEntries.map(([k, v]) => (
              <div key={k} className="admin-inbox-detail__field">
                <span className="admin-inbox-detail__field-label">{prettyKey(k)}</span>
                <span className="admin-inbox-detail__field-value">
                  {/^https?:\/\//.test(String(v))
                    ? <a href={String(v)} target="_blank" rel="noopener noreferrer">{String(v)} ↗</a>
                    : fmtValue(v)}
                </span>
              </div>
            ))}
          </div>
        )}

        {s.email && (
          <div style={{ marginTop: '32px' }}>
            <a className="admin-btn-primary" style={{ width: 'auto', display: 'inline-flex', padding: '10px 22px', textDecoration: 'none' }}
              href={`mailto:${s.email}?subject=${encodeURIComponent('Re: your note to Afterthought')}`}>
              Reply by email →
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
