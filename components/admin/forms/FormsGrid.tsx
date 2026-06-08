'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import type { Form, FormCategory } from '@/lib/forms'
import { FORM_CATEGORY_LABELS } from '@/lib/forms'
import ShareFormButton from './ShareFormButton'
import DeleteFormButton from './DeleteFormButton'
import { bulkDeleteFormsAction, bulkSetFormStatusAction, publishFormAction, updateFormAction } from '@/app/admin/forms/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'
import { ListToolbar, SearchField, SortSelect, BulkBar, Checkbox, TableHead } from '@/components/admin/list/ListControls'

export type FormWithCount = Form & { responseCount: number }

type Filter = 'all' | 'published' | 'draft'
type Sort = 'recent' | 'title' | 'responses'
type View = 'list' | 'grid'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'recent', label: 'Newest first' },
  { value: 'responses', label: 'Most responses' },
  { value: 'title', label: 'Title A–Z' },
]

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function categoryLabel(cat: string) {
  return FORM_CATEGORY_LABELS[cat as FormCategory] ?? cat
}

export default function FormsGrid({ forms: initialForms }: { forms: FormWithCount[] }) {
  const [forms, setForms] = useState(initialForms)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [view, setView] = useState<View>('list')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const handlePublishToggle = async (form: FormWithCount) => {
    try {
      if (form.status === 'published') {
        await updateFormAction(form.id, { status: 'draft' })
        setForms(prev => prev.map(f => f.id === form.id ? { ...f, status: 'draft' } : f))
        toast.success('Set to draft')
      } else {
        await publishFormAction(form.id)
        setForms(prev => prev.map(f => f.id === form.id ? { ...f, status: 'published' } : f))
        toast.success('Published!')
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const published = forms.filter(f => f.status === 'published').length
  const drafts = forms.filter(f => f.status === 'draft').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = filter === 'all' ? forms : forms.filter(f => f.status === filter)
    if (q) list = list.filter(f =>
      (f.title ?? '').toLowerCase().includes(q) ||
      (f.description ?? '').toLowerCase().includes(q) ||
      (f.slug ?? '').toLowerCase().includes(q)
    )
    const out = [...list]
    if (sort === 'recent') out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sort === 'responses') out.sort((a, b) => b.responseCount - a.responseCount)
    else out.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    return out
  }, [forms, filter, query, sort])

  // System forms can't be deleted — exclude from selectable set
  const selectable = filtered.filter(f => !f.is_system)
  const allSelected = selectable.length > 0 && selectable.every(f => selected.has(f.id))
  const selCount = selected.size
  const ids = () => [...selected]
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(selectable.map(f => f.id)))
  const clear = () => setSelected(new Set())
  const runBulk = (fn: () => Promise<void>, done: string) =>
    startTransition(async () => { try { await fn(); toast.success(done); clear() } catch { toast.error('Action failed') } })

  const onBulkDelete = async () => {
    const confirmed = await openConfirm({
      title: `Delete ${selCount} form${selCount !== 1 ? 's' : ''}?`,
      message: 'All their responses will be deleted too. This cannot be undone.',
      confirmLabel: 'Delete', danger: true,
    })
    if (confirmed) runBulk(() => bulkDeleteFormsAction(ids()), 'Forms deleted')
  }

  const RowActions = ({ form, compact = false }: { form: FormWithCount; compact?: boolean }) => {
    const c = compact ? ' admin-btn-ghost--icon' : ''
    return (
      <>
        <button
          type="button"
          className={form.status === 'published' ? `admin-btn-ghost${c}` : `admin-btn-primary admin-btn-primary--icon`}
          style={!compact ? { width: 'auto', padding: '5px 12px', fontSize: 12 } : undefined}
          title={form.status === 'published' ? 'Unpublish' : 'Publish'}
          onClick={() => handlePublishToggle(form)}
        >
          <Icon name={form.status === 'published' ? 'visibility_off' : 'visibility'} size={compact ? 16 : 14} />
          {!compact && <> {form.status === 'published' ? 'Unpublish' : 'Publish'}</>}
        </button>
        <Link href={`/admin/forms/${form.id}/edit`} className={`admin-btn-ghost${c}`} title="Edit">
          <Icon name="edit" size={compact ? 16 : 15} />{!compact && <> Edit</>}
        </Link>
        <Link href={`/admin/inbox?form=${form.id}`} className={`admin-btn-ghost${c}`} title="Responses">
          <Icon name="inbox" size={compact ? 16 : 15} />{!compact && <> Responses</>}
        </Link>
        <Link href={`/admin/forms/${form.id}/settings`} className={`admin-btn-ghost${c}`} title="Settings">
          <Icon name="settings" size={compact ? 16 : 15} />{!compact && <> Settings</>}
        </Link>
        <ShareFormButton formId={form.id} slug={form.slug} status={form.status} iconOnly={compact} />
        {form.status === 'published' && (
          <Link href={`/forms/${form.slug}`} target="_blank" className={`admin-btn-ghost${c}`} title="View live">
            <Icon name="open_in_new" size={compact ? 16 : 15} />{!compact && <> View</>}
          </Link>
        )}
        <DeleteFormButton formId={form.id} title={form.title} isSystem={form.is_system} iconOnly={compact} />
      </>
    )
  }

  return (
    <>
      <ListToolbar tabs={
        <div className="admin-filter-tabs">
          {(['all', 'published', 'draft'] as Filter[]).map(tab => (
            <button key={tab} className={`admin-filter-tab ${filter === tab ? 'is-active' : ''}`} onClick={() => setFilter(tab)}>
              {tab === 'all' ? 'All' : tab === 'published' ? 'Published' : 'Drafts'}
              <span className="admin-filter-tab__count">{tab === 'all' ? forms.length : tab === 'published' ? published : drafts}</span>
            </button>
          ))}
        </div>
      }>
        <SearchField value={query} onChange={setQuery} placeholder="Search forms…" />
        <SortSelect value={sort} onChange={setSort} options={SORTS} />
        <div className="admin-viewtoggle">
          <button className={`admin-viewtoggle__btn ${view === 'list' ? 'is-active' : ''}`} onClick={() => setView('list')} aria-label="List view"><Icon name="view_list" size={18} /></button>
          <button className={`admin-viewtoggle__btn ${view === 'grid' ? 'is-active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view"><Icon name="grid_view" size={16} /></button>
        </div>
      </ListToolbar>

      {selCount > 0 && (
        <BulkBar count={selCount} onClear={clear}>
          <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkSetFormStatusAction(ids(), 'published'), 'Published')}><Icon name="visibility" size={16} /> Publish</button>
          <button className="admin-btn-ghost" disabled={pending} onClick={() => runBulk(() => bulkSetFormStatusAction(ids(), 'draft'), 'Moved to draft')}><Icon name="visibility_off" size={16} /> Move to draft</button>
          <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onBulkDelete}><Icon name="delete" size={16} /> Delete</button>
        </BulkBar>
      )}

      {filtered.length === 0 ? (
        <div className="admin-posts-table"><div className="admin-empty"><div className="admin-empty__title">No matches{query ? ` for “${query}”` : ''}.</div></div></div>
      ) : view === 'grid' ? (
        <div className="admin-forms-grid">
          {filtered.map(form => (
            <div key={form.id} className="admin-form-card">
              <div className="admin-form-card__header">
                <h3 className="admin-form-card__title">
                  <Link href={`/admin/forms/${form.id}/edit`} className="admin-form-card__title-link">{form.title || 'Untitled form'}</Link>
                </h3>
                <span className={`admin-status-badge admin-status-badge--${form.status}`}><span className="admin-status-badge__dot" />{form.status}</span>
              </div>
              {form.description && <p className="admin-form-card__desc">{form.description}</p>}
              <div className="admin-form-card__meta">
                <span className="admin-form-card__slug">/{form.slug}</span>
                <span className="admin-form-card__sep" />
                <span className="admin-form-card__responses">{form.responseCount} response{form.responseCount !== 1 ? 's' : ''}</span>
                <span className="admin-form-card__sep" />
                <span className="admin-form-card__date">Created {formatDate(form.created_at)}</span>
              </div>
              <div className="admin-form-card__actions"><RowActions form={form} /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-posts-table">
          <TableHead allSelected={allSelected} onToggleAll={toggleAll} label={allSelected ? 'All selected' : `${filtered.length} form${filtered.length !== 1 ? 's' : ''}`} />
          {filtered.map(form => (
            <div key={form.id} className={`admin-posts-table__row ${selected.has(form.id) ? 'is-selected' : ''}`}>
              {form.is_system ? (
                <span className="admin-checkbox admin-checkbox--locked" title="Built-in form"><Icon name="lock" size={14} /></span>
              ) : (
                <Checkbox checked={selected.has(form.id)} onChange={() => toggle(form.id)} label={`Select ${form.title}`} />
              )}
              <div className="admin-post-content">
                <div className="admin-post-title-row">
                  <Link href={`/admin/forms/${form.id}/edit`} className="admin-post-title-link">{form.title || 'Untitled form'}</Link>
                  <span className={`admin-status-badge admin-status-badge--${form.status}`}><span className="admin-status-badge__dot" />{form.status}</span>
                  {form.is_system && <span className="admin-tag-chip">Built-in</span>}
                </div>
                {form.description && <p className="admin-post-excerpt">{form.description}</p>}
                <div className="admin-post-meta">
                  <span className="admin-post-category">{categoryLabel(form.category)}</span>
                  <span className="admin-post-meta__sep" />
                  <span className="admin-date">/{form.slug}</span>
                  <span className="admin-post-meta__sep" />
                  <span className="admin-date">{form.responseCount} response{form.responseCount !== 1 ? 's' : ''}</span>
                  <span className="admin-post-meta__sep" />
                  <span className="admin-date">Created {formatDate(form.created_at)}</span>
                </div>
              </div>
              <div className="admin-row-actions admin-row-actions--icons"><RowActions form={form} compact /></div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
