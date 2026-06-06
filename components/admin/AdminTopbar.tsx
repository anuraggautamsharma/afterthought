'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/login/actions'

export default function AdminTopbar() {
  const pathname = usePathname()

  return (
    <div className="admin-topbar">
      <Link href="/admin/posts" className="admin-topbar__brand">
        <strong>Afterthought</strong>
        <span className="admin-topbar__sep">/</span>
        <span>CMS</span>
      </Link>

      <nav className="admin-topbar__nav">
        <Link
          href="/admin/posts"
          className={`admin-topbar__link ${pathname.startsWith('/admin/posts') ? 'is-active' : ''}`}
        >
          Posts
        </Link>
        <Link href="/" target="_blank" className="admin-topbar__link">
          View site ↗
        </Link>
      </nav>

      <div className="admin-topbar__actions">
        <form action={logoutAction}>
          <button type="submit" className="admin-topbar__signout">Sign out</button>
        </form>
      </div>
    </div>
  )
}
