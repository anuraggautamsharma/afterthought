'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Submission } from '@/lib/submissions'
import type { Form, FormField, FormCategory } from '@/lib/forms'
import { FORM_CATEGORY_LABELS } from '@/lib/forms'
import { getFormCsvAction } from '@/app/admin/forms/actions'
import { toast } from '@/lib/toastStore'
import ResponsesTable from '@/components/admin/forms/ResponsesTable'

export interface InboxGroup {
  key: string // formId | 'legacy'
  label: string
  category: string
  total: number
  unread: number
}

interface Props {
  groups: InboxGroup[]
  allCount: number
  allUnread: number
  items: Submission[]
  selected: string // 'all' | 'legacy' | formId
  showArchived: boolean
  viewMode: 'list' | 'table'
  selectedForm: Form | null
  selectedFields: FormField[]
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

function categoryLabel(cat: string) {
  return FORM_CATEGORY_LABELS[cat as FormCategory] ?? cat
}

export default function InboxHub({
  groups,
  allCount,
  allUnread,
  items,
  selected,
  showArchived,
  viewMode,
  selectedForm,
  selectedFields,
}: Props) {
  const [exporting, setExporting] = useState(false)

  // Build hrefs that preserve archived scope
  const href = (params: Record<string, string>) => {
    const sp = new URLSearchParams()
    if (showArchived) sp.set('archived', '1')
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v)
    const q = sp.toString()
    return `/admin/inbox${q ? `?${q}` : ''}`
  }

  const isReal = selected !== 'all' && selected !== 'legacy'
  const title =
    selected === 'all'
      ? 'All responses'
      : selected === 'legacy'
        ? 'Other / legacy'
        : selectedForm?.title || 'Form'

  async function handleExport() {
    if (!selectedForm) return
    setExporting(true)
    try {
      const csv = await getFormCsvAction(selectedForm.id)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedForm.slug}-responses.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="admin-inbox-hub">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="admin-inbox-rail">
        <div className="admin-inbox-rail__toggle">
          <Link
            href={selected === 'all' ? '/admin/inbox' : `/admin/inbox?form=${selected}`}
            className={`admin-inbox-rail__toggle-btn ${!showArchived ? 'is-active' : ''}`}
          >
            Inbox
          </Link>
          <Link
            href={
              selected === 'all'
                ? '/admin/inbox?archived=1'
                : `/admin/inbox?archived=1&form=${selected}`
            }
            className={`admin-inbox-rail__toggle-btn ${showArchived ? 'is-active' : ''}`}
          >
            Archived
          </Link>
        </div>

        <nav className="admin-inbox-rail__list">
          <Link
            href={href({ form: 'all' })}
            className={`admin-inbox-rail__item ${selected === 'all' ? 'is-active' : ''}`}
          >
            <span className="admin-inbox-rail__label">All responses</span>
            <span className="admin-inbox-rail__count">
              {allUnread > 0 && <span className="admin-inbox-rail__unread">{allUnread}</span>}
              {allCount}
            </span>
          </Link>

          {groups.length > 0 && <div className="admin-inbox-rail__divider" />}

          {groups.map(g => (
            <Link
              key={g.key}
              href={href({ form: g.key })}
              className={`admin-inbox-rail__item ${selected === g.key ? 'is-active' : ''}`}
            >
              <span className="admin-inbox-rail__label">
                {g.label}
                <span className="admin-inbox-rail__cat">{categoryLabel(g.category)}</span>
              </span>
              <span className="admin-inbox-rail__count">
                {g.unread > 0 && <span className="admin-inbox-rail__unread">{g.unread}</span>}
                {g.total}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <section className="admin-inbox-main">
        <div className="admin-inbox-main__head">
          <div>
            <h1 className="admin-page-title">{title}</h1>
            <p className="admin-page-subtitle">
              {items.length} {showArchived ? 'archived' : 'response'}{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isReal && selectedForm && (
            <div className="admin-inbox-main__actions">
              <div className="admin-viewtoggle">
                <Link
                  href={href({ form: selected, view: 'list' })}
                  className={`admin-viewtoggle__btn ${viewMode === 'list' ? 'is-active' : ''}`}
                >
                  List
                </Link>
                <Link
                  href={href({ form: selected, view: 'table' })}
                  className={`admin-viewtoggle__btn ${viewMode === 'table' ? 'is-active' : ''}`}
                >
                  Table
                </Link>
              </div>
              {items.length > 0 && (
                <button className="admin-btn-ghost" onClick={handleExport} disabled={exporting}>
                  {exporting ? 'Exporting…' : '↓ Export CSV'}
                </button>
              )}
              {selectedForm.status === 'published' && (
                <a
                  href={`/forms/${selectedForm.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-ghost"
                >
                  Open form ↗
                </a>
              )}
              <Link href={`/admin/forms/${selectedForm.id}/edit`} className="admin-btn-ghost">
                Edit form
              </Link>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="admin-posts-table">
            <div className="admin-empty">
              <div className="admin-empty__title">
                {showArchived ? 'Nothing archived.' : 'No responses yet.'}
              </div>
              <p>
                {showArchived
                  ? 'Archived responses will appear here.'
                  : 'Responses from this form will land here.'}
              </p>
            </div>
          </div>
        ) : viewMode === 'table' && isReal ? (
          <ResponsesTable fields={selectedFields} responses={items} />
        ) : (
          <div className="admin-posts-table">
            {items.map(s => (
              <Link
                key={s.id}
                href={`/admin/inbox/${s.id}`}
                className={`admin-inbox-row ${!s.is_read ? 'is-unread' : ''}`}
              >
                <span className="admin-inbox-row__dot" aria-hidden="true" />
                <span className={`admin-inbox-badge admin-inbox-badge--${s.type}`}>
                  {categoryLabel(s.type)}
                </span>
                <span className="admin-inbox-row__name">{s.name || s.email || '(no name)'}</span>
                <span className="admin-inbox-row__subject">{s.subject || s.message || s.email}</span>
                <span className="admin-inbox-row__time">{timeAgo(s.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
