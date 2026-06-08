'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import type { Job } from '@/lib/jobs'
import {
  deleteJobAction, seedJobsAction, reorderJobAction,
  bulkDeleteJobsAction, bulkSetJobStatusAction,
} from '@/app/admin/jobs/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'
import { ListToolbar, SearchField, SortSelect, BulkBar, Checkbox, TableHead } from './list/ListControls'

type Filter = 'all' | 'open' | 'closed'
type Sort = 'order' | 'title' | 'status'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'order', label: 'Manual order' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'status', label: 'Status' },
]

export default function JobsList({ jobs }: { jobs: Job[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('order')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const open = jobs.filter(j => j.status === 'open').length
  const closed = jobs.filter(j => j.status === 'closed').length

  const reorderable = sort === 'order' && !query.trim() && filter === 'all'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)
    if (q) list = list.filter(j =>
      (j.title ?? '').toLowerCase().includes(q) ||
      (j.summary ?? '').toLowerCase().includes(q) ||
      (j.type ?? '').toLowerCase().includes(q) ||
      (j.location ?? '').toLowerCase().includes(q)
    )
    const out = [...list]
    if (sort === 'title') out.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    else if (sort === 'status') out.sort((a, b) => (a.status).localeCompare(b.status))
    return out
  }, [jobs, filter, query, sort])

  const allSelected = filtered.length > 0 && filtered.every(j => selected.has(j.id))
  const selCount = selected.size
  const ids = () => [...selected]
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(j => j.id)))
  const clear = () => setSelected(new Set())
  const runBulk = (fn: () => Promise<void>, done: string) =>
    startTransition(async () => { try { await fn(); toast.success(done); clear() } catch { toast.error('Action failed') } })

  const handleImport = () => startTransition(async () => {
    setMsg('Importing…')
    const res = await seedJobsAction()
    setMsg(res.error ? res.error : `Imported ${res.count} roles`)
  })

  const handleDelete = (id: string) => startTransition(async () => {
    const confirmed = await openConfirm({ title: 'Delete this job?', message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (!confirmed) return
    await deleteJobAction(id)
  })

  const handleReorder = (id: string, direction: 'up' | 'down') =>
    startTransition(async () => { try { await reorderJobAction(id, direction) } catch { toast.error('Failed to reorder') } })

  const onBulkDelete = async () => {
    const confirmed = await openConfirm({ title: `Delete ${selCount} job${selCount !== 1 ? 's' : ''}?`, message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (confirmed) runBulk(() => bulkDeleteJobsAction(ids()), 'Jobs deleted')
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Jobs</h1>
          <p className="admin-page-subtitle">{open} open · {closed} closed</p>
        </div>
        <Link href="/admin/jobs/new" className="admin-btn-primary admin-btn-primary--icon" style={{ width: 'auto', padding: '10px 18px', fontSize: '14px', textDecoration: 'none' }}>
          <Icon name="add" size={18} /> New job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No jobs yet.</div>
            <p>Import your two existing roles from the old site, or write a new one.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="admin-btn-primary" disabled={pending} onClick={handleImport} style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
                {pending ? 'Importing…' : 'Import existing roles'}
              </button>
              <Link href="/admin/jobs/new" className="admin-btn-secondary" style={{ width: 'auto', display: 'inline-flex', fontSize: '14px', textDecoration: 'none' }}>
                Write a new one
              </Link>
            </div>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <>
          <ListToolbar tabs={
            <div className="admin-filter-tabs">
              {(['all', 'open', 'closed'] as Filter[]).map(tab => (
                <button key={tab} className={`admin-filter-tab ${filter === tab ? 'is-active' : ''}`} onClick={() => setFilter(tab)}>
                  {tab === 'all' ? 'All' : tab === 'open' ? 'Open' : 'Closed'}
                  <span className="admin-filter-tab__count">{tab === 'all' ? jobs.length : tab === 'open' ? open : closed}</span>
                </button>
              ))}
            </div>
          }>
            <SearchField value={query} onChange={setQuery} placeholder="Search jobs…" />
            <SortSelect value={sort} onChange={setSort} options={SORTS} />
          </ListToolbar>

          {selCount > 0 && (
            <BulkBar count={selCount} onClear={clear}>
              <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkSetJobStatusAction(ids(), 'open'), 'Reopened')}><Icon name="lock_open" size={16} /> Open</button>
              <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkSetJobStatusAction(ids(), 'closed'), 'Closed')}><Icon name="lock" size={16} /> Close</button>
              <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onBulkDelete}><Icon name="delete" size={16} /> Delete</button>
            </BulkBar>
          )}

          {filtered.length === 0 ? (
            <div className="admin-posts-table"><div className="admin-empty"><div className="admin-empty__title">No matches{query ? ` for “${query}”` : ''}.</div></div></div>
          ) : (
            <div className="admin-posts-table">
              <TableHead allSelected={allSelected} onToggleAll={toggleAll} label={allSelected ? 'All selected' : `${filtered.length} job${filtered.length !== 1 ? 's' : ''}`} />
              {filtered.map((job, idx) => (
                <div key={job.id} className={`admin-posts-table__row ${selected.has(job.id) ? 'is-selected' : ''}`}>
                  <Checkbox checked={selected.has(job.id)} onChange={() => toggle(job.id)} label={`Select ${job.title}`} />
                  {reorderable && (
                    <div className="admin-reorder-col">
                      <button className="admin-reorder-btn" disabled={idx === 0 || pending} onClick={() => handleReorder(job.id, 'up')} aria-label="Move up">↑</button>
                      <button className="admin-reorder-btn" disabled={idx === filtered.length - 1 || pending} onClick={() => handleReorder(job.id, 'down')} aria-label="Move down">↓</button>
                    </div>
                  )}
                  <div className="admin-post-content">
                    <div className="admin-post-title-row">
                      <Link href={`/admin/jobs/${job.id}`} className="admin-post-title-link">{job.title || '(Untitled)'}</Link>
                      <span className={`admin-status-badge admin-status-badge--${job.status}`}><span className="admin-status-badge__dot" />{job.status}</span>
                    </div>
                    {job.summary && <p className="admin-post-excerpt">{job.summary}</p>}
                    <div className="admin-post-meta">
                      <span className="admin-post-category">{job.type}</span>
                      <span className="admin-post-meta__sep" />
                      <span className="admin-date">{job.location}</span>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <Link href={`/admin/jobs/${job.id}`} className="admin-btn-ghost"><Icon name="edit" size={15} /> Edit</Link>
                    {job.status === 'open' && <Link href={`/careers/${job.slug}`} target="_blank" className="admin-btn-ghost"><Icon name="open_in_new" size={15} /> View</Link>}
                    <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(job.id)}><Icon name="delete" size={15} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
