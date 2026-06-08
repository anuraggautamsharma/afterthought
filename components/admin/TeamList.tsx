'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import type { TeamMember } from '@/lib/team'
import {
  deleteTeamAction, seedTeamAction, reorderTeamAction,
  bulkDeleteTeamAction,
} from '@/app/admin/team/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'
import { ListToolbar, SearchField, SortSelect, BulkBar, Checkbox, TableHead } from './list/ListControls'

type Sort = 'order' | 'name'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'order', label: 'Manual order' },
  { value: 'name', label: 'Name A–Z' },
]

export default function TeamList({ team }: { team: TeamMember[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('order')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const reorderable = sort === 'order' && !query.trim()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = team
    if (q) list = list.filter(m =>
      (m.name ?? '').toLowerCase().includes(q) ||
      (m.role ?? '').toLowerCase().includes(q)
    )
    const out = [...list]
    if (sort === 'name') out.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
    return out
  }, [team, query, sort])

  const allSelected = filtered.length > 0 && filtered.every(m => selected.has(m.id))
  const selCount = selected.size
  const ids = () => [...selected]
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(m => m.id)))
  const clear = () => setSelected(new Set())

  const handleImport = () => startTransition(async () => {
    setMsg('Importing…')
    const res = await seedTeamAction()
    setMsg(res.error ? res.error : `Imported ${res.count} members`)
  })

  const handleDelete = (id: string) => startTransition(async () => {
    const confirmed = await openConfirm({ title: 'Delete team member?', message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (!confirmed) return
    await deleteTeamAction(id)
  })

  const handleReorder = (id: string, direction: 'up' | 'down') =>
    startTransition(async () => { try { await reorderTeamAction(id, direction) } catch { toast.error('Failed to reorder') } })

  const onBulkDelete = async () => {
    const confirmed = await openConfirm({ title: `Delete ${selCount} member${selCount !== 1 ? 's' : ''}?`, message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })
    if (!confirmed) return
    startTransition(async () => { try { await bulkDeleteTeamAction(ids()); toast.success('Members deleted'); clear() } catch { toast.error('Action failed') } })
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Team</h1>
          <p className="admin-page-subtitle">{team.length} member{team.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/team/new" className="admin-btn-primary admin-btn-primary--icon" style={{ width: 'auto', padding: '10px 18px', fontSize: '14px', textDecoration: 'none' }}>
          <Icon name="add" size={18} /> New member
        </Link>
      </div>

      {team.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No team members yet.</div>
            <p>Import the two founders with bios pre-filled — then add photos and social links.</p>
            <button className="admin-btn-primary" disabled={pending} onClick={handleImport} style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
              {pending ? 'Importing…' : 'Import founders'}
            </button>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <>
          <ListToolbar>
            <SearchField value={query} onChange={setQuery} placeholder="Search team…" />
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
              <TableHead allSelected={allSelected} onToggleAll={toggleAll} label={allSelected ? 'All selected' : `${filtered.length} member${filtered.length !== 1 ? 's' : ''}`} />
              {filtered.map((m, idx) => (
                <div key={m.id} className={`admin-posts-table__row ${selected.has(m.id) ? 'is-selected' : ''}`}>
                  <Checkbox checked={selected.has(m.id)} onChange={() => toggle(m.id)} label={`Select ${m.name}`} />
                  {reorderable && (
                    <div className="admin-reorder-col">
                      <button className="admin-reorder-btn" disabled={idx === 0 || pending} onClick={() => handleReorder(m.id, 'up')} aria-label="Move up">↑</button>
                      <button className="admin-reorder-btn" disabled={idx === filtered.length - 1 || pending} onClick={() => handleReorder(m.id, 'down')} aria-label="Move down">↓</button>
                    </div>
                  )}
                  <div className="admin-post-content">
                    <div className="admin-post-title-row">
                      <Link href={`/admin/team/${m.id}`} className="admin-post-title-link">{m.name || '(Unnamed)'}</Link>
                    </div>
                    <div className="admin-post-meta">
                      <span className="admin-post-category">{m.role}</span>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <Link href={`/admin/team/${m.id}`} className="admin-btn-ghost"><Icon name="edit" size={15} /> Edit</Link>
                    <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(m.id)}><Icon name="delete" size={15} /> Delete</button>
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
