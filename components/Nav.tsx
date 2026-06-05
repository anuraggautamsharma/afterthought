'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/work',     label: 'Work' },
  { href: '/studio',   label: 'Studio' },
  { href: '/thinking', label: 'Thinking' },
  { href: '/contact',  label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/work'
      ? pathname === '/work' || pathname.startsWith('/work/')
      : pathname === href

  return (
    <>
      <nav className={`top-nav${open ? ' menu-open' : ''}`} aria-label="Primary">
        <div className="top-nav__inner">
          <a href="/" className="wordmark" aria-label="Afterthought home">
            <img src="/assets/logo-horizontal.png" alt="Afterthought" />
          </a>
          <button
            className="nav-menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <div
        className={`nav-overlay${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <ul className="nav-overlay__list">
          {links.map(({ href, label }) => (
            <li key={href} className="nav-overlay__item">
              <a
                href={href}
                className={`nav-overlay__link${isActive(href) ? ' is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <em>{label}</em>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-overlay__foot">
          <span className="nav-overlay__meta">Bangalore · Est. 2025 · Open for briefs</span>
          <div className="nav-overlay__socials">
            <a href="#" className="nav-overlay__social">Instagram</a>
            <a href="#" className="nav-overlay__social">LinkedIn</a>
            <a href="#" className="nav-overlay__social">Behance</a>
          </div>
        </div>
      </div>
    </>
  )
}
