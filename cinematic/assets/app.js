/* AURA — scroll cinemático. GSAP + ScrollTrigger + Lenis, todo self-hosted. */
(() => {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Lenis smooth scroll, sincronizado con GSAP ---- */
  if (!reduce) {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- Barra de progreso ---- */
  gsap.to('.progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
  });

  /* ---- Hero: parallax del fondo + fade/scale del título ---- */
  gsap.to('.hero__bg', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__content', {
    yPercent: -18, scale: 0.92, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  /* ---- EL EFECTO: cada imagen se expande de pequeña a pantalla completa, con pin ---- */
  gsap.utils.toArray('.expand').forEach((sec) => {
    const media = sec.querySelector('.expand__media');
    const cap = sec.querySelector('.expand__caption');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: '+=130%',
        scrub: 1, pin: true, anticipatePin: 1,
      },
    });
    tl.fromTo(media,
      { scale: 0.5, borderRadius: '40px' },
      { scale: 1, borderRadius: '0px', ease: 'none' }, 0)
      .fromTo(cap,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, ease: 'none' }, 0.15);
  });

  /* ---- Interludio: líneas de texto que suben (reveal) ---- */
  gsap.utils.toArray('.statement').forEach((st) => {
    gsap.from(st.querySelectorAll('.reveal-line > *, .reveal-line'), {
      yPercent: 110, ease: 'power3.out', duration: 1, stagger: 0.12,
      scrollTrigger: { trigger: st, start: 'top 70%' },
    });
  });

  /* ---- Galería horizontal con pin ---- */
  const track = document.querySelector('.gallery__track');
  if (track) {
    const amount = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -amount(), ease: 'none',
      scrollTrigger: {
        trigger: '.gallery', start: 'top top', end: () => '+=' + amount(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
      },
    });
  }

  /* ---- Refrescar tras cargar fuentes (evita medidas erróneas) ---- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
