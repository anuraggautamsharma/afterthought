import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { deletePostAction } from './actions'

export const dynamic = 'force-dynamic'

function formatDate(str: string | null) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-page-title">Posts</h1>
        <Link href="/admin/posts/new" className="btn btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No posts yet.</div>
            <p>Write your first essay and publish it when it&apos;s ready.</p>
            <Link href="/admin/posts/new" className="btn btn-primary">Write something →</Link>
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          <div className="admin-posts-table__header">
            <span className="admin-posts-table__col-label">Title</span>
            <span className="admin-posts-table__col-label">Status</span>
            <span className="admin-posts-table__col-label">Date</span>
            <span className="admin-posts-table__col-label" style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {posts.map(post => (
            <div key={post.id} className="admin-posts-table__row">
              <div className="admin-post-title-cell">
                <Link href={`/admin/posts/${post.id}`}>{post.title || '(Untitled)'}</Link>
                <span className="admin-post-category">{post.category}</span>
              </div>

              <div>
                <span className={`admin-status-badge admin-status-badge--${post.status}`}>
                  <span className="admin-status-badge__dot" />
                  {post.status}
                </span>
              </div>

              <div className="admin-date">
                {post.status === 'published' ? formatDate(post.published_at) : formatDate(post.created_at)}
              </div>

              <div className="admin-row-actions">
                <Link href={`/admin/posts/${post.id}`} className="admin-btn-ghost">Edit</Link>
                {post.status === 'published' && (
                  <Link href={`/thinking/${post.slug}`} target="_blank" className="admin-btn-ghost">View ↗</Link>
                )}
                <form action={deletePostAction.bind(null, post.id)} style={{ display: 'inline' }}>
                  <button type="submit" className="admin-btn-ghost admin-btn-ghost--danger"
                    onClick={e => { if (!confirm('Delete this post?')) e.preventDefault() }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
