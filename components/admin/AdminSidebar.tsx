'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/login/actions'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const nav = (
    <>
      <div className="admin-sidebar__brand">
        <Image
          src="/assets/logo-mark.png"
          alt="Afterthought"
          width={28}
          height={28}
          className="admin-sidebar__logo"
        />
        <div>
          <span className="admin-sidebar__brand-name">Afterthought</span>
          <span className="admin-sidebar__brand-sub">CMS</span>
        </div>
        <button
          className="admin-sidebar__close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="admin-sidebar__nav">
        <Link
          href="/admin/posts"
          className={`admin-sidebar__link ${pathname.startsWith('/admin/posts') ? 'is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
          Posts
        </Link>
        <Link
          href="/admin/media"
          className={`admin-sidebar__link ${pathname.startsWith('/admin/media') ? 'is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
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
    </>
  )

  return (
    <>
      {/* Mobile topbar */}
      <header className="admin-mobile-topbar">
        <div className="admin-mobile-topbar__brand">
          <Image src="/assets/logo-mark.png" alt="Afterthought" width={22} height={22} className="admin-sidebar__logo" />
          <span className="admin-mobile-topbar__name">Afterthought</span>
        </div>
        <button
          className="admin-mobile-topbar__hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div className="admin-sidebar-backdrop" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
        {nav}
      </aside>
    </>
  )
}
