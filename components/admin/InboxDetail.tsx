'use client'

import { useEffect, useTransition } from 'react'
import Link from 'next/link'
import type { Submission } from '@/lib/submissions'
import { type Form, type FormField, type FormCategory, FORM_CATEGORY_LABELS, FIELD_TYPE_ICONS } from '@/lib/forms'
import { markReadAction, archiveAction, deleteSubmissionAction } from '@/app/admin/inbox/actions'

function fmtValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

function prettyKey(k: string): string {
  return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function isLink(v: unknown): boolean {
  return /^https?:\/\//.test(String(v))
}

export default function InboxDetail({
  submission: s,
  form,
  fields,
  jobTitle,
  jobSlug,
}: {
  submission: Submission
  form?: Form | null
  fields?: FormField[]
  jobTitle?: string | null
  jobSlug?: string | null
}) {
  const [pending, startTransition] = useTransition()

  // Mark as read on open.
  useEffect(() => {
    if (!s.is_read) markReadAction(s.id, true)
  }, [s.id, s.is_read])

  const created = new Date(s.created_at).toLocaleString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const badgeLabel = FORM_CATEGORY_LABELS[s.type as FormCategory] ?? s.type
  const backHref = s.is_archived
    ? `/admin/inbox?archived=1${s.form_id ? `&form=${s.form_id}` : ''}`
    : `/admin/inbox${s.form_id ? `?form=${s.form_id}` : ''}`

  // Form-driven answers (responses keyed by field id) rendered with labels.
  const hasFormAnswers = !!form && !!fields && fields.length > 0
  const answers = (s.responses ?? {}) as Record<string, unknown>

  // Legacy fallback: render the data blob as key/value pairs.
  const dataEntries = Object.entries(s.data ?? {}).filter(([, v]) =>
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== undefined
  )

  return (
    <div className="admin-jobform">
      <div className="admin-editor-topbar">
        <Link href={backHref} className="admin-editor-back">← Inbox</Link>
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
          <span className={`admin-inbox-badge admin-inbox-badge--${s.type}`}>{badgeLabel}</span>
          {form && <span className="admin-inbox-detail__form">from {form.title}</span>}
          {jobTitle && (
            <span className="admin-inbox-detail__job">
              applied to{' '}
              {jobSlug
                ? <a href={`/careers/${jobSlug}`} target="_blank" rel="noopener noreferrer">{jobTitle} ↗</a>
                : jobTitle}
            </span>
          )}
          <span className="admin-inbox-detail__time">{created}</span>
        </div>

        <h1 className="admin-inbox-detail__name">{s.name || '(no name)'}</h1>
        {s.email && (
          <a href={`mailto:${s.email}`} className="admin-inbox-detail__email">{s.email}</a>
        )}

        {/* Form-driven answers, with real question labels */}
        {hasFormAnswers ? (
          <div className="admin-inbox-detail__fields">
            {fields!.map(f => (
              <div key={f.id} className="admin-inbox-detail__field">
                <span className="admin-inbox-detail__field-label">
                  <span style={{ marginRight: 6, opacity: 0.5 }}>{FIELD_TYPE_ICONS[f.type]}</span>
                  {f.label}
                </span>
                <span className="admin-inbox-detail__field-value">
                  {isLink(answers[f.id])
                    ? <a href={String(answers[f.id])} target="_blank" rel="noopener noreferrer">{String(answers[f.id])} ↗</a>
                    : fmtValue(answers[f.id])}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            {s.subject && <p className="admin-inbox-detail__subject">{s.subject}</p>}
            {s.message && (
              <div className="admin-inbox-detail__message">
                {s.message.split('\n').map((line, i) => <p key={i}>{line || ' '}</p>)}
              </div>
            )}
            {dataEntries.length > 0 && (
              <div className="admin-inbox-detail__fields">
                {dataEntries.map(([k, v]) => (
                  <div key={k} className="admin-inbox-detail__field">
                    <span className="admin-inbox-detail__field-label">{prettyKey(k)}</span>
                    <span className="admin-inbox-detail__field-value">
                      {isLink(v)
                        ? <a href={String(v)} target="_blank" rel="noopener noreferrer">{String(v)} ↗</a>
                        : fmtValue(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {s.email && (
          <div style={{ marginTop: '32px' }}>
            <a className="admin-btn-primary" style={{ width: 'auto', display: 'inline-flex', padding: '10px 22px', textDecoration: 'none' }}
              href={`mailto:${s.email}?subject=${encodeURIComponent(`Re: ${form?.title ?? 'your note to Afterthought'}`)}`}>
              Reply by email →
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
