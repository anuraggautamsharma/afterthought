'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import type { Project } from '@/lib/projects'
import { stripEmphasis } from '@/lib/projects'
import {
  deleteProjectAction, seedProjectsAction,
  bulkDeleteProjectsAction, bulkSetProjectStatusAction,
} from '@/app/admin/work/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'
import { ListToolbar, SearchField, SortSelect, BulkBar, Checkbox, TableHead } from './list/ListControls'

type Filter = 'all' | 'published' | 'draft'
type Sort = 'recent' | 'oldest' | 'title'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'recent', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
]

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const published = projects.filter(p => p.status === 'published').length
  const drafts = projects.filter(p => p.status === 'draft').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = filter === 'all' ? projects : projects.filter(p => p.status === filter)
    if (q) list = list.filter(p =>
      stripEmphasis(p.title ?? '').toLowerCase().includes(q) ||
      (p.summary ?? '').toLowerCase().includes(q) ||
      (p.client ?? '').toLowerCase().includes(q)
    )
    const yr = (p: Project) => parseInt(String(p.year).replace(/\D/g, ''), 10) || 0
    const out = [...list]
    if (sort === 'recent') out.sort((a, b) => yr(b) - yr(a))
    else if (sort === 'oldest') out.sort((a, b) => yr(a) - yr(b))
    else out.sort((a, b) => stripEmphasis(a.title ?? '').localeCompare(stripEmphasis(b.title ?? '')))
    return out
  }, [projects, filter, query, sort])

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id))
  const selCount = selected.size
  const ids = () => [...selected]
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(p => p.id)))
  const clear = () => setSelected(new Set())
  const runBulk = (fn: () => Promise<void>, done: string) =>
    startTransition(async () => { try { await fn(); toast.success(done); clear() } catch { toast.error('Action failed') } })

  const handleImport = () => startTransition(async () => {
    setMsg('Importing…')
    const res = await seedProjectsAction()
    setMsg(res.error ? res.error : `Imported ${res.count} case studies as drafts`)
  })

  const handleDelete = (id: string) => startTransition(async () => {
    const confirmed = await openConfirm({ title: 'Delete this project?', message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (!confirmed) return
    await deleteProjectAction(id)
  })

  const onBulkDelete = async () => {
    const confirmed = await openConfirm({ title: `Delete ${selCount} project${selCount !== 1 ? 's' : ''}?`, message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (confirmed) runBulk(() => bulkDeleteProjectsAction(ids()), 'Projects deleted')
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Work</h1>
          <p className="admin-page-subtitle">{published} published · {drafts} draft{drafts !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/work/new" className="admin-btn-primary admin-btn-primary--icon" style={{ width: 'auto', padding: '10px 18px', fontSize: '14px', textDecoration: 'none' }}>
          <Icon name="add" size={18} /> New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No projects yet.</div>
            <p>Import your four existing case studies as drafts — all the copy is pre-filled, you just add the images and publish.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="admin-btn-primary" disabled={pending} onClick={handleImport} style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
                {pending ? 'Importing…' : 'Import existing case studies'}
              </button>
              <Link href="/admin/work/new" className="admin-btn-secondary" style={{ width: 'auto', display: 'inline-flex', fontSize: '14px', textDecoration: 'none' }}>
                Start a new one
              </Link>
            </div>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <>
          <ListToolbar tabs={
            <div className="admin-filter-tabs">
              {(['all', 'published', 'draft'] as Filter[]).map(tab => (
                <button key={tab} className={`admin-filter-tab ${filter === tab ? 'is-active' : ''}`} onClick={() => setFilter(tab)}>
                  {tab === 'all' ? 'All' : tab === 'published' ? 'Published' : 'Drafts'}
                  <span className="admin-filter-tab__count">{tab === 'all' ? projects.length : tab === 'published' ? published : drafts}</span>
                </button>
              ))}
            </div>
          }>
            <SearchField value={query} onChange={setQuery} placeholder="Search projects…" />
            <SortSelect value={sort} onChange={setSort} options={SORTS} />
          </ListToolbar>

          {selCount > 0 && (
            <BulkBar count={selCount} onClear={clear}>
              <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkSetProjectStatusAction(ids(), 'published'), 'Published')}><Icon name="visibility" size={16} /> Publish</button>
              <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkSetProjectStatusAction(ids(), 'draft'), 'Moved to draft')}><Icon name="visibility_off" size={16} /> Move to draft</button>
              <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onBulkDelete}><Icon name="delete" size={16} /> Delete</button>
            </BulkBar>
          )}

          {filtered.length === 0 ? (
            <div className="admin-posts-table"><div className="admin-empty"><div className="admin-empty__title">No matches{query ? ` for “${query}”` : ''}.</div></div></div>
          ) : (
            <div className="admin-posts-table">
              <TableHead allSelected={allSelected} onToggleAll={toggleAll} label={allSelected ? 'All selected' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`} />
              {filtered.map(project => (
                <div key={project.id} className={`admin-posts-table__row ${selected.has(project.id) ? 'is-selected' : ''}`}>
                  <Checkbox checked={selected.has(project.id)} onChange={() => toggle(project.id)} label={`Select ${stripEmphasis(project.title)}`} />
                  <div className="admin-post-content">
                    <div className="admin-post-title-row">
                      <Link href={`/admin/work/${project.id}`} className="admin-post-title-link">{stripEmphasis(project.title) || '(Untitled)'}</Link>
                      <span className={`admin-status-badge admin-status-badge--${project.status}`}><span className="admin-status-badge__dot" />{project.status}</span>
                    </div>
                    {project.summary && <p className="admin-post-excerpt">{project.summary}</p>}
                    <div className="admin-post-meta">
                      <span className="admin-post-category">{project.client}</span>
                      <span className="admin-post-meta__sep" />
                      <span className="admin-date">{project.scope}</span>
                      <span className="admin-post-meta__sep" />
                      <span className="admin-date">{project.year}</span>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <Link href={`/admin/work/${project.id}`} className="admin-btn-ghost"><Icon name="edit" size={15} /> Edit</Link>
                    {project.status === 'published' && <Link href={`/work/${project.slug}`} target="_blank" className="admin-btn-ghost"><Icon name="open_in_new" size={15} /> View</Link>}
                    <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(project.id)}><Icon name="delete" size={15} /> Delete</button>
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
