# ROBOT AUDIT SRI — Landing (Magic UI + shadcn + UI/UX Pro Max)

Landing **moderna y animada** en React + Vite + TypeScript, construida con el combo del proyecto:

- **Magic UI** — componentes animados (traídos del mirror de GitHub): `AuroraText`,
  `AnimatedShinyText`, `ShimmerButton`, `Marquee`, `NumberTicker`, `BentoGrid`,
  `BorderBeam`, `DotPattern`, `BlurFade`.
- **shadcn/ui** — primitivas (`Button`, `Card`, `Badge`) estilo New York.
- **UI/UX Pro Max** — sistema de diseño: estilo *Dark Mode OLED*, paleta **dorado
  `#F59E0B` (confianza) + púrpura `#8B5CF6` (tech)**, tipografía **Plus Jakarta Sans**,
  patrón **Bento Grid**.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc + vite build (dist/)
npm run preview   # sirve el build
```

## Notas de entorno

- **Tipografía self-hosted** (`public/fonts/plus-jakarta.woff2`): sin depender de Google
  Fonts en runtime (el entorno remoto bloquea ese CDN).
- Componentes de Magic UI obtenidos del **mirror oficial en GitHub raw**
  (`magicuidesign/magicui`) porque `magicui.design` está fuera del allowlist de red.

## Verificado con Playwright

Render sin errores de consola, animaciones activas (aurora, shimmer, number ticker,
border beam, marquee) y responsive a 390px / 1280px.
