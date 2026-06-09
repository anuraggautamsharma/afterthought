'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/toc'

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = headings
      .map(h => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el)
    if (!els.length) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (!visible.length) return
        // Highlight the heading nearest the top of the viewport.
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        )
        setActive(top.target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  return (
    <aside className="post-toc" aria-label="Table of contents">
      <div className="post-toc__inner">
        <span className="post-toc__label">On this page</span>
        <nav>
          <ul className="post-toc__list">
            {headings.map(h => (
              <li
                key={h.id}
                className={`post-toc__item post-toc__item--h${h.level} ${active === h.id ? 'is-active' : ''}`}
              >
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
