'use client'

import { useEffect } from 'react'

export default function GsapAnimations() {
  useEffect(() => {
    // Dynamically import gsap to avoid SSR issues
    const init = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const q  = (s: string) => document.querySelector(s)
      const qa = (s: string) => [...document.querySelectorAll<Element>(s)]

      /* ────────────────────────────────────────────────────────────
         1 · PAGE CURTAIN TRANSITIONS
      ──────────────────────────────────────────────────────────── */
      ;(function initCurtain() {
        const curtain = q('#at-curtain') as HTMLElement | null
        if (!curtain) return

        gsap.to(curtain, { yPercent: -100, duration: 0.72, ease: 'expo.inOut', delay: 0.05 })

        qa('a[href]').forEach(link => {
          const href = link.getAttribute('href') || ''
          if (!href || href[0] === '#' || href.startsWith('mailto:') ||
              href.startsWith('tel:') || href.startsWith('http')) return

          link.addEventListener('click', (e: Event) => {
            const me = e as MouseEvent
            if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return
            e.preventDefault()
            const dest = href
            gsap.fromTo(curtain,
              { yPercent: 100 },
              { yPercent: 0, duration: 0.46, ease: 'expo.in',
                onComplete() { window.location.href = dest } }
            )
          })
        })
      }())

      /* ────────────────────────────────────────────────────────────
         3 · NAV ENTRANCE
      ──────────────────────────────────────────────────────────── */
      gsap.from('.top-nav', {
        yPercent: -110, duration: 0.9, ease: 'expo.out', delay: 0.65,
        clearProps: 'transform'
      })

      /* ────────────────────────────────────────────────────────────
         4 · HOME — HERO ENTRANCE
      ──────────────────────────────────────────────────────────── */
      ;(function initHero() {
        if (!q('.hero')) return
        gsap.set('.hero__eyebrow, .hero__title, .hero__meta', { opacity: 0 })

        gsap.timeline({ delay: 0.9 })
          .fromTo('.hero__eyebrow',
            { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.58, ease: 'power3.out' })
          .fromTo('.hero__title',
            { opacity: 0, y: 64 }, { opacity: 1, y: 0, duration: 1.10, ease: 'expo.out' }, '-=0.28')
          .fromTo('.hero__meta',
            { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.70, ease: 'power3.out' }, '-=0.55')
      }())

      /* ────────────────────────────────────────────────────────────
         5 · SUB-PAGE HEADER ENTRANCE
      ──────────────────────────────────────────────────────────── */
      ;(function initPageHeader() {
        if (!q('.page-header')) return
        const selectors = ['.page-header__eyebrow', '.page-header__title',
                           '.page-header__sub',     '.page-header__meta']
        const els = selectors.map(s => q(s)).filter(Boolean) as Element[]
        if (!els.length) return

        gsap.set(els, { opacity: 0, y: 40 })

        const tl      = gsap.timeline({ delay: 0.8 })
        const durs    = [0.52, 0.95, 0.65, 0.60]
        const eases   = ['power3.out', 'expo.out', 'power3.out', 'power3.out']
        const offsets = ['0', '-=0.28', '-=0.55', '-=0.4']

        els.forEach((el, i) => {
          tl.to(el, { opacity: 1, y: 0, duration: durs[i], ease: eases[i] }, offsets[i])
        })
      }())

      /* ────────────────────────────────────────────────────────────
         6 · MARQUEE FADE-IN
      ──────────────────────────────────────────────────────────── */
      gsap.from('.marquee', { opacity: 0, duration: 0.6, delay: 0.92 })

      /* ────────────────────────────────────────────────────────────
         7 · SCROLL REVEALS — individual large sections
      ──────────────────────────────────────────────────────────── */
      ;['.section-head', '.color-block', '.journal-feature',
       '.case-pullquote', '.case-cover', '.clients'].forEach(sel => {
        qa(sel).forEach(el => {
          gsap.fromTo(el,
            { opacity: 0, y: 48 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 87%', once: true } }
          )
        })
      })

      /* ────────────────────────────────────────────────────────────
         8 · SCROLL REVEALS — batched stagger groups
      ──────────────────────────────────────────────────────────── */
      const staggerGroups = [
        { sel: '.tile',           y: 52,  x: 0,   dur: 0.85, gap: 0.13 },
        { sel: '.principle',      y: 36,  x: 0,   dur: 0.70, gap: 0.10 },
        { sel: '.think-card',     y: 32,  x: 0,   dur: 0.70, gap: 0.10 },
        { sel: '.meta-cell',      y: 20,  x: 0,   dur: 0.55, gap: 0.07 },
        { sel: '.founder',        y: 48,  x: 0,   dur: 0.90, gap: 0.15 },
        { sel: '.cap-list__item', y: 0,   x: -24, dur: 0.55, gap: 0.06 },
        { sel: '.case-section',   y: 36,  x: 0,   dur: 0.80, gap: 0.10 },
        { sel: '.city-card',      y: 24,  x: 0,   dur: 0.60, gap: 0.10 },
        { sel: '.case-asset',     y: 32,  x: 0,   dur: 0.80, gap: 0.12 },
      ]

      staggerGroups.forEach(({ sel, y, x, dur, gap }) => {
        if (!q(sel)) return
        ScrollTrigger.batch(sel, {
          onEnter: (batch: Element[]) => gsap.fromTo(batch,
            { opacity: 0, y, x },
            { opacity: 1, y: 0, x: 0, duration: dur, stagger: gap, ease: 'power3.out', overwrite: 'auto' }
          ),
          start: 'top 88%',
          once: true
        })
      })

      /* ────────────────────────────────────────────────────────────
         9 · JOURNAL LIST — rows slide in from left
      ──────────────────────────────────────────────────────────── */
      qa('.journal-list a').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.04,
            scrollTrigger: { trigger: el, start: 'top 91%', once: true } }
        )
      })

      /* ────────────────────────────────────────────────────────────
         10 · TILE — hover parallax on inner visual
      ──────────────────────────────────────────────────────────── */
      qa('.tile').forEach(tile => {
        const visual = tile.querySelector('.tile__visual') as HTMLElement | null
        if (!visual) return

        tile.addEventListener('mousemove', (e: Event) => {
          const me = e as MouseEvent
          const r = (tile as HTMLElement).getBoundingClientRect()
          const x = ((me.clientX - r.left) / r.width  - 0.5) * 18
          const y = ((me.clientY - r.top)  / r.height - 0.5) * 12
          gsap.to(visual, { x, y, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
        })
        tile.addEventListener('mouseleave', () => {
          gsap.to(visual, { x: 0, y: 0, duration: 0.85, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
        })
      })

      /* ────────────────────────────────────────────────────────────
         11 · FOOTER LOGO — scroll parallax
      ──────────────────────────────────────────────────────────── */
      const footerLogo = q('.footer__logo')
      if (footerLogo) {
        gsap.to(footerLogo, {
          yPercent: -10, ease: 'none',
          scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom top', scrub: 2 }
        })
      }

      /* ────────────────────────────────────────────────────────────
         12 · HELIO SUN — gentle float + breathe
      ──────────────────────────────────────────────────────────── */
      qa('.vis-helio__sun').forEach(sun => {
        gsap.to(sun, { y: -8,    duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to(sun, { scale: 1.04, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 })
      })

      /* ────────────────────────────────────────────────────────────
         13 · QUERIDA NAME — gentle float
      ──────────────────────────────────────────────────────────── */
      qa('.vis-querida__name').forEach(name => {
        gsap.to(name, { y: -5, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      /* ────────────────────────────────────────────────────────────
         14 · SHOWREEL SECTION REVEAL
      ──────────────────────────────────────────────────────────── */
      ;(function () {
        const sr = q('.showreel')
        if (!sr) return

        const head  = q('.showreel__head')
        const stage = q('.showreel__stage')
        const foot  = q('.showreel__foot')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sr, start: 'top 82%', once: true }
        })

        if (head)  tl.fromTo(head,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
        if (stage) tl.fromTo(stage, { opacity: 0, scale: 0.96, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'expo.out' }, '-=0.3')
        if (foot)  tl.fromTo(foot,  { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      }())

      /* ────────────────────────────────────────────────────────────
         SHOWREEL PLAYER
      ──────────────────────────────────────────────────────────── */
      ;(function () {
        const stage   = document.getElementById('showreel-stage')
        const video   = document.getElementById('showreel-video') as HTMLVideoElement | null
        const overlay = document.getElementById('showreel-overlay')
        const muteBtn = document.getElementById('showreel-mute')
        if (!stage || !video) return

        let playing = false

        function play() {
          if (video!.src && video!.src !== window.location.href) {
            video!.play().catch(() => {})
          }
          if (overlay) overlay.classList.add('sr-hidden')
          playing = true
        }

        function pause() {
          video!.pause()
          if (overlay) overlay.classList.remove('sr-hidden')
          playing = false
        }

        stage.addEventListener('click', function (e: Event) {
          if (muteBtn && (e.target === muteBtn || muteBtn.contains(e.target as Node))) return
          playing ? pause() : play()
        })

        if (muteBtn) {
          muteBtn.addEventListener('click', function (e: Event) {
            e.stopPropagation()
            video!.muted = !video!.muted
            const label = muteBtn.querySelector('span')
            if (label) label.textContent = video!.muted ? 'Sound off' : 'Sound on'
          })
        }

        video.addEventListener('loadeddata', function () {
          video!.classList.add('is-loaded')
        })
      }())

      /* ────────────────────────────────────────────────────────────
         TEXT SCRAMBLE — hero italic 'first'
      ──────────────────────────────────────────────────────────── */
      ;(function () {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz—·'
        function scramble(el: Element, finalText: string, duration: number) {
          const start = performance.now()
          ;(function step(now: number) {
            const p = Math.min((now - start) / duration, 1)
            const resolved = Math.floor(p * finalText.length)
            el.textContent = finalText.split('').map(function(c, i) {
              return i < resolved ? c : chars[Math.floor(Math.random() * chars.length)]
            }).join('')
            if (p < 1) requestAnimationFrame(step)
            else el.textContent = finalText
          }(performance.now()))
        }
        setTimeout(function () {
          const em = document.querySelector('.hero__title em')
          if (em) scramble(em, 'first', 680)
        }, 2600)
      }())
    }

    init()
  }, [])

  return null
}
