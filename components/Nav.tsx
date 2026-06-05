'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/work',     label: 'Work',     desc: 'Brand Identity · Naming · Motion' },
  { href: '/studio',   label: 'Studio',   desc: 'About the studio'                 },
  { href: '/services', label: 'Services', desc: 'What we make'                     },
  { href: '/thinking', label: 'Thinking', desc: 'Journal & essays'                 },
  { href: '/careers',  label: 'Careers',  desc: 'Work with us'                     },
  { href: '/contact',  label: 'Contact',  desc: 'Start a brief'                    },
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
            <span className="nav-menu-btn__label">{open ? 'Close' : 'Menu'}</span>
            <span className="nav-menu-btn__icon" aria-hidden="true">
              <span className="nav-menu-btn__bar nav-menu-btn__bar--top"></span>
              <span className="nav-menu-btn__bar nav-menu-btn__bar--bot"></span>
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`nav-overlay${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="nav-overlay__inner">
          <ul className="nav-overlay__list">
            {links.map(({ href, label, desc }, i) => (
              <li key={href} className="nav-overlay__item">
                <a
                  href={href}
                  className={`nav-overlay__link${isActive(href) ? ' is-active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-overlay__num">0{i + 1}</span>
                  <span className="nav-overlay__label"><em>{label}</em></span>
                  <span className="nav-overlay__desc">{desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-overlay__foot">
          <div className="nav-overlay__foot-inner">
            <span className="nav-overlay__meta">Bangalore · Open for briefs</span>
            <div className="nav-overlay__socials">
              <a href="#" className="nav-overlay__social">Instagram</a>
              <a href="#" className="nav-overlay__social">LinkedIn</a>
              <a href="#" className="nav-overlay__social">Behance</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
