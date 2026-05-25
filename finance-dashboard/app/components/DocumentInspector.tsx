"use client";

import { useState } from "react";
import {
  ScanText,
  TableProperties,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { ParsedDocument } from "@/lib/parsers";
import { toDataset } from "@/lib/parsers";
import type { Dataset } from "@/lib/types";

type Props = {
  doc: ParsedDocument;
  onUseDataset: (ds: Dataset) => void;
  onAskAI: () => void;
};

export default function DocumentInspector({
  doc,
  onUseDataset,
  onAskAI,
}: Props) {
  const [tab, setTab] = useState<"sheets" | "tables" | "text" | "image">(
    doc.kind === "spreadsheet"
      ? "sheets"
      : doc.kind === "image"
      ? "image"
      : doc.detectedTables && doc.detectedTables.length > 0
      ? "tables"
      : "text"
  );

  const hasSheets = doc.datasets && doc.datasets.length > 0;
  const hasTables = doc.detectedTables && doc.detectedTables.length > 0;
  const hasText = !!doc.text;
  const hasImage = !!doc.image;

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-bold text-ink-900">Contenido detectado</h2>
        <button onClick={onAskAI} className="btn-primary text-sm">
          <Sparkles className="w-4 h-4" /> Análisis con IA
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-4 border-b border-ink-100">
        {hasSheets && (
          <TabBtn
            active={tab === "sheets"}
            onClick={() => setTab("sheets")}
            icon={<TableProperties className="w-4 h-4" />}
            label={`Hojas (${doc.datasets!.length})`}
          />
        )}
        {hasTables && (
          <TabBtn
            active={tab === "tables"}
            onClick={() => setTab("tables")}
            icon={<TableProperties className="w-4 h-4" />}
            label={`Tablas detectadas (${doc.detectedTables!.length})`}
          />
        )}
        {hasText && (
          <TabBtn
            active={tab === "text"}
            onClick={() => setTab("text")}
            icon={<ScanText className="w-4 h-4" />}
            label="Texto extraído"
          />
        )}
        {hasImage && (
          <TabBtn
            active={tab === "image"}
            onClick={() => setTab("image")}
            icon={<ImageIcon className="w-4 h-4" />}
            label="Imagen"
          />
        )}
      </div>

      {tab === "sheets" && hasSheets && (
        <div className="space-y-2">
          {doc.datasets!.map((s, i) => (
            <button
              key={i}
              onClick={() =>
                onUseDataset({
                  fileName: doc.fileName,
                  sheetName: s.sheetName,
                  headers: s.headers,
                  rows: s.rows,
                })
              }
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-ink-300 hover:border-brand-500 hover:bg-brand-50 transition text-left"
            >
              <div className="min-w-0">
                <div className="font-semibold text-ink-900 truncate">
                  {s.sheetName}
                </div>
                <div className="text-xs text-ink-500">
                  {s.rows.length} filas · {s.headers.length} columnas
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-500 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {tab === "tables" && hasTables && (
        <div className="space-y-2">
          <p className="text-xs text-ink-500 mb-1">
            Detectadas heurísticamente del texto. Revisa antes de usar — los
            separadores pueden no ser perfectos.
          </p>
          {doc.detectedTables!.map((t, i) => {
            const ds = toDataset(doc, 0, i);
            return (
              <button
                key={i}
                onClick={() => ds && onUseDataset(ds)}
                className="w-full text-left rounded-xl border border-ink-300 hover:border-brand-500 hover:bg-brand-50 transition p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-ink-900">
                    Tabla {i + 1}
                  </div>
                  <span className="text-xs text-ink-500">
                    {t.rows.length} filas · {t.headers.length} columnas
                  </span>
                </div>
                <div className="mt-2 text-xs text-ink-700 truncate">
                  Columnas: {t.headers.slice(0, 5).join(" · ")}
                  {t.headers.length > 5 ? " · …" : ""}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === "text" && hasText && (
        <div className="rounded-xl bg-ink-100/60 border border-ink-100 p-3">
          <pre className="text-xs text-ink-900 whitespace-pre-wrap font-mono max-h-96 overflow-auto leading-relaxed">
            {doc.text!.slice(0, 8000)}
            {doc.text!.length > 8000 && (
              <span className="text-ink-500">
                {"\n\n… ("}
                {(doc.text!.length - 8000).toLocaleString()}
                {" caracteres más — usa Análisis con IA para procesar todo)"}
              </span>
            )}
          </pre>
        </div>
      )}

      {tab === "image" && hasImage && (
        <div className="text-center">
          <img
            src={doc.image!.dataUrl}
            alt={doc.fileName}
            className="max-w-full max-h-96 mx-auto rounded-xl border border-ink-100"
          />
          <div className="mt-2 text-xs text-ink-500">
            {doc.image!.width} × {doc.image!.height} px
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition ${
        active
          ? "border-brand-600 text-brand-700"
          : "border-transparent text-ink-500 hover:text-ink-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
