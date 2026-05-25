# Finance Dashboard

Consola financiera web **100% local en el navegador**. Sube cualquier documento (Excel, Word, PDF, PowerPoint, TXT, imágenes) y obtén reportes ejecutivos, análisis de variación, ratios financieros y flujo de caja — con análisis cualitativo opcional por IA (Claude).

> Tus datos nunca salen de tu computadora. Todo el procesamiento ocurre en el navegador — no hay servidor, no hay nube, no hay almacenamiento remoto. La IA es opcional y, cuando se usa, las llamadas van directo a `api.anthropic.com` con tu propia API key (guardada solo en `localStorage`).

## Formatos soportados

| Formato | Qué se extrae |
|---|---|
| `.xlsx` `.xls` `.csv` | Hojas múltiples, columnas tipadas — alimenta los 4 reportes |
| `.docx` (Word) | Texto plano + detección automática de tablas embebidas |
| `.pdf` | Texto por página + detección de tablas (separador por espacios/pipes/tabs) |
| `.pptx` (PowerPoint) | Texto por diapositiva |
| `.txt` `.md` `.json` | Contenido completo + detección de tablas |
| `.png` `.jpg` `.webp` `.gif` `.bmp` | Vista previa local + análisis multimodal con Claude (opcional) |
| `.pbix` (Power BI) | No es posible procesar archivos `.pbix` en el navegador (formato propietario cifrado). Recomendación: exportar a Excel/CSV desde Power BI. |

## Reportes incluidos

| Reporte | Qué hace |
|---|---|
| **Variación Presupuesto vs Real** | Compara cuenta por cuenta, ordena por magnitud, marca favorables/desfavorables |
| **Análisis Vertical y Horizontal** | Composición porcentual del periodo + variación interanual |
| **Ratios Financieros** | Liquidez corriente, prueba ácida, endeudamiento, apalancamiento, ROE, ROA, márgenes |
| **Flujo de Caja y Tendencias** | Ingresos vs egresos por periodo con saldo acumulado |

## Análisis con IA (opcional)

Botón **"Análisis con IA"** disponible para cualquier documento. Funciona así:

1. Configura tu API key de Anthropic (gratis crear cuenta, pay-as-you-go en uso). Se guarda solo en `localStorage`.
2. Elige modelo: Opus (más potente), Sonnet (recomendado) o Haiku (rápido y barato).
3. Selecciona una sugerencia o escribe tu pregunta.
4. La app envía el contenido extraído (texto, datos, imagen) y recibe el análisis en streaming.

Casos de uso:
- Resumen ejecutivo de un PDF de estados financieros
- Transcripción y análisis de una factura escaneada (imagen)
- Detección de anomalías en una hoja de cálculo grande
- Interpretación de gráficos en una presentación PowerPoint

## Características generales

- **Drag & drop** universal de archivos
- **Consola de mapeo** para indicar qué columna es Cuenta, Presupuesto, Real, etc.
- **Plantillas reutilizables** guardadas en `localStorage` — mapea una vez y reaplica
- **Visualizaciones tipo Canva** con paleta profesional (Recharts + Tailwind)
- **Exportación local**:
  - Excel `.xlsx` con todas las tablas formateadas
  - PDF del reporte activo con título y timestamp
  - PNG del reporte activo (alta resolución)

## Cómo correr

```bash
cd finance-dashboard
npm install
npm run dev
```

Abre `http://localhost:3000`. Para construir la versión de producción:

```bash
npm run build
npm start
```

## Estructura

```
finance-dashboard/
├── app/
│   ├── components/
│   │   ├── reports/              ← 4 reportes financieros
│   │   ├── ui/                   ← KPICard, Select
│   │   ├── UniversalUploader     ← Drag & drop multi-formato
│   │   ├── DocumentInspector     ← Vista de hojas/tablas/texto/imagen
│   │   ├── DataConsole           ← Mapeo de columnas + plantillas
│   │   ├── ExportBar             ← Descargas Excel/PDF/PNG
│   │   └── AIAnalysisDialog      ← Diálogo con Claude (opcional)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── parsers.ts                ← Word, PDF, PPT, TXT, imágenes
│   ├── excel.ts                  ← Lectura/escritura SheetJS
│   ├── kpis.ts                   ← Cálculos financieros puros
│   ├── format.ts                 ← Formatos (USD, %, etc.)
│   ├── pdf.ts                    ← Export PDF/PNG (html2canvas + jsPDF)
│   ├── ai.ts                     ← Cliente API de Anthropic
│   ├── templates.ts              ← Persistencia de mapeos
│   └── types.ts
└── package.json
```

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para diseño
- **Recharts** para gráficos
- **SheetJS** (`xlsx`) para Excel
- **mammoth** para Word
- **pdfjs-dist** para PDF
- **jszip** para PowerPoint
- **jsPDF + html2canvas** para PDF/PNG
- **lucide-react** para iconos

## Privacidad

- Los archivos se procesan exclusivamente en el navegador (Web APIs `File`, `ArrayBuffer`).
- El proyecto no incluye ningún backend.
- Las plantillas de mapeo y la API key opcional de Anthropic se guardan únicamente en `localStorage` del navegador.
- Si usas "Análisis con IA", el contenido extraído del documento se envía directamente desde tu navegador a `api.anthropic.com`. No pasa por ningún servidor intermedio.
