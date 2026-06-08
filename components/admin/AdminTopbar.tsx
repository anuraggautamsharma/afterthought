'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import { logoutAction } from '@/app/admin/login/actions'
import { commandPalette } from '@/lib/commandStore'

const SECTION_LABELS: Record<string, string> = {
  inbox: 'Inbox', posts: 'Posts', forms: 'Forms', work: 'Work', media: 'Media',
  services: 'Services', jobs: 'Jobs', team: 'Team', users: 'Users', settings: 'Settings',
}

function buildCrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean)
  if (parts.length === 0) return [{ label: 'Dashboard', href: '/admin' }]

  const crumbs: { label: string; href: string }[] = [
    { label: SECTION_LABELS[parts[0]] ?? parts[0], href: `/admin/${parts[0]}` },
  ]
  // Second-level: new / edit / detail
  if (parts[1] === 'new') {
    crumbs.push({ label: 'New', href: pathname })
  } else if (parts[1]) {
    const leaf = parts[2] // edit / responses / settings
    const leafLabel = leaf
      ? leaf.charAt(0).toUpperCase() + leaf.slice(1)
      : 'Details'
    crumbs.push({ label: leafLabel, href: pathname })
  }
  return crumbs
}

export default function AdminTopbar({ email = '' }: { email?: string }) {
  const pathname = usePathname()
  const crumbs = buildCrumbs(pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const initial = (email.trim()[0] || 'A').toUpperCase()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="admin-topbar">
      {/* Breadcrumbs */}
      <nav className="admin-topbar__crumbs" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <span key={c.href + i} className="admin-topbar__crumb-wrap">
            {i > 0 && <Icon name="chevron_right" size={16} className="admin-topbar__crumb-sep" />}
            {i < crumbs.length - 1 ? (
              <Link href={c.href} className="admin-topbar__crumb">{c.label}</Link>
            ) : (
              <span className="admin-topbar__crumb admin-topbar__crumb--current">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Search trigger */}
      <button type="button" className="admin-topbar__search" onClick={() => commandPalette.open()}>
        <Icon name="search" size={18} />
        <span>Search…</span>
        <kbd className="admin-topbar__kbd">⌘K</kbd>
      </button>

      {/* Account menu */}
      <div className="admin-topbar__account" ref={menuRef}>
        <button
          type="button"
          className="admin-topbar__avatar"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Account menu"
        >
          {initial}
        </button>
        {menuOpen && (
          <div className="admin-topbar__menu">
            <div className="admin-topbar__menu-head">
              <div className="admin-topbar__menu-avatar">{initial}</div>
              <div className="admin-topbar__menu-id">
                <span className="admin-topbar__menu-name">Signed in</span>
                <span className="admin-topbar__menu-email">{email || 'admin'}</span>
              </div>
            </div>
            <div className="admin-topbar__menu-sep" />
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-topbar__menu-item">
              <Icon name="open_in_new" size={18} /> View site
            </a>
            <Link href="/admin/settings" className="admin-topbar__menu-item">
              <Icon name="settings" size={18} /> Settings
            </Link>
            <div className="admin-topbar__menu-sep" />
            <form action={logoutAction}>
              <button type="submit" className="admin-topbar__menu-item admin-topbar__menu-item--danger">
                <Icon name="logout" size={18} /> Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
