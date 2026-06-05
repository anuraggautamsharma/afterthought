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

// Walk offsetParent chain → true layout top unaffected by sticky
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

    const mobile  = window.matchMedia('(max-width: 767px)').matches
    // These must match the CSS nth-child top values below
    const CARD1_TOP = mobile ? 72 : 128
    const PEEK      = mobile ? 8  : 14

    const cards    = Array.from(list.querySelectorAll<HTMLElement>('.svc-card'))
    const tweens: gsap.core.Tween[] = []

    // ── 1. Scale-down animation (card recedes as next slides over it) ──
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return

      const next          = cards[i + 1]
      const nextLayoutTop = getLayoutTop(next)
      const nextStickyTop = CARD1_TOP + (i + 1) * PEEK

      const tw = gsap.fromTo(card,
        { scale: 1 },
        {
          scale: 0.93,
          ease: 'none',
          scrollTrigger: {
            // fire when next card enters viewport bottom → completes when next card sticks
            start: nextLayoutTop - window.innerHeight,
            end:   nextLayoutTop - nextStickyTop,
            scrub: 0.5,
          },
        }
      )
      tweens.push(tw)
    })

    // ── 2. Entry animation (each card fades + rises as it enters) ──
    cards.forEach((card) => {
      // skip if already visible at page load
      if (card.getBoundingClientRect().top < window.innerHeight * 0.9) return

      // use the preceding spacer as trigger (non-sticky → reliable position)
      const prev    = card.previousElementSibling as HTMLElement | null
      const trigger = prev?.classList.contains('svc-spacer') ? prev : card
      const start   = prev?.classList.contains('svc-spacer') ? 'bottom 70%' : 'top 85%'

      const tw = gsap.from(card, {
        autoAlpha: 0,
        y: mobile ? 20 : 32,
        ease: 'power2.out',
        duration: mobile ? 0.5 : 0.65,
        scrollTrigger: {
          trigger,
          start,
          toggleActions: 'play none none none',
        },
      })
      tweens.push(tw)
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
      {services.map((svc, i) => (
        <>
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

          {/* Spacer — gives each card its own reading window before next one arrives */}
          {i < services.length - 1 && (
            <div key={`spacer-${i}`} className="svc-spacer" aria-hidden="true" />
          )}
        </>
      ))}
    </div>
  )
}
