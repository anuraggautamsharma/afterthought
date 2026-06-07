import Link from 'next/link'
import { getSubmissions, countUnread } from '@/lib/submissions'
import { getAllPosts, getPublishedPosts } from '@/lib/posts'
import { getAllProjects, getPublishedProjects } from '@/lib/projects'
import { getOpenJobs } from '@/lib/jobs'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  contact: 'Brief',
  newsletter: 'Newsletter',
  application: 'Application',
  freelance: 'Freelance',
}

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

export default async function AdminDashboard() {
  let unread = 0
  let submissions: Awaited<ReturnType<typeof getSubmissions>> = []
  let allPosts: Awaited<ReturnType<typeof getAllPosts>> = []
  let publishedPosts: Awaited<ReturnType<typeof getPublishedPosts>> = []
  let allProjects: Awaited<ReturnType<typeof getAllProjects>> = []
  let publishedProjects: Awaited<ReturnType<typeof getPublishedProjects>> = []
  let openJobs: Awaited<ReturnType<typeof getOpenJobs>> = []

  try { unread = await countUnread() } catch {}
  try { submissions = await getSubmissions() } catch {}
  try { allPosts = await getAllPosts() } catch {}
  try { publishedPosts = await getPublishedPosts() } catch {}
  try { allProjects = await getAllProjects() } catch {}
  try { publishedProjects = await getPublishedProjects() } catch {}
  try { openJobs = await getOpenJobs() } catch {}

  const recentSubmissions = submissions.slice(0, 5)
  const briefs = submissions.filter(s => s.type === 'contact').length
  const applications = submissions.filter(s => s.type === 'application').length
  const newsletter = submissions.filter(s => s.type === 'newsletter').length

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title" style={{ marginBottom: '28px' }}>Dashboard</h1>

      <div className="admin-dashboard__grid">
        {/* Inbox card */}
        <div className="admin-dash-card">
          <div className="admin-dash-card__title">Inbox</div>

          <div className="admin-dash-stat">
            <span className={`admin-dash-stat__num ${unread > 0 ? 'admin-dash-stat__num--alert' : ''}`}>
              {unread}
            </span>
            <span className="admin-dash-stat__label">unread</span>
          </div>

          {submissions.length > 0 && (
            <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              {briefs} brief{briefs !== 1 ? 's' : ''} · {applications} application{applications !== 1 ? 's' : ''} · {newsletter} newsletter
            </p>
          )}

          {unread === 0 && submissions.length === 0 ? (
            <div className="admin-dash-empty">
              <span>✓</span> Inbox clear
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
                {recentSubmissions.map(s => (
                  <Link key={s.id} href={`/admin/inbox/${s.id}`} className="admin-dash-inbox-row">
                    <span className={`admin-inbox-badge admin-inbox-badge--${s.type}`}>
                      {TYPE_LABELS[s.type] ?? s.type}
                    </span>
                    <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name || s.email || '(no name)'}
                    </span>
                    <span style={{ fontSize: '11px', opacity: 0.4, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                      {timeAgo(s.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/admin/inbox" style={{ fontSize: '13px', color: 'var(--c-ink)', opacity: 0.5, textDecoration: 'none' }}>
                View all →
              </Link>
            </>
          )}
        </div>

        {/* Content card */}
        <div className="admin-dash-card">
          <div className="admin-dash-card__title">Content</div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="admin-dash-stat">
              <span className="admin-dash-stat__num">{publishedPosts.length}</span>
              <span className="admin-dash-stat__label">published post{publishedPosts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="admin-dash-stat">
              <span className="admin-dash-stat__num">{publishedProjects.length}</span>
              <span className="admin-dash-stat__label">project{publishedProjects.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="admin-dash-stat">
              <span className="admin-dash-stat__num">{openJobs.length}</span>
              <span className="admin-dash-stat__label">open job{openJobs.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <p style={{ fontSize: '12px', opacity: 0.4, marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            {allPosts.length} total posts · {allProjects.length} total projects
          </p>

          <div className="admin-dash-quick-actions">
            <Link href="/admin/posts/new" className="admin-btn-secondary"
              style={{ width: 'auto', fontSize: '13px', padding: '9px 16px', textDecoration: 'none' }}>
              + New post
            </Link>
            <Link href="/admin/work/new" className="admin-btn-secondary"
              style={{ width: 'auto', fontSize: '13px', padding: '9px 16px', textDecoration: 'none' }}>
              + New project
            </Link>
            <Link href="/admin/jobs/new" className="admin-btn-secondary"
              style={{ width: 'auto', fontSize: '13px', padding: '9px 16px', textDecoration: 'none' }}>
              + New job
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
