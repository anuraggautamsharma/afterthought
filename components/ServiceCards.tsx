'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface Service {
  num: string
  color: string
  title: string
  tags: string[]
  description: string
  deliverables: string[]
  for: string
}

// Walk offsetParent chain to get element's page-relative top (unaffected by sticky)
function getLayoutTop(el: HTMLElement): number {
  let top = 0
  let cur: HTMLElement | null = el
  while (cur) {
    top += cur.offsetTop
    cur = cur.offsetParent as HTMLElement | null
  }
  return top
}

export function ServiceCards({ services }: { services: Service[] }) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const NAV_H = 68        // nav height (64px) + 4px gap
    const PEEK  = mobile ? 8 : 12  // px each buried card peeks above the next

    const cards = Array.from(list.querySelectorAll<HTMLElement>('.svc-card'))
    const tweens: gsap.core.Tween[] = []

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return   // last card never scales down

      const next       = cards[i + 1]
      const nextTop    = getLayoutTop(next)
      const nextSticky = NAV_H + (i + 1) * PEEK

      const tween = gsap.fromTo(card,
        { scale: 1 },
        {
          scale: 0.94,
          ease: 'none',
          scrollTrigger: {
            // start = when next card's top enters the bottom of the viewport
            // end   = when next card has fully slid to its sticky position
            start: nextTop - window.innerHeight,
            end:   nextTop - nextSticky,
            scrub: 0.6,
          },
        }
      )

      tweens.push(tween)
    })

    ScrollTrigger.refresh()

    return () => {
      tweens.forEach(t => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [])

  return (
    <div ref={listRef} className="svc-list">
      {services.map((svc) => (
        <div
          key={svc.num}
          className={`svc-card svc-card--${svc.color}`}
          data-num={svc.num}
        >
          <div className="svc-card__top">
            <span className="svc-card__num">{svc.num}</span>
            <div className="svc-card__tags">
              {svc.tags.map(t => (
                <span key={t} className="svc-tag">{t}</span>
              ))}
            </div>
          </div>

          <h2 className="svc-card__title">{svc.title}</h2>
          <p className="svc-card__desc">{svc.description}</p>

          <div className="svc-card__rule" />

          <div className="svc-card__bottom">
            <div>
              <span className="svc-card__label">What we deliver</span>
              <ul className="svc-deliverables">
                {svc.deliverables.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <div>
              <span className="svc-card__label">Who it&apos;s for</span>
              <p className="svc-card__for">{svc.for}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
