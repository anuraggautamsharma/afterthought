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

        const clips   = qa('.hero__clip > span')
        const bgWord  = q('.hero__bg-word') as HTMLElement | null
        const eyebrow = q('.hero__eyebrow') as HTMLElement | null
        const meta    = q('.hero__meta')    as HTMLElement | null
        const em      = q('.hero__title em') as HTMLElement | null

        gsap.set(clips, { yPercent: 112 })
        gsap.set(eyebrow, { opacity: 0, y: 10 })
        gsap.set(meta, { opacity: 0, y: 20 })

        const tl = gsap.timeline({ delay: 0.82 })

        tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
          .to(clips,   { yPercent: 0, duration: 1.05, stagger: 0.10, ease: 'expo.out' }, '-=0.12')
          .to(meta,    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.50')
          .call(() => { if (em) em.classList.add('underlined') }, [], '+=0.05')

        if (bgWord) {
          tl.to(bgWord, { opacity: 0.028, duration: 1.6, ease: 'power2.out' }, '-=1.0')
        }

        // Mouse parallax + magnetic CTAs (desktop pointer only)
        if (!window.matchMedia('(pointer: fine)').matches) return

        const hero  = q('.hero') as HTMLElement | null
        const title = q('.hero__title') as HTMLElement | null

        if (hero && title) {
          hero.addEventListener('mousemove', (e: Event) => {
            const me = e as MouseEvent
            const r  = hero.getBoundingClientRect()
            const nx = (me.clientX - r.left) / r.width  - 0.5
            const ny = (me.clientY - r.top)  / r.height - 0.5

            gsap.to(title,   { x: nx * 10, y: ny *  6, duration: 0.9, ease: 'power2.out', overwrite: 'auto' })
            gsap.to(eyebrow, { x: nx *  5, y: ny *  3, duration: 0.9, ease: 'power2.out', overwrite: 'auto' })
            if (bgWord) gsap.to(bgWord, { x: nx * -22, y: ny * -14, duration: 1.1, ease: 'power2.out', overwrite: 'auto' })
          })

          hero.addEventListener('mouseleave', () => {
            const targets = [title, eyebrow, bgWord].filter(Boolean)
            gsap.to(targets, { x: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' })
          })
        }

        // Magnetic CTA buttons
        qa('.hero__cta-row .btn').forEach(btn => {
          btn.addEventListener('mousemove', (e: Event) => {
            const me = e as MouseEvent
            const r  = (btn as HTMLElement).getBoundingClientRect()
            const x  = me.clientX - (r.left + r.width  / 2)
            const y  = me.clientY - (r.top  + r.height / 2)
            gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.3, ease: 'power2.out' })
          })
          btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
          })
        })
      }())

      /* ────────────────────────────────────────────────────────────
         5 · POST TITLE ENTRANCE (below full-bleed hero)
      ──────────────────────────────────────────────────────────── */
      ;(function initPostTitle() {
        if (!q('.post-title')) return
        const eyebrow = q('.post-title__eyebrow')
        const title   = q('.post-title__h1')
        const byline  = q('.post-title__byline')

        gsap.set([eyebrow, title, byline].filter(Boolean), { opacity: 0, y: 28 })

        const tl = gsap.timeline({ delay: 0.35 })
        if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.50, ease: 'power3.out' })
        if (title)   tl.to(title,   { opacity: 1, y: 0, duration: 0.90, ease: 'expo.out' }, '-=0.20')
        if (byline)  tl.to(byline,  { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.40')
      }())

      ;(function initCsHero() {
        if (!q('.cs-hero')) return
        const eyebrow = q('.cs-hero__eyebrow')
        const title   = q('.cs-hero__title')

        gsap.set([eyebrow, title].filter(Boolean), { opacity: 0, y: 36 })

        const tl = gsap.timeline({ delay: 0.78 })
        if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.52, ease: 'power3.out' })
        if (title)   tl.to(title,   { opacity: 1, y: 0, duration: 0.92, ease: 'expo.out' }, '-=0.22')
      }())

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
      ;['.section-head', '.color-block', '.j-feat',
       '.case-pullquote', '.case-cover', '.clients', '.cs-image', '.cs-intro',
       '.post-hero-image', '.post-pullquote', '.post-image', '.post-video'].forEach(sel => {
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
        { sel: '.cs-meta__item',       y: 16, x: 0, dur: 0.55, gap: 0.07 },
        { sel: '.post-related__item',  y: 20, x: 0, dur: 0.60, gap: 0.08 },
        { sel: '.j-list__item',        y: 16, x: 0, dur: 0.50, gap: 0.06 },
        { sel: '.j-card',              y: 32, x: 0, dur: 0.72, gap: 0.09 },
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
         10 · TILE — hover parallax + zoom on inner visual
      ──────────────────────────────────────────────────────────── */
      qa('.tile').forEach(tile => {
        const visual = tile.querySelector('.tile__visual') as HTMLElement | null
        if (!visual) return

        tile.addEventListener('mouseenter', () => {
          gsap.to(visual, { scale: 1.04, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
        })
        tile.addEventListener('mousemove', (e: Event) => {
          const me = e as MouseEvent
          const r  = (tile as HTMLElement).getBoundingClientRect()
          const x  = ((me.clientX - r.left) / r.width  - 0.5) * 22
          const y  = ((me.clientY - r.top)  / r.height - 0.5) * 14
          gsap.to(visual, { x, y, scale: 1.05, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
        })
        tile.addEventListener('mouseleave', () => {
          gsap.to(visual, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
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
         14 · SHOWREEL — scroll-driven expansion
      ──────────────────────────────────────────────────────────── */
      ;(function () {
        const section = q('#showreel-section') as HTMLElement | null
        const stage   = q('.showreel__stage')  as HTMLElement | null
        if (!section || !stage) return

        // Stage expands from inset+rounded to full-width as section scrolls in
        gsap.fromTo(stage,
          { scale: 0.84, borderRadius: '3vw' },
          { scale: 1,    borderRadius: '0px', ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end:   'top 10%',
              scrub: 1.5,
            }
          }
        )

        // Inner poster zooms out as stage expands — parallax depth
        const poster = stage.querySelector('.showreel__poster') as HTMLElement | null
        if (poster) {
          gsap.fromTo(poster,
            { scale: 1.10 },
            { scale: 1, ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end:   'top 10%',
                scrub: 1.5,
              }
            }
          )
        }
      }())

      /* ────────────────────────────────────────────────────────────
         SHOWREEL PLAYER
      ──────────────────────────────────────────────────────────── */
      ;(function () {
        const stage    = document.getElementById('showreel-stage')
        const video    = document.getElementById('showreel-video') as HTMLVideoElement | null
        const overlay  = document.getElementById('showreel-overlay')
        const muteBtn  = document.getElementById('showreel-mute')
        const progress = document.getElementById('showreel-progress')
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

        stage.addEventListener('click', (e: Event) => {
          if (muteBtn && (e.target === muteBtn || muteBtn.contains(e.target as Node))) return
          playing ? pause() : play()
        })

        if (muteBtn) {
          muteBtn.addEventListener('click', (e: Event) => {
            e.stopPropagation()
            video!.muted = !video!.muted
            muteBtn.classList.toggle('is-on', !video!.muted)
          })
        }

        video.addEventListener('loadeddata', () => video!.classList.add('is-loaded'))

        video.addEventListener('timeupdate', () => {
          if (!progress || !video!.duration) return
          const pct = (video!.currentTime / video!.duration) * 100
          ;(progress as HTMLElement).style.width = pct + '%'
        })
      }())

    }

    init()
  }, [])

  return null
}
