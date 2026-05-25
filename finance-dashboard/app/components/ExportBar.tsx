"use client";

import { Download, FileText, Image as ImgIcon, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import type { ColumnMapping, Dataset, RatioConfig } from "@/lib/types";
import {
  aggregateByPeriod,
  computeRatios,
  computeVariance,
  horizontalAnalysis,
  verticalAnalysis,
} from "@/lib/kpis";
import { exportToExcel } from "@/lib/excel";
import { exportElementToPDF, exportElementToPNG } from "@/lib/pdf";

type Props = {
  dataset: Dataset;
  mapping: ColumnMapping;
  ratios: RatioConfig;
  activeReportId: string;
  activeReportTitle: string;
};

export default function ExportBar({
  dataset,
  mapping,
  ratios,
  activeReportId,
  activeReportTitle,
}: Props) {
  const [busy, setBusy] = useState<string | null>(null);

  function downloadExcel() {
    setBusy("xlsx");
    const sheets: { name: string; rows: Record<string, unknown>[] }[] = [];

    const variance = computeVariance(dataset, mapping);
    if (variance.length > 0) sheets.push({ name: "Variacion", rows: variance });

    const vertical = verticalAnalysis(dataset, mapping);
    if (vertical.length > 0) sheets.push({ name: "Vertical", rows: vertical });

    const horizontal = horizontalAnalysis(dataset, mapping);
    if (horizontal.length > 0) sheets.push({ name: "Horizontal", rows: horizontal });

    const cashflow = aggregateByPeriod(dataset, mapping);
    if (cashflow.length > 0) sheets.push({ name: "Flujo de Caja", rows: cashflow });

    const hasRatios = Object.values(ratios).some(Boolean);
    if (hasRatios) {
      sheets.push({ name: "Ratios", rows: computeRatios(dataset, mapping, ratios) });
    }

    if (sheets.length === 0) {
      sheets.push({ name: "Datos", rows: dataset.rows });
    }

    const filename = `reportes-financieros-${ts()}.xlsx`;
    exportToExcel(filename, sheets);
    setBusy(null);
  }

  async function downloadPDF() {
    setBusy("pdf");
    try {
      await exportElementToPDF(
        activeReportId,
        `${slug(activeReportTitle)}-${ts()}.pdf`,
        activeReportTitle
      );
    } finally {
      setBusy(null);
    }
  }

  async function downloadPNG() {
    setBusy("png");
    try {
      await exportElementToPNG(
        activeReportId,
        `${slug(activeReportTitle)}-${ts()}.png`
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card no-print">
      <div className="flex items-center gap-2 mb-2">
        <Download className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-bold text-ink-900">Descarga local</h2>
        <span className="ml-auto text-xs text-ink-500">
          Todo se guarda en tu computadora
        </span>
      </div>
      <p className="text-sm text-ink-700 mb-4">
        Exporta el reporte activo en distintos formatos. Los archivos se
        descargan directamente sin pasar por la nube.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="btn-primary"
          onClick={downloadExcel}
          disabled={busy !== null}
        >
          <FileSpreadsheet className="w-4 h-4" />
          {busy === "xlsx" ? "Generando…" : "Excel (.xlsx)"}
        </button>
        <button
          className="btn-ghost"
          onClick={downloadPDF}
          disabled={busy !== null}
        >
          <FileText className="w-4 h-4" />
          {busy === "pdf" ? "Generando…" : "PDF del reporte"}
        </button>
        <button
          className="btn-ghost"
          onClick={downloadPNG}
          disabled={busy !== null}
        >
          <ImgIcon className="w-4 h-4" />
          {busy === "png" ? "Generando…" : "PNG del reporte"}
        </button>
      </div>
    </div>
  );
}

function ts() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
