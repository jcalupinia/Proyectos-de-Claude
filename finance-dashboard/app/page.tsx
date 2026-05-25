"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Calculator,
  LineChart,
  PieChart,
  ShieldCheck,
  Sparkles,
  FileText,
  FileImage,
  Presentation,
  FileSpreadsheet,
} from "lucide-react";
import clsx from "clsx";
import UniversalUploader, {
  ParsedSummary,
} from "./components/UniversalUploader";
import DocumentInspector from "./components/DocumentInspector";
import DataConsole from "./components/DataConsole";
import ExportBar from "./components/ExportBar";
import AIAnalysisDialog from "./components/AIAnalysisDialog";
import VarianceReport from "./components/reports/VarianceReport";
import AnalysisReport from "./components/reports/AnalysisReport";
import RatiosReport from "./components/reports/RatiosReport";
import CashFlowReport from "./components/reports/CashFlowReport";
import type {
  ColumnMapping,
  Dataset,
  RatioConfig,
  ReportTab,
} from "@/lib/types";
import type { ParsedDocument } from "@/lib/parsers";

const TABS: {
  id: ReportTab;
  label: string;
  icon: typeof BarChart3;
  domId: string;
  title: string;
}[] = [
  {
    id: "variance",
    label: "Variación",
    icon: BarChart3,
    domId: "report-variance",
    title: "Variación Presupuesto vs Real",
  },
  {
    id: "vertical-horizontal",
    label: "Vertical / Horizontal",
    icon: PieChart,
    domId: "report-analysis",
    title: "Análisis Vertical y Horizontal",
  },
  {
    id: "ratios",
    label: "Ratios",
    icon: Calculator,
    domId: "report-ratios",
    title: "Ratios Financieros",
  },
  {
    id: "cashflow",
    label: "Flujo de Caja",
    icon: LineChart,
    domId: "report-cashflow",
    title: "Flujo de Caja y Tendencias",
  },
];

