'use client'

import Link from 'next/link'
import type { Submission } from '@/lib/submissions'

const TYPE_LABELS: Record<string, string> = {
  contact: 'Brief',
  newsletter: 'Newsletter',
  application: 'Job application',
  freelance: 'Freelance',
}

function timeAgo(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function InboxList({ submissions, showArchived }: { submissions: Submission[]; showArchived: boolean }) {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Inbox</h1>
          <p className="admin-page-subtitle">
            {submissions.length} {showArchived ? 'archived' : 'message'}{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="admin-inbox-tabs">
          <Link href="/admin/inbox" className={`admin-inbox-tab ${!showArchived ? 'is-active' : ''}`}>Inbox</Link>
          <Link href="/admin/inbox?archived=1" className={`admin-inbox-tab ${showArchived ? 'is-active' : ''}`}>Archived</Link>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">{showArchived ? 'Nothing archived.' : 'No messages yet.'}</div>
            <p>{showArchived ? 'Archived submissions will appear here.' : 'Briefs, applications and newsletter signups from the site land here.'}</p>
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          {submissions.map(s => (
            <Link key={s.id} href={`/admin/inbox/${s.id}`} className={`admin-inbox-row ${!s.is_read ? 'is-unread' : ''}`}>
              <span className="admin-inbox-row__dot" aria-hidden="true" />
              <span className={`admin-inbox-badge admin-inbox-badge--${s.type}`}>{TYPE_LABELS[s.type] ?? s.type}</span>
              <span className="admin-inbox-row__name">{s.name || s.email || '(no name)'}</span>
              <span className="admin-inbox-row__subject">{s.subject || s.message || s.email}</span>
              <span className="admin-inbox-row__time">{timeAgo(s.created_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
