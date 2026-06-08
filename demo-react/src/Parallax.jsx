import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const panels = [
  { title: 'Scroll', sub: 'Las capas se mueven a distinta velocidad', from: '#0f172a', to: '#1e3a8a' },
  { title: 'Parallax', sub: 'Profundidad real al desplazarte', from: '#1e1b4b', to: '#7c3aed' },
  { title: 'Reveal', sub: 'Los bloques se expanden suavemente', from: '#3b0764', to: '#db2777' },
  { title: 'Cinematic', sub: 'Hecho con GSAP + ScrollTrigger', from: '#7f1d1d', to: '#f59e0b' },
];

export default function Parallax() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero: el título se aleja y se desvanece al hacer scroll (parallax).
      gsap.to('.hero-title', {
        yPercent: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      // 2. Cada panel: la "imagen" se expande de pequeña a pantalla completa al entrar.
      gsap.utils.toArray('.panel').forEach((panel) => {
        const media = panel.querySelector('.panel-media');
        gsap.fromTo(
          media,
          { scale: 0.6, borderRadius: '48px', opacity: 0.5 },
          {
            scale: 1, borderRadius: '0px', opacity: 1, ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top 85%', end: 'top 25%', scrub: true },
          },
        );
        // El texto sube en parallax sobre la imagen.
        gsap.fromTo(
          panel.querySelector('.panel-text'),
          { yPercent: 40, opacity: 0 },
          {
            yPercent: -10, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top 80%', end: 'top 30%', scrub: true },
          },
        );
      });

      // 3. Barra de progreso de scroll arriba.
      gsap.to('.progress', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="parallax">
      <div className="progress" />

      <section className="hero">
        <div className="hero-bg" />
        <h1 className="hero-title">
          Haz scroll<span>↓</span>
        </h1>
      </section>

      {panels.map((p) => (
        <section className="panel" key={p.title}>
          <div
            className="panel-media"
            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
          />
          <div className="panel-text">
            <h2>{p.title}</h2>
            <p>{p.sub}</p>
          </div>
        </section>
      ))}

      <footer className="parallax-footer">
        <p>GSAP {gsap.version} · ScrollTrigger</p>
      </footer>
    </div>
  );
}
