'use client'

import { usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function Nav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prev => !prev)
  }, [])

  const isActive = (path: string) => {
    if (path === '/work') {
      return pathname === '/work' || pathname.startsWith('/work/')
    }
    return pathname === path
  }

  return (
    <nav className="top-nav" aria-label="Primary">
      <div className="top-nav__inner">
        <a href="/" className="wordmark" aria-label="Afterthought home">
          <img src="/assets/logo-horizontal.png" alt="Afterthought" />
        </a>
        <ul className="nav-links" role="list">
          <li><a className={`nav-link${isActive('/work') ? ' is-active' : ''}`} href="/work">Work</a></li>
          <li><a className={`nav-link${isActive('/studio') ? ' is-active' : ''}`} href="/studio">Studio</a></li>
          <li><a className={`nav-link${isActive('/thinking') ? ' is-active' : ''}`} href="/thinking">Thinking</a></li>
          <li><a className={`nav-link${isActive('/contact') ? ' is-active' : ''}`} href="/contact">Contact</a></li>
        </ul>
        <button
          className="mobile-toggle"
          aria-label="Open menu"
          data-drawer-toggle
          onClick={toggleDrawer}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      <div className={`mobile-drawer${drawerOpen ? ' is-open' : ''}`} id="drawer">
        <ul>
          <li><a href="/work">Work</a></li>
          <li><a href="/studio">Studio</a></li>
          <li><a href="/thinking">Thinking</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a className="btn btn-primary" href="/contact">Start a project</a>
      </div>
    </nav>
  )
}
