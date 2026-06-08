'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import type { Service } from '@/lib/services'
import {
  deleteServiceAction, seedServicesAction, reorderServiceAction,
  bulkDeleteServicesAction,
} from '@/app/admin/services/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'
import { ListToolbar, SearchField, SortSelect, BulkBar, Checkbox, TableHead } from './list/ListControls'

type Sort = 'order' | 'title'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'order', label: 'Manual order' },
  { value: 'title', label: 'Title A–Z' },
]

export default function ServicesList({ services }: { services: Service[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('order')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const reorderable = sort === 'order' && !query.trim()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = services
    if (q) list = list.filter(s =>
      (s.title ?? '').toLowerCase().includes(q) ||
      (s.description ?? '').toLowerCase().includes(q) ||
      (s.tags ?? []).join(' ').toLowerCase().includes(q)
    )
    const out = [...list]
    if (sort === 'title') out.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    return out
  }, [services, query, sort])

  const allSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id))
  const selCount = selected.size
  const ids = () => [...selected]
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(s => s.id)))
  const clear = () => setSelected(new Set())

  const handleImport = () => startTransition(async () => {
    setMsg('Importing…')
    const res = await seedServicesAction()
    setMsg(res.error ? res.error : `Imported ${res.count} services`)
  })

  const handleDelete = (id: string) => startTransition(async () => {
    const confirmed = await openConfirm({ title: 'Delete service?', message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (!confirmed) return
    await deleteServiceAction(id)
  })

  const handleReorder = (id: string, direction: 'up' | 'down') =>
    startTransition(async () => { try { await reorderServiceAction(id, direction) } catch { toast.error('Failed to reorder') } })

  const onBulkDelete = async () => {
    const confirmed = await openConfirm({ title: `Delete ${selCount} service${selCount !== 1 ? 's' : ''}?`, message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (!confirmed) return
    startTransition(async () => { try { await bulkDeleteServicesAction(ids()); toast.success('Services deleted'); clear() } catch { toast.error('Action failed') } })
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Services</h1>
          <p className="admin-page-subtitle">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/services/new" className="admin-btn-primary admin-btn-primary--icon" style={{ width: 'auto', padding: '10px 18px', fontSize: '14px', textDecoration: 'none' }}>
          <Icon name="add" size={18} /> New service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No services yet.</div>
            <p>Import your seven existing services with all the copy pre-filled.</p>
            <button className="admin-btn-primary" disabled={pending} onClick={handleImport} style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
              {pending ? 'Importing…' : 'Import existing services'}
            </button>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <>
          <ListToolbar>
            <SearchField value={query} onChange={setQuery} placeholder="Search services…" />
            <SortSelect value={sort} onChange={setSort} options={SORTS} />
          </ListToolbar>

          {selCount > 0 && (
            <BulkBar count={selCount} onClear={clear}>
              <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onBulkDelete}><Icon name="delete" size={16} /> Delete</button>
            </BulkBar>
          )}

          {filtered.length === 0 ? (
            <div className="admin-posts-table"><div className="admin-empty"><div className="admin-empty__title">No matches{query ? ` for “${query}”` : ''}.</div></div></div>
          ) : (
            <div className="admin-posts-table">
              <TableHead allSelected={allSelected} onToggleAll={toggleAll} label={allSelected ? 'All selected' : `${filtered.length} service${filtered.length !== 1 ? 's' : ''}`} />
              {filtered.map((svc, idx) => (
                <div key={svc.id} className={`admin-posts-table__row ${selected.has(svc.id) ? 'is-selected' : ''}`}>
                  <Checkbox checked={selected.has(svc.id)} onChange={() => toggle(svc.id)} label={`Select ${svc.title}`} />
                  {reorderable && (
                    <div className="admin-reorder-col">
                      <button className="admin-reorder-btn" disabled={idx === 0 || pending} onClick={() => handleReorder(svc.id, 'up')} aria-label="Move up">↑</button>
                      <button className="admin-reorder-btn" disabled={idx === filtered.length - 1 || pending} onClick={() => handleReorder(svc.id, 'down')} aria-label="Move down">↓</button>
                    </div>
                  )}
                  <div className="admin-post-content">
                    <div className="admin-post-title-row">
                      <Link href={`/admin/services/${svc.id}`} className="admin-post-title-link">
                        <span style={{ opacity: 0.4, fontFamily: 'var(--font-mono)', fontSize: '13px', marginRight: '8px' }}>{svc.num}</span>
                        {svc.title || '(Untitled)'}
                      </Link>
                    </div>
                    {svc.description && <p className="admin-post-excerpt">{svc.description}</p>}
                    <div className="admin-post-meta">
                      <span className="admin-post-category">{svc.tags?.join(' · ')}</span>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <Link href={`/admin/services/${svc.id}`} className="admin-btn-ghost"><Icon name="edit" size={15} /> Edit</Link>
                    <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(svc.id)}><Icon name="delete" size={15} /> Delete</button>
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
