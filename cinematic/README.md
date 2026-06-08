# AURA — Scroll cinemático (GSAP + ScrollTrigger + Lenis)

Web de estética "premium / 10k" con el efecto pedido: **las imágenes se expanden
suavemente al hacer scroll**, más parallax, reveal de texto y galería horizontal.
Todo **self-hosted**, sin CDNs ni build.

## Cómo verla

```bash
cd cinematic
npx serve .        # o: python3 -m http.server
```
Abre la URL y haz scroll.

## Qué incluye

- **Imágenes que se expanden** — cada sección hace *pin* y escala su media de pequeña
  (rounded) a pantalla completa con viñeta cinematográfica (`ScrollTrigger` + `pin` + `scrub`).
- **Smooth scroll** con **Lenis**, sincronizado con el ticker de GSAP.
- **Parallax** en el hero (fondo y título a distinta velocidad).
- **Reveal** de texto por líneas en el interludio.
- **Galería horizontal** con pin (scroll vertical → desplazamiento lateral).
- **Barra de progreso**, grano global y `prefers-reduced-motion`.

## Stack (todo local en `assets/vendor/`)

- `gsap.min.js` + `ScrollTrigger.min.js`
- `lenis.min.js`
- Fuente **Bricolage Grotesque** self-hosted (woff2)
- Imágenes generadas con gradientes/mesh en CSS → cero peticiones de red

> Sin dependencia de internet en runtime: ideal para entornos con red restringida.
