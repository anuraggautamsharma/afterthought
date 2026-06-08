'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import type { Form } from '@/lib/forms'
import ShareFormButton from './ShareFormButton'
import DeleteFormButton from './DeleteFormButton'
import { ListToolbar, SearchField, SortSelect } from '@/components/admin/list/ListControls'

export type FormWithCount = Form & { responseCount: number }

type Filter = 'all' | 'published' | 'draft'
type Sort = 'recent' | 'title' | 'responses'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'recent', label: 'Newest first' },
  { value: 'responses', label: 'Most responses' },
  { value: 'title', label: 'Title A–Z' },
]

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function FormsGrid({ forms }: { forms: FormWithCount[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('recent')

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
      </ListToolbar>

      {filtered.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty__title">No matches{query ? ` for “${query}”` : ''}.</div></div>
      ) : (
        <div className="admin-forms-grid">
          {filtered.map(form => (
            <div key={form.id} className="admin-form-card">
              <div className="admin-form-card__header">
                <h3 className="admin-form-card__title">
                  <Link href={`/admin/forms/${form.id}/edit`} className="admin-form-card__title-link">
                    {form.title || 'Untitled form'}
                  </Link>
                </h3>
                <span className={`admin-status-badge admin-status-badge--${form.status}`}>
                  <span className="admin-status-badge__dot" />
                  {form.status}
                </span>
              </div>

              {form.description && <p className="admin-form-card__desc">{form.description}</p>}

              <div className="admin-form-card__meta">
                <span className="admin-form-card__slug">/{form.slug}</span>
                <span className="admin-form-card__sep" />
                <span className="admin-form-card__responses">{form.responseCount} response{form.responseCount !== 1 ? 's' : ''}</span>
                <span className="admin-form-card__sep" />
                <span className="admin-form-card__date">Created {formatDate(form.created_at)}</span>
              </div>

              <div className="admin-form-card__actions">
                <Link href={`/admin/forms/${form.id}/edit`} className="admin-btn-ghost"><Icon name="edit" size={15} /> Edit</Link>
                <Link href={`/admin/inbox?form=${form.id}`} className="admin-btn-ghost"><Icon name="inbox" size={15} /> Responses</Link>
                <Link href={`/admin/forms/${form.id}/settings`} className="admin-btn-ghost"><Icon name="settings" size={15} /> Settings</Link>
                <ShareFormButton formId={form.id} slug={form.slug} status={form.status} />
                {form.status === 'published' && (
                  <Link href={`/forms/${form.slug}`} target="_blank" className="admin-btn-ghost"><Icon name="open_in_new" size={15} /> View</Link>
                )}
                <DeleteFormButton formId={form.id} title={form.title} isSystem={form.is_system} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
