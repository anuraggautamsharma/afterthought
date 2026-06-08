'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import { logoutAction } from '@/app/admin/login/actions'

function getActiveSection(pathname: string): string {
  if (pathname.startsWith('/admin/inbox')) return 'inbox'
  if (pathname.startsWith('/admin/posts')) return 'posts'
  if (pathname.startsWith('/admin/forms')) return 'forms'
  if (pathname.startsWith('/admin/work')) return 'work'
  if (pathname.startsWith('/admin/media')) return 'media'
  if (pathname.startsWith('/admin/services')) return 'services'
  if (pathname.startsWith('/admin/jobs')) return 'jobs'
  if (pathname.startsWith('/admin/team')) return 'team'
  if (pathname.startsWith('/admin/users')) return 'users'
  if (pathname.startsWith('/admin/settings')) return 'settings'
  return ''
}

export default function AdminSidebar({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const activeSection = getActiveSection(pathname)

  // Restore collapsed preference (desktop only).
  useEffect(() => {
    if (localStorage.getItem('admin-sidebar-collapsed') === '1') setCollapsed(true)
  }, [])

  const toggleCollapsed = () =>
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0')
      return next
    })

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const link = (
    href: string,
    section: string,
    label: string,
    svg: React.ReactNode,
    badge?: number,
  ) => (
    <Link
      href={href}
      data-section={section}
      title={label}
      className={`admin-sidebar__link ${pathname.startsWith(href) ? 'is-active' : ''}`}
    >
      <span className="admin-sidebar__link-icon">{svg}</span>
      <span className="admin-sidebar__link-label">{label}</span>
      {badge && badge > 0 ? <span className="admin-sidebar__badge">{badge}</span> : null}
    </Link>
  )

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
        <div className="admin-sidebar__brand-text">
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
        {link('/admin/inbox', 'inbox', 'Responses', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        ), unread)}
        {link('/admin/posts', 'posts', 'Posts', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        ))}
        {link('/admin/forms', 'forms', 'Forms', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        ))}
        {link('/admin/work', 'work', 'Work', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        ))}
        {link('/admin/media', 'media', 'Media', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        ))}
        {link('/admin/services', 'services', 'Services', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
        ))}
        {link('/admin/jobs', 'jobs', 'Jobs', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        ))}
        {link('/admin/team', 'team', 'Team', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ))}
        {link('/admin/users', 'users', 'Users', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        ))}
        {link('/admin/settings', 'settings', 'Settings', (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <a href="/" target="_blank" className="admin-sidebar__footer-link" title="View site">
          <span className="admin-sidebar__link-icon"><Icon name="open_in_new" size={16} /></span>
          <span className="admin-sidebar__link-label">View site</span>
        </a>
        <form action={logoutAction}>
          <button type="submit" className="admin-sidebar__footer-link admin-sidebar__signout" title="Sign out">
            <span className="admin-sidebar__link-icon"><Icon name="logout" size={16} /></span>
            <span className="admin-sidebar__link-label">Sign out</span>
          </button>
        </form>
        {/* Collapse toggle — desktop only (hidden on mobile drawer via CSS) */}
        <button
          type="button"
          className="admin-sidebar__collapse"
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="admin-sidebar__link-icon">
            <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} size={18} />
          </span>
          <span className="admin-sidebar__link-label">Collapse</span>
        </button>
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
      <aside
        className={`admin-sidebar ${open ? 'is-open' : ''} ${collapsed ? 'admin-sidebar--collapsed' : ''}`}
        data-section={activeSection}
      >
        {nav}
      </aside>
    </>
  )
}
