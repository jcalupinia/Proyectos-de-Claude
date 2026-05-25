# Finance Dashboard

Aplicación web **100% local en el navegador** para automatizar los reportes que genera un gerente financiero a partir de archivos Excel.

> Tus datos nunca salen de tu computadora. Todo el procesamiento ocurre en el navegador — no hay servidor, no hay nube, no hay almacenamiento remoto.

## Reportes incluidos

| Reporte | Qué hace |
|---|---|
| **Variación Presupuesto vs Real** | Compara cuenta por cuenta, ordena por magnitud, marca favorables/desfavorables |
| **Análisis Vertical y Horizontal** | Composición porcentual del periodo + variación interanual |
| **Ratios Financieros** | Liquidez corriente, prueba ácida, endeudamiento, apalancamiento, ROE, ROA, márgenes |
| **Flujo de Caja y Tendencias** | Ingresos vs egresos por periodo con saldo acumulado |

## Características

- **Subida drag & drop** de archivos `.xlsx`, `.xls`, `.csv`
- **Consola de mapeo** para indicar qué columna es Cuenta, Presupuesto, Real, etc.
- **Plantillas reutilizables** guardadas en `localStorage` — mapea una vez y reaplica a archivos del mismo formato
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
│   │   ├── reports/        ← 4 reportes (Variance, Analysis, Ratios, CashFlow)
│   │   ├── ui/             ← KPICard, Select
│   │   ├── ExcelUploader   ← Drag & drop con SheetJS
│   │   ├── DataConsole     ← Mapeo de columnas + plantillas
│   │   └── ExportBar       ← Descargas Excel/PDF/PNG
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── excel.ts            ← Lectura/escritura SheetJS
│   ├── kpis.ts             ← Cálculos financieros puros
│   ├── format.ts           ← Formatos (USD, %, etc.)
│   ├── pdf.ts              ← Export PDF/PNG con html2canvas + jsPDF
│   ├── templates.ts        ← Persistencia de mapeos
│   └── types.ts
└── package.json
```

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para diseño
- **Recharts** para gráficos
- **SheetJS** para Excel
- **jsPDF + html2canvas** para PDF/PNG
- **lucide-react** para iconos

## Privacidad

Los archivos se procesan exclusivamente en el navegador (Web APIs `File`, `ArrayBuffer`). El proyecto no incluye ningún backend ni envía datos a ningún servidor externo. Las plantillas de mapeo se guardan en `localStorage` del navegador.

## Próximas iteraciones

- Soporte para PDF, Word, PowerPoint, TXT e imágenes (extracción de texto y datos)
- Integración opcional con Claude API para análisis cualitativo de cualquier documento
- Exportación a PowerPoint (.pptx)
- Comparación multi-archivo (P&L mensual consolidado)