export default function Page() {
  const [doc, setDoc] = useState<ParsedDocument | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [ratios, setRatios] = useState<RatioConfig>({});
  const [tab, setTab] = useState<ReportTab>("variance");
  const [showAI, setShowAI] = useState(false);

  const activeTab = useMemo(() => TABS.find((t) => t.id === tab)!, [tab]);

  function handleLoaded(d: ParsedDocument) {
    setDoc(d);
    setDataset(null);
    setMapping({});
    // Auto-select single-sheet spreadsheets
    if (d.kind === "spreadsheet" && d.datasets?.length === 1) {
      const s = d.datasets[0];
      setDataset({
        fileName: d.fileName,
        sheetName: s.sheetName,
        headers: s.headers,
        rows: s.rows,
      });
    }
  }

  function reset() {
    setDoc(null);
    setDataset(null);
    setMapping({});
  }

  return (
    <main className="max-w-7xl mx-auto p-6 lg:p-10">
      <Header />

      {!doc ? (
        <div className="mt-8 space-y-6">
          <UniversalUploader onLoaded={handleLoaded} />
          <FeatureGrid />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6 order-2 lg:order-1">
            {!dataset && (
              <DocumentInspector
                doc={doc}
                onUseDataset={setDataset}
                onAskAI={() => setShowAI(true)}
              />
            )}

            {dataset && (
              <>
                <nav className="flex flex-wrap gap-2 no-print">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const active = t.id === tab;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={clsx(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition",
                          active
                            ? "bg-brand-600 text-white shadow-pop"
                            : "bg-white text-ink-700 border border-ink-100 hover:border-brand-500 hover:text-brand-700"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </nav>

                {tab === "variance" && (
                  <VarianceReport dataset={dataset} mapping={mapping} />
                )}
                {tab === "vertical-horizontal" && (
                  <AnalysisReport dataset={dataset} mapping={mapping} />
                )}
                {tab === "ratios" && (
                  <RatiosReport
                    dataset={dataset}
                    mapping={mapping}
                    ratios={ratios}
                  />
                )}
                {tab === "cashflow" && (
                  <CashFlowReport dataset={dataset} mapping={mapping} />
                )}
              </>
            )}
          </div>

          <aside className="space-y-4 order-1 lg:order-2 no-print">
            <ParsedSummary doc={doc} onReset={reset} />

            {dataset && (
              <DataConsole
                dataset={dataset}
                mapping={mapping}
                ratios={ratios}
                onMappingChange={setMapping}
                onRatiosChange={setRatios}
              />
            )}

            {dataset && (
              <ExportBar
                dataset={dataset}
                mapping={mapping}
                ratios={ratios}
                activeReportId={activeTab.domId}
                activeReportTitle={activeTab.title}
              />
            )}

            <button
              onClick={() => setShowAI(true)}
              className="w-full btn-primary justify-center"
            >
              <Sparkles className="w-4 h-4" /> Análisis con IA
            </button>

            {dataset && (
              <button
                onClick={() => setDataset(null)}
                className="w-full btn-ghost justify-center"
              >
                Volver al contenido detectado
              </button>
            )}
          </aside>
        </div>
      )}

      {showAI && doc && (
        <AIAnalysisDialog doc={doc} onClose={() => setShowAI(false)} />
      )}

      <footer className="mt-16 pt-8 border-t border-ink-100 text-xs text-ink-500 flex flex-wrap items-center justify-between gap-2 no-print">
        <span>
          Finance Dashboard · Procesamiento 100% local · Tus datos no salen de
          tu navegador
        </span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacidad
          por diseño
        </span>
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div className="inline-flex items-center gap-2 pill bg-brand-50 text-brand-700">
          <Sparkles className="w-3.5 h-3.5" /> Consola financiera multi-formato
        </div>
        <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold text-ink-900 tracking-tight">
          Finance Dashboard
        </h1>
        <p className="mt-2 text-ink-700 max-w-2xl">
          Sube Excel, Word, PDF, PowerPoint, TXT o imágenes y obtén
          variaciones, ratios, análisis y flujo de caja — con opción de
          análisis cualitativo por IA. Procesamiento 100% local.
        </p>
      </div>
    </header>
  );
}

function FeatureGrid() {
  const formats = [
    {
      icon: FileSpreadsheet,
      title: "Excel, CSV",
      desc: "Hojas múltiples, mapeo de columnas, reportes financieros estructurados.",
    },
    {
      icon: FileText,
      title: "Word, PDF, TXT",
      desc: "Extracción de texto y detección automática de tablas embebidas.",
    },
    {
      icon: Presentation,
      title: "PowerPoint",
      desc: "Lectura de texto por diapositiva para resumen ejecutivo.",
    },
    {
      icon: FileImage,
      title: "Imágenes",
      desc: "Vista previa local + análisis multimodal con Claude (opcional).",
    },
  ];
  const reports = [
    {
      icon: BarChart3,
      title: "Variación Presupuesto vs Real",
      desc: "Detecta desviaciones materiales con gráfico ordenado y detalle por cuenta.",
    },
    {
      icon: PieChart,
      title: "Análisis Vertical y Horizontal",
      desc: "Composición porcentual y variación interanual de cada cuenta.",
    },
    {
      icon: Calculator,
      title: "Ratios Financieros",
      desc: "Liquidez, endeudamiento y rentabilidad: ROE, ROA, márgenes, prueba ácida.",
    },
    {
      icon: LineChart,
      title: "Flujo de Caja y Tendencias",
      desc: "Ingresos vs egresos por periodo con saldo acumulado y proyección.",
    },
  ];
  return (
    <>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mb-3">
          Formatos soportados
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formats.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="w-10 h-10 rounded-xl bg-violet-50 grid place-items-center mb-3">
                <Icon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-bold text-ink-900">{title}</h3>
              <p className="mt-1 text-sm text-ink-700">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mb-3">
          Reportes incluidos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="w-10 h-10 rounded-xl bg-brand-50 grid place-items-center mb-3">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-bold text-ink-900">{title}</h3>
              <p className="mt-1 text-sm text-ink-700">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
