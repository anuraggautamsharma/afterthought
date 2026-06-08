'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Submission } from '@/lib/submissions'
import type { Form, FormField, FormCategory } from '@/lib/forms'
import { FORM_CATEGORY_LABELS, formatAnswerForDisplay } from '@/lib/forms'
import { toast } from '@/lib/toastStore'
import { openConfirm } from '@/lib/confirmStore'
import {
  bulkMarkReadAction,
  bulkArchiveAction,
  bulkDeleteSubmissionsAction,
} from '@/app/admin/inbox/actions'
import ResponsesTable from '@/components/admin/forms/ResponsesTable'
import { SearchField, Checkbox, BulkBar } from '@/components/admin/list/ListControls'
import Icon from '@/components/Icon'

export interface InboxGroup {
  key: string // formId | 'legacy'
  label: string
  category: string
  total: number
  unread: number
}

export interface JobChip {
  id: string
  label: string
  total: number
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
  jobsById: Record<string, string>
  jobChips: JobChip[]
  selectedJob: string // 'all' | 'none' | jobId
}

type DateRange = 'all' | 'today' | '7d' | '30d' | 'custom'
type StatusFilter = 'all' | 'unread'

const DATE_CHIPS: { value: DateRange; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom' },
]

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

function csvEscape(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`
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
  jobsById,
  jobChips,
  selectedJob,
}: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [range, setRange] = useState<DateRange>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const isReal = selected !== 'all' && selected !== 'legacy'

  // ── Date window ────────────────────────────────────────────────────────────
  const [fromTs, toTs] = useMemo<[number | null, number | null]>(() => {
    const now = new Date()
    if (range === 'today') {
      const d = new Date(now); d.setHours(0, 0, 0, 0)
      return [d.getTime(), null]
    }
    if (range === '7d') return [now.getTime() - 7 * 86400000, null]
    if (range === '30d') return [now.getTime() - 30 * 86400000, null]
    if (range === 'custom') {
      const f = from ? new Date(from + 'T00:00:00').getTime() : null
      const t = to ? new Date(to + 'T23:59:59').getTime() : null
      return [f, t]
    }
    return [null, null]
  }, [range, from, to])

  // ── Filtered list ──────────────────────────────────────────────────────────
  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(s => {
      const t = new Date(s.created_at).getTime()
      if (fromTs !== null && t < fromTs) return false
      if (toTs !== null && t > toTs) return false
      if (status === 'unread' && s.is_read) return false
      if (q && !`${s.name ?? ''} ${s.email ?? ''} ${s.subject ?? ''}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, fromTs, toTs, status, query])

  // ── Bulk selection ─────────────────────────────────────────────────────────
  const allPicked = visibleItems.length > 0 && visibleItems.every(s => picked.has(s.id))
  const toggle = (id: string) => setPicked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setPicked(allPicked ? new Set() : new Set(visibleItems.map(s => s.id)))
  const clear = () => setPicked(new Set())
  const pickedIds = () => [...picked]

  const runBulk = (fn: () => Promise<void>, done: string) =>
    startTransition(async () => {
      try { await fn(); toast.success(done); clear(); router.refresh() }
      catch { toast.error('Action failed') }
    })

  const onBulkDelete = async () => {
    const n = picked.size
    const ok = await openConfirm({
      title: `Delete ${n} response${n !== 1 ? 's' : ''}?`,
      message: 'Their uploaded files will be removed too. This cannot be undone.',
      confirmLabel: 'Delete', danger: true,
    })
    if (ok) runBulk(() => bulkDeleteSubmissionsAction(pickedIds()), 'Deleted')
  }

  // Build hrefs that preserve archived scope
  const href = (params: Record<string, string>) => {
    const sp = new URLSearchParams()
    if (showArchived) sp.set('archived', '1')
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v)
    const q = sp.toString()
    return `/admin/inbox${q ? `?${q}` : ''}`
  }

  const title =
    selected === 'all' ? 'All responses'
      : selected === 'legacy' ? 'Other / legacy'
        : selectedForm?.title || 'Form'

  const formTitleById = useMemo(
    () => Object.fromEntries(groups.map(g => [g.key, g.label])),
    [groups]
  )
  const showJob = visibleItems.some(s => s.job_id)

  // ── Export (respects current filters + any selection) ──────────────────────
  function handleExport() {
    const rows = picked.size > 0 ? visibleItems.filter(s => picked.has(s.id)) : visibleItems
    if (rows.length === 0) { toast.error('Nothing to export'); return }

    let headers: string[]
    let body: string[][]
    if (isReal && selectedForm) {
      headers = ['Submitted at', 'Name', 'Email', ...selectedFields.map(f => f.label)]
      body = rows.map(s => {
        const r = (s.responses ?? {}) as Record<string, unknown>
        return [
          new Date(s.created_at).toISOString(),
          s.name ?? '', s.email ?? '',
          ...selectedFields.map(f => {
            const v = formatAnswerForDisplay(f, r[f.id])
            return v === '—' ? '' : v
          }),
        ]
      })
    } else {
      const formName = (id: string | null) => groups.find(g => g.key === id)?.label ?? ''
      headers = ['Submitted at', 'Type', 'Name', 'Email', 'Form', 'Subject']
      body = rows.map(s => [
        new Date(s.created_at).toISOString(),
        categoryLabel(s.type), s.name ?? '', s.email ?? '',
        s.form_id ? formName(s.form_id) : '', s.subject ?? '',
      ])
    }

    const csv = [headers, ...body].map(row => row.map(csvEscape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedForm?.slug ?? 'responses'}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} response${rows.length !== 1 ? 's' : ''}`)
  }

  return (
    <div className="admin-inbox-hub">
      {/* ── Form rail ──────────────────────────────────────────────── */}
      <aside className="admin-inbox-rail">
        <div className="admin-inbox-rail__toggle">
          <Link
            href={selected === 'all' ? '/admin/inbox' : `/admin/inbox?form=${selected}`}
            className={`admin-inbox-rail__toggle-btn ${!showArchived ? 'is-active' : ''}`}
          >
            Active
          </Link>
          <Link
            href={selected === 'all' ? '/admin/inbox?archived=1' : `/admin/inbox?archived=1&form=${selected}`}
            className={`admin-inbox-rail__toggle-btn ${showArchived ? 'is-active' : ''}`}
          >
            Archived
          </Link>
        </div>

        <nav className="admin-inbox-rail__list">
          <Link href={href({ form: 'all' })} className={`admin-inbox-rail__item ${selected === 'all' ? 'is-active' : ''}`}>
            <span className="admin-inbox-rail__label">All responses</span>
            <span className="admin-inbox-rail__count">
              {allUnread > 0 && <span className="admin-inbox-rail__unread">{allUnread}</span>}
              {allCount}
            </span>
          </Link>

          {groups.length > 0 && <div className="admin-inbox-rail__divider" />}

          {groups.map(g => (
            <Link key={g.key} href={href({ form: g.key })} className={`admin-inbox-rail__item ${selected === g.key ? 'is-active' : ''}`}>
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
              {visibleItems.length}{visibleItems.length !== items.length ? ` of ${items.length}` : ''} {showArchived ? 'archived' : 'response'}{(visibleItems.length !== items.length ? items.length : visibleItems.length) !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="admin-inbox-main__actions">
            <div className="admin-viewtoggle">
              <Link href={href({ form: selected, view: 'table' })} className={`admin-viewtoggle__btn ${viewMode !== 'list' ? 'is-active' : ''}`}>Table</Link>
              <Link href={href({ form: selected, view: 'list' })} className={`admin-viewtoggle__btn ${viewMode === 'list' ? 'is-active' : ''}`}>List</Link>
            </div>
            {isReal && selectedForm && (
              <>
                {selectedForm.status === 'published' && (
                  <a href={`/forms/${selectedForm.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn-ghost">Open form ↗</a>
                )}
                <Link href={`/admin/forms/${selectedForm.id}/edit`} className="admin-btn-ghost">Edit form</Link>
              </>
            )}
            <button className="admin-btn-primary admin-btn-primary--icon" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }} onClick={handleExport} disabled={pending}>
              <Icon name="download" size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Filter bar ───────────────────────────────────────────── */}
        <div className="admin-resp-toolbar">
          <div className="admin-resp-toolbar__group">
            <span className="admin-resp-toolbar__label">Date</span>
            {DATE_CHIPS.map(c => (
              <button key={c.value} className={`admin-resp-chip ${range === c.value ? 'is-active' : ''}`} onClick={() => setRange(c.value)}>
                {c.label}
              </button>
            ))}
            {range === 'custom' && (
              <span className="admin-resp-daterange">
                <input type="date" value={from} onChange={e => setFrom(e.target.value)} aria-label="From date" />
                <span className="admin-resp-daterange__sep">→</span>
                <input type="date" value={to} onChange={e => setTo(e.target.value)} aria-label="To date" />
              </span>
            )}
          </div>
          <div className="admin-resp-toolbar__group">
            <span className="admin-resp-toolbar__label">Status</span>
            <div className="admin-viewtoggle">
              <button className={`admin-viewtoggle__btn ${status === 'all' ? 'is-active' : ''}`} onClick={() => setStatus('all')}>All</button>
              <button className={`admin-viewtoggle__btn ${status === 'unread' ? 'is-active' : ''}`} onClick={() => setStatus('unread')}>Unread</button>
            </div>
          </div>
          <div className="admin-resp-toolbar__group admin-resp-toolbar__group--grow">
            <SearchField value={query} onChange={setQuery} placeholder="Search name, email, subject…" />
          </div>
        </div>

        {jobChips.length > 0 && (
          <div className="admin-inbox-jobfilter">
            <span className="admin-inbox-jobfilter__label">Job</span>
            <Link href={href({ form: selected, view: viewMode === 'table' ? 'table' : '' })} className={`admin-inbox-jobchip ${selectedJob === 'all' ? 'is-active' : ''}`}>All</Link>
            {jobChips.map(j => (
              <Link key={j.id} href={href({ form: selected, job: j.id, view: viewMode === 'table' ? 'table' : '' })} className={`admin-inbox-jobchip ${selectedJob === j.id ? 'is-active' : ''}`}>
                {j.label}<span className="admin-inbox-jobchip__count">{j.total}</span>
              </Link>
            ))}
          </div>
        )}

        {picked.size > 0 && (
          <BulkBar count={picked.size} onClear={clear}>
            <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkMarkReadAction(pickedIds(), true), 'Marked read')}><Icon name="mark_email_read" size={16} /> Mark read</button>
            <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkMarkReadAction(pickedIds(), false), 'Marked unread')}><Icon name="mark_email_unread" size={16} /> Mark unread</button>
            <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkArchiveAction(pickedIds(), !showArchived), showArchived ? 'Restored' : 'Archived')}><Icon name={showArchived ? 'unarchive' : 'archive'} size={16} /> {showArchived ? 'Restore' : 'Archive'}</button>
            <button className="admin-btn-ghost" disabled={pending} onClick={handleExport}><Icon name="download" size={16} /> Export selected</button>
            <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onBulkDelete}><Icon name="delete" size={16} /> Delete</button>
          </BulkBar>
        )}

        {items.length === 0 ? (
          <div className="admin-posts-table">
            <div className="admin-empty">
              <div className="admin-empty__title">{showArchived ? 'Nothing archived.' : 'No responses yet.'}</div>
              <p>{showArchived ? 'Archived responses will appear here.' : 'Responses from this form will land here.'}</p>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="admin-posts-table">
            <div className="admin-empty"><div className="admin-empty__title">No responses match these filters.</div></div>
          </div>
        ) : viewMode !== 'list' ? (
          <ResponsesTable
            responses={visibleItems}
            fields={isReal ? selectedFields : []}
            picked={picked}
            allPicked={allPicked}
            onToggle={toggle}
            onToggleAll={toggleAll}
            jobsById={jobsById}
            formTitleById={formTitleById}
            showJob={showJob}
          />
        ) : (
          <div className="admin-posts-table">
            <div className="admin-table-head">
              <Checkbox checked={allPicked} onChange={toggleAll} label="Select all" />
              <span className="admin-table-head__label">{allPicked ? 'All selected' : `${visibleItems.length} response${visibleItems.length !== 1 ? 's' : ''}`}</span>
            </div>
            {visibleItems.map(s => (
              <div key={s.id} className={`admin-inbox-row ${!s.is_read ? 'is-unread' : ''} ${picked.has(s.id) ? 'is-selected' : ''}`}>
                <Checkbox checked={picked.has(s.id)} onChange={() => toggle(s.id)} label={`Select ${s.name || s.email}`} />
                <Link href={`/admin/inbox/${s.id}`} className="admin-inbox-row__link">
                  <span className="admin-inbox-row__dot" aria-hidden="true" />
                  <span className={`admin-inbox-badge admin-inbox-badge--${s.type}`}>{categoryLabel(s.type)}</span>
                  <span className="admin-inbox-row__name">{s.name || s.email || '(no name)'}</span>
                  <span className="admin-inbox-row__subject">{s.subject || s.message || s.email}</span>
                  {s.job_id && jobsById[s.job_id] && <span className="admin-inbox-row__job">→ {jobsById[s.job_id]}</span>}
                  <span className="admin-inbox-row__time">{timeAgo(s.created_at)}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
