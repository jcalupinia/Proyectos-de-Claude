"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  FileText,
  FileImage,
  Presentation,
  AlertTriangle,
  File as FileIcon,
} from "lucide-react";
import { parseAny, type ParsedDocument } from "@/lib/parsers";

type Props = {
  onLoaded: (doc: ParsedDocument) => void;
};

const ACCEPT =
  ".xlsx,.xls,.csv,.docx,.pdf,.pptx,.txt,.md,.json,.png,.jpg,.jpeg,.webp,.gif,.bmp,.pbix";

const KIND_ICON = {
  spreadsheet: FileSpreadsheet,
  word: FileText,
  pdf: FileText,
  powerpoint: Presentation,
  text: FileText,
  image: FileImage,
  powerbi: FileIcon,
  unknown: FileIcon,
};

export default function UniversalUploader({ onLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const file = files[0];
      const parsed = await parseAny(file);
      onLoaded(parsed);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`card border-2 border-dashed transition ${
        drag ? "border-brand-500 bg-brand-50/40" : "border-ink-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 grid place-items-center mb-4">
          <Upload className="w-6 h-6 text-brand-600" />
        </div>
        <h3 className="text-lg font-bold text-ink-900">
          Sube cualquier documento
        </h3>
        <p className="text-sm text-ink-700 mt-1 max-w-xl">
          Excel, Word, PDF, PowerPoint, TXT, imágenes o Power BI. Se procesa{" "}
          <strong>100% en tu navegador</strong> — nada se sube a ningún
          servidor.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-ink-500">
          {[
            ["xlsx / csv", FileSpreadsheet],
            ["docx", FileText],
            ["pdf", FileText],
            ["pptx", Presentation],
            ["txt / md", FileText],
            ["png / jpg", FileImage],
            ["pbix", FileIcon],
          ].map(([label, Icon]) => {
            const I = Icon as typeof FileText;
            return (
              <span
                key={label as string}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-100"
              >
                <I className="w-3 h-3" />
                {label as string}
              </span>
            );
          })}
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="btn-primary mt-5"
          disabled={busy}
        >
          <Upload className="w-4 h-4" />
          {busy ? "Procesando…" : "Seleccionar archivo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {error && (
          <p className="mt-3 text-sm text-rose-600 font-medium inline-flex items-center gap-1">
            <X className="w-4 h-4" /> {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function ParsedSummary({
  doc,
  onReset,
}: {
  doc: ParsedDocument;
  onReset: () => void;
}) {
  const Icon = KIND_ICON[doc.kind] ?? FileIcon;
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-brand-600" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-ink-900 truncate">
            {doc.fileName}
          </div>
          <div className="text-xs text-ink-500">
            {labelForKind(doc.kind)}
            {doc.pages ? ` · ${doc.pages} páginas` : ""}
            {doc.text ? ` · ${doc.text.length.toLocaleString()} caracteres` : ""}
            {doc.datasets
              ? ` · ${doc.datasets.length} hoja${doc.datasets.length === 1 ? "" : "s"}`
              : ""}
          </div>
        </div>
        <button onClick={onReset} className="btn-ghost text-sm">
          <X className="w-4 h-4" /> Cambiar
        </button>
      </div>
      {doc.warnings && doc.warnings.length > 0 && (
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <ul className="text-xs text-amber-900 space-y-0.5">
            {doc.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function labelForKind(k: ParsedDocument["kind"]): string {
  return (
    {
      spreadsheet: "Hoja de cálculo",
      word: "Documento Word",
      pdf: "PDF",
      powerpoint: "Presentación PowerPoint",
      text: "Texto plano",
      image: "Imagen",
      powerbi: "Power BI",
      unknown: "Desconocido",
    } as const
  )[k];
}
