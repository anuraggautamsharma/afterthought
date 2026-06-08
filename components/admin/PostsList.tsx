'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import DeletePostButton from './DeletePostButton'
import { bulkDeletePostsAction, bulkSetPostStatusAction } from '@/app/admin/posts/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'
import type { Post } from '@/lib/posts'

type Filter = 'all' | 'published' | 'draft'
type Sort = 'recent' | 'oldest' | 'title' | 'edited'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'recent', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'edited', label: 'Recently edited' },
  { value: 'title', label: 'Title A–Z' },
]

function formatDate(str: string | null) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function postDate(p: Post) {
  return new Date(p.published_at || p.updated_at || 0).getTime()
}

export default function PostsList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = filter === 'all' ? posts : posts.filter(p => p.status === filter)
    if (q) {
      list = list.filter(p =>
        (p.title ?? '').toLowerCase().includes(q) ||
        (p.excerpt ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      )
    }
    const sorted = [...list]
    switch (sort) {
      case 'recent': sorted.sort((a, b) => postDate(b) - postDate(a)); break
      case 'oldest': sorted.sort((a, b) => postDate(a) - postDate(b)); break
      case 'edited': sorted.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()); break
      case 'title': sorted.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')); break
    }
    return sorted
  }, [posts, filter, query, sort])

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id))
  const selCount = selected.size

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(filtered.map(p => p.id)))

  const clear = () => setSelected(new Set())

  const runBulk = (fn: () => Promise<void>, done: string) =>
    startTransition(async () => {
      try { await fn(); toast.success(done); clear() }
      catch { toast.error('Action failed') }
    })

  const ids = () => [...selected]

  const onBulkDelete = async () => {
    const confirmed = await openConfirm({
      title: `Delete ${selCount} post${selCount !== 1 ? 's' : ''}?`,
      message: 'This cannot be undone.',
      confirmLabel: 'Delete', danger: true,
    })
    if (!confirmed) return
    runBulk(() => bulkDeletePostsAction(ids()), 'Posts deleted')
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Posts</h1>
          <p className="admin-page-subtitle">{published} published · {drafts} draft{drafts !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/posts/new" className="admin-btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
          + New post
        </Link>
      </div>

      {posts.length > 0 && (
        <div className="admin-toolbar">
          <div className="admin-filter-tabs">
            {(['all', 'published', 'draft'] as Filter[]).map(tab => (
              <button
                key={tab}
                className={`admin-filter-tab ${filter === tab ? 'is-active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab === 'all' ? 'All' : tab === 'published' ? 'Published' : 'Drafts'}
                <span className="admin-filter-tab__count">
                  {tab === 'all' ? posts.length : tab === 'published' ? published : drafts}
                </span>
              </button>
            ))}
          </div>
          <div className="admin-toolbar__right">
            <div className="admin-search-field">
              <Icon name="search" size={18} className="admin-search-field__icon" />
              <input
                className="admin-search-field__input"
                placeholder="Search posts…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button className="admin-search-field__clear" onClick={() => setQuery('')} aria-label="Clear">
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
            <label className="admin-sort">
              <span className="admin-sort__label">Sort</span>
              <select className="admin-sort__select" value={sort} onChange={e => setSort(e.target.value as Sort)}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      {selCount > 0 && (
        <div className="admin-bulkbar">
          <span className="admin-bulkbar__count">{selCount} selected</span>
          <div className="admin-bulkbar__actions">
            <button className="admin-btn-ghost" disabled={pending}
              onClick={() => runBulk(() => bulkSetPostStatusAction(ids(), 'published'), 'Published')}>
              Publish
            </button>
            <button className="admin-btn-ghost" disabled={pending}
              onClick={() => runBulk(() => bulkSetPostStatusAction(ids(), 'draft'), 'Moved to draft')}>
              Move to draft
            </button>
            <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onBulkDelete}>
              Delete
            </button>
          </div>
          <button className="admin-bulkbar__clear" onClick={clear}>Clear</button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No posts yet.</div>
            <p>Write your first essay and publish it when it&apos;s ready.</p>
            <Link href="/admin/posts/new" className="admin-btn-primary" style={{ width: 'auto', display: 'inline-flex', textDecoration: 'none', fontSize: '15px' }}>
              Write something →
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No matches{query ? ` for “${query}”` : ''}.</div>
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          <div className="admin-table-head">
            <label className="admin-checkbox">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
              <span className="admin-checkbox__box" />
            </label>
            <span className="admin-table-head__label">
              {allSelected ? 'All selected' : `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {filtered.map(post => (
            <div key={post.id} className={`admin-posts-table__row ${selected.has(post.id) ? 'is-selected' : ''}`}>
              <label className="admin-checkbox">
                <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggle(post.id)} aria-label={`Select ${post.title}`} />
                <span className="admin-checkbox__box" />
              </label>
              <div className="admin-post-content">
                <div className="admin-post-title-row">
                  <Link href={`/admin/posts/${post.id}`} className="admin-post-title-link">
                    {post.title || '(Untitled)'}
                  </Link>
                  <span className={`admin-status-badge admin-status-badge--${post.status}`}>
                    <span className="admin-status-badge__dot" />
                    {post.status}
                  </span>
                </div>
                {post.excerpt && <p className="admin-post-excerpt">{post.excerpt}</p>}
                <div className="admin-post-meta">
                  <span className="admin-post-category">{post.category}</span>
                  <span className="admin-post-meta__sep" />
                  {post.read_time > 0 && (
                    <>
                      <span className="admin-date">{post.read_time} min read</span>
                      <span className="admin-post-meta__sep" />
                    </>
                  )}
                  <span className="admin-date">
                    {post.status === 'published' ? formatDate(post.published_at) : `Edited ${formatDate(post.updated_at)}`}
                  </span>
                </div>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/posts/${post.id}`} className="admin-btn-ghost">Edit</Link>
                {post.status === 'published' && post.slug && (
                  <Link href={`/thinking/${post.slug}`} target="_blank" className="admin-btn-ghost">View ↗</Link>
                )}
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
