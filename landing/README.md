# Landing ROBOT AUDIT SRI

Landing optimizada (velocidad + conversión) para la app de descarga y auditoría de
comprobantes del SRI. Construida con HTML5 semántico + **Tailwind CSS purgado** y
fuentes self-hosted. Bundle total **< 200KB**.

## Comandos

```bash
npm install        # Tailwind v3 (devDependency)
npm run build      # descarga fuentes (woff2) + genera assets/styles.css purgado y minificado
npm test           # pruebas locales de calidad (tamaño, a11y, SEO, JSON-LD)
```

Para verla:

```bash
npx serve .        # o: python3 -m http.server
```

## Qué incluye

- **Semántica + accesibilidad:** `header/main/section/article/footer`, un solo `<h1>`,
  jerarquía H1→H3 sin saltos, skip-link, `focus-visible`, `prefers-reduced-motion`,
  SVG decorativos con `aria-hidden`.
- **Rendimiento:** Tailwind purgado (~14KB CSS), fuentes woff2 self-hosted con `preload`
  y `font-display:swap`, SVG inline (cero imágenes de red), JS vanilla (~1KB).
- **SEO:** `meta description`, Open Graph, canonical y **JSON-LD** (`SoftwareApplication`
  + `FAQPage`).
- **Tipografía:** Fraunces (display) + Public Sans (texto) — no genéricas.

## Pruebas (`npm test`)

Valida automáticamente: bundle < 200KB · un único H1 · jerarquía de encabezados ·
`alt` en imágenes · `lang`/viewport/description/title · JSON-LD válido con los tipos
esperados · SVG decorativos ocultos a lectores de pantalla.
