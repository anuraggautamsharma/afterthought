/* ============================================================
   AFTERTHOUGHT — animations.js
   GSAP 3 + ScrollTrigger
   Editorial entrance + scroll animations for a creative studio
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];

/* ────────────────────────────────────────────────────────────
   1 · CUSTOM CURSOR
   Dot (instant) + lagging ring · mix-blend-mode: exclusion
   Inverts whatever colour it sits over — works on every bg.
   ──────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = q('#at-cursor-dot');
  const ring = q('#at-cursor-ring');
  if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) return;

  document.body.classList.add('has-custom-cursor');

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  gsap.set([dot, ring], { x: mx, y: my });

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    gsap.set(dot,  { x: mx, y: my });
    gsap.set(ring, { x: rx, y: ry });
  });
  gsap.ticker.lagSmoothing(0);

  function onEnter() {
    gsap.to(ring, { scale: 2.4, opacity: 0.6, duration: 0.3,  ease: 'power3.out' });
    gsap.to(dot,  { scale: 0,               duration: 0.2,  ease: 'power2.out' });
  }
  function onLeave() {
    gsap.to(ring, { scale: 1, opacity: 1, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
    gsap.to(dot,  { scale: 1,             duration: 0.3,  ease: 'power2.out' });
  }

  qa('a, button, .tile, .think-card').forEach(el => {
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });
}());

/* ────────────────────────────────────────────────────────────
   2 · PAGE CURTAIN TRANSITIONS
   On load: full-screen black wipe sweeps upward.
   On internal link click: drops back down, then navigates.
   ──────────────────────────────────────────────────────────── */
(function initCurtain() {
  const curtain = q('#at-curtain');
  if (!curtain) return;

  gsap.to(curtain, { yPercent: -100, duration: 0.72, ease: 'expo.inOut', delay: 0.05 });

  qa('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href || href[0] === '#' || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http')) return;

    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const dest = href;
      gsap.fromTo(curtain,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.46, ease: 'expo.in',
          onComplete() { window.location.href = dest; } }
      );
    });
  });
}());

/* ────────────────────────────────────────────────────────────
   3 · NAV ENTRANCE
   Slides down from above once the curtain has cleared.
   ──────────────────────────────────────────────────────────── */
gsap.from('.top-nav', {
  yPercent: -110, duration: 0.9, ease: 'expo.out', delay: 0.65,
  clearProps: 'transform'
});

/* ────────────────────────────────────────────────────────────
   4 · HOME — HERO ENTRANCE
   Eyebrow → title → meta, sequential stagger.
   ──────────────────────────────────────────────────────────── */
(function initHero() {
  if (!q('.hero')) return;
  gsap.set('.hero__eyebrow, .hero__title, .hero__meta', { opacity: 0 });

  gsap.timeline({ delay: 0.9 })
    .fromTo('.hero__eyebrow',
      { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.58, ease: 'power3.out' })
    .fromTo('.hero__title',
      { opacity: 0, y: 64 }, { opacity: 1, y: 0, duration: 1.10, ease: 'expo.out' }, '-=0.28')
    .fromTo('.hero__meta',
      { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.70, ease: 'power3.out' }, '-=0.55');
}());

/* ────────────────────────────────────────────────────────────
   5 · SUB-PAGE HEADER ENTRANCE
   ──────────────────────────────────────────────────────────── */
(function initPageHeader() {
  if (!q('.page-header')) return;
  const selectors = ['.page-header__eyebrow', '.page-header__title',
                     '.page-header__sub',     '.page-header__meta'];
  const els = selectors.map(s => q(s)).filter(Boolean);
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 40 });

  const tl      = gsap.timeline({ delay: 0.8 });
  const durs    = [0.52, 0.95, 0.65, 0.60];
  const eases   = ['power3.out', 'expo.out', 'power3.out', 'power3.out'];
  const offsets = [0, '-=0.28', '-=0.55', '-=0.4'];

  els.forEach((el, i) => {
    tl.to(el, { opacity: 1, y: 0, duration: durs[i], ease: eases[i] }, offsets[i]);
  });
}());

/* ────────────────────────────────────────────────────────────
   6 · MARQUEE FADE-IN
   ──────────────────────────────────────────────────────────── */
gsap.from('.marquee', { opacity: 0, duration: 0.6, delay: 0.92 });

/* ────────────────────────────────────────────────────────────
   7 · SCROLL REVEALS — individual large sections
   ──────────────────────────────────────────────────────────── */
['.section-head', '.color-block', '.journal-feature',
 '.case-pullquote', '.case-cover', '.clients'].forEach(sel => {
  qa(sel).forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 48 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true } }
    );
  });
});

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
];

staggerGroups.forEach(({ sel, y, x, dur, gap }) => {
  if (!q(sel)) return;
  ScrollTrigger.batch(sel, {
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y, x },
      { opacity: 1, y: 0, x: 0, duration: dur, stagger: gap, ease: 'power3.out', overwrite: 'auto' }
    ),
    start: 'top 88%',
    once: true
  });
});

/* ────────────────────────────────────────────────────────────
   9 · JOURNAL LIST — rows slide in from left
   ──────────────────────────────────────────────────────────── */
qa('.journal-list a').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.04,
      scrollTrigger: { trigger: el, start: 'top 91%', once: true } }
  );
});

/* ────────────────────────────────────────────────────────────
   10 · TILE — hover parallax on inner visual
   ──────────────────────────────────────────────────────────── */
qa('.tile').forEach(tile => {
  const visual = tile.querySelector('.tile__visual');
  if (!visual) return;

  tile.addEventListener('mousemove', e => {
    const r = tile.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
    gsap.to(visual, { x, y, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
  });
  tile.addEventListener('mouseleave', () => {
    gsap.to(visual, { x: 0, y: 0, duration: 0.85, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
  });
});

/* ────────────────────────────────────────────────────────────
   11 · FOOTER LOGO — scroll parallax
   ──────────────────────────────────────────────────────────── */
const footerLogo = q('.footer__logo');
if (footerLogo) {
  gsap.to(footerLogo, {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom top', scrub: 2 }
  });
}

/* ────────────────────────────────────────────────────────────
   12 · HELIO SUN — gentle float + breathe
   ──────────────────────────────────────────────────────────── */
qa('.vis-helio__sun').forEach(sun => {
  gsap.to(sun, { y: -8,    duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(sun, { scale: 1.04, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
});

/* ────────────────────────────────────────────────────────────
   13 · QUERIDA NAME — gentle float
   ──────────────────────────────────────────────────────────── */
qa('.vis-querida__name').forEach(name => {
  gsap.to(name, { y: -5, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
});

/* ────────────────────────────────────────────────────────────
   14 · SHOWREEL SECTION REVEAL
   ──────────────────────────────────────────────────────────── */
(function () {
  const sr = q('.showreel');
  if (!sr) return;

  const head  = q('.showreel__head');
  const stage = q('.showreel__stage');
  const foot  = q('.showreel__foot');

  const tl = gsap.timeline({
    scrollTrigger: { trigger: sr, start: 'top 82%', once: true }
  });

  if (head)  tl.fromTo(head,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' });
  if (stage) tl.fromTo(stage, { opacity: 0, scale: 0.96, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'expo.out' }, '-=0.3');
  if (foot)  tl.fromTo(foot,  { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');
}());
