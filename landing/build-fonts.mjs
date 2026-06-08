// Descarga las fuentes (subset latino) y las auto-hospeda en assets/fonts.
// Genera assets/fonts.css apuntando a rutas locales. Evita depender de un CDN en runtime.
import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Public+Sans:wght@400..700&display=swap';

const css = await fetch(URL, { headers: { 'User-Agent': UA } }).then((r) => r.text());

await mkdir('assets/fonts', { recursive: true });

// Cada @font-face viene precedido de un comentario con el nombre del subset (/* latin */).
const blocks = css.split('/*').slice(1);
let out = '';
const seen = new Set();

for (const b of blocks) {
  const subset = b.split('*/')[0].trim();
  if (subset !== 'latin') continue; // solo el bloque latino básico
  const face = '@font-face' + b.split('@font-face')[1];
  const url = face.match(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/)?.[0];
  if (!url || seen.has(url)) continue;
  seen.add(url);

  const buf = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
  const name = createHash('md5').update(url).digest('hex').slice(0, 8) + '.woff2';
  await writeFile(`assets/fonts/${name}`, buf);

  out += face.replace(/url\([^)]+\)/, `url("./fonts/${name}")`).trim() + '\n';
  console.log(`✓ ${name}  ${(buf.length / 1024).toFixed(1)}KB`);
}

await writeFile('assets/fonts.css', out);
console.log(`\nassets/fonts.css generado (${seen.size} fuentes).`);
