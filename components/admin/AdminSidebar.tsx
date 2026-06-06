'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/login/actions'

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__brand-name">Afterthought</span>
        <span className="admin-sidebar__brand-sub">CMS</span>
      </div>

      <nav className="admin-sidebar__nav">
        <Link
          href="/admin/posts"
          className={`admin-sidebar__link ${pathname.startsWith('/admin/posts') ? 'is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
          Posts
        </Link>
        <Link
          href="/admin/media"
          className={`admin-sidebar__link ${pathname.startsWith('/admin/media') ? 'is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
          Media
        </Link>
      </nav>

      <div className="admin-sidebar__footer">
        <a href="/" target="_blank" className="admin-sidebar__footer-link">
          View site ↗
        </a>
        <form action={logoutAction}>
          <button type="submit" className="admin-sidebar__footer-link admin-sidebar__signout">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
