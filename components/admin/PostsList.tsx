'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeletePostButton from './DeletePostButton'
import type { Post } from '@/lib/posts'

type Filter = 'all' | 'published' | 'draft'

function formatDate(str: string | null) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PostsList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const published = posts.filter(p => p.status === 'published').length
  const drafts    = posts.filter(p => p.status === 'draft').length
  const filtered  = filter === 'all' ? posts : posts.filter(p => p.status === filter)

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
            <div className="admin-empty__title">No {filter === 'draft' ? 'drafts' : 'published posts'} yet.</div>
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          {filtered.map(post => (
            <div key={post.id} className="admin-posts-table__row">
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
                {post.excerpt && (
                  <p className="admin-post-excerpt">{post.excerpt}</p>
                )}
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
