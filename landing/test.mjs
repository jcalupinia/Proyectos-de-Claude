// Pruebas locales de calidad para la landing. Falla con código !=0 si algo no cumple.
import { readFile, stat, readdir } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { (c ? pass++ : fail++); console.log(`${c ? '✅' : '❌'} ${m}`); };

// --- 1. Presupuesto de rendimiento: bundle total < 200KB ---
async function dirSize(dir) {
  let total = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    total += e.isDirectory() ? await dirSize(p) : (await stat(p)).size;
  }
  return total;
}
const bytes = (await stat('index.html')).size + (await stat('assets/app.js')).size
  + (await stat('assets/styles.css')).size + (await stat('assets/fonts.css')).size
  + await dirSize('assets/fonts');
const kb = (bytes / 1024).toFixed(1);
ok(bytes < 200 * 1024, `Bundle total ${kb}KB < 200KB`);

// --- 2. Exactamente un H1 ---
const h1s = (html.match(/<h1\b/gi) || []).length;
ok(h1s === 1, `Exactamente un <h1> (encontrados: ${h1s})`);

// --- 3. Jerarquía de encabezados sin saltos (h1->h2->h3) ---
const levels = [...html.matchAll(/<h([1-3])\b/gi)].map((m) => +m[1]);
let validHierarchy = levels[0] === 1;
for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) validHierarchy = false;
ok(validHierarchy, 'Jerarquía de encabezados sin saltos');

// --- 4. Toda <img> tiene alt (usamos SVG, así que normalmente 0) ---
const imgs = html.match(/<img\b[^>]*>/gi) || [];
const imgsSinAlt = imgs.filter((t) => !/\balt=/.test(t));
ok(imgsSinAlt.length === 0, `Imágenes con alt: ${imgs.length - imgsSinAlt.length}/${imgs.length}`);

// --- 5. Atributos esenciales ---
ok(/<html[^>]*\blang=/.test(html), 'Atributo lang en <html>');
ok(/<meta[^>]+name="viewport"/.test(html), 'Meta viewport');
ok(/<meta[^>]+name="description"[^>]+content="[^"]{50,}"/.test(html), 'Meta description (>50 chars)');
ok(/<title>[^<]{20,}<\/title>/.test(html), 'Título descriptivo');

// --- 6. JSON-LD válido con SoftwareApplication y FAQPage ---
const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
let types = [];
try { types = lds.map((s) => JSON.parse(s)['@type']); ok(true, `JSON-LD válido (${types.join(', ')})`); }
catch (e) { ok(false, `JSON-LD inválido: ${e.message}`); }
ok(types.includes('SoftwareApplication'), 'JSON-LD incluye SoftwareApplication');
ok(types.includes('FAQPage'), 'JSON-LD incluye FAQPage');

// --- 7. SVG decorativos marcados como aria-hidden ---
const svgs = html.match(/<svg\b[^>]*>/gi) || [];
const svgVisibles = svgs.filter((t) => !/aria-hidden|role=/.test(t));
ok(svgVisibles.length === 0, `SVG decorativos ocultos a lectores de pantalla: ${svgs.length - svgVisibles.length}/${svgs.length}`);

console.log(`\n${fail === 0 ? '🟢' : '🔴'} ${pass} OK, ${fail} fallos`);
process.exit(fail === 0 ? 0 : 1);
