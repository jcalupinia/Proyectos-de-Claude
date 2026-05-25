"use client";

import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { readExcelFile } from "@/lib/excel";
import type { Dataset } from "@/lib/types";

type Props = {
  onLoaded: (dataset: Dataset) => void;
};

export default function ExcelUploader({ onLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [reader, setReader] = useState<((sheet: string) => Dataset) | null>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setError("Formato no soportado. Sube .xlsx, .xls o .csv");
      return;
    }
    try {
      const { sheetNames, read } = await readExcelFile(file);
      setFileName(file.name);
      setSheets(sheetNames);
      setReader(() => read);
      if (sheetNames.length === 1) {
        onLoaded(read(sheetNames[0]));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function reset() {
    setFileName(null);
    setSheets([]);
    setReader(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (fileName && sheets.length > 1 && reader) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-brand-600" />
            <span className="font-semibold text-ink-900">{fileName}</span>
          </div>
          <button onClick={reset} className="btn-ghost text-sm">
            <X className="w-4 h-4" /> Cambiar
          </button>
        </div>
        <p className="text-sm text-ink-700 mb-3">
          Tu archivo tiene varias hojas. Elige una para continuar:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {sheets.map((s) => (
            <button
              key={s}
              onClick={() => onLoaded(reader(s))}
              className="text-left rounded-xl border border-ink-300 hover:border-brand-500 hover:bg-brand-50 transition px-3 py-2 text-sm font-medium text-ink-900"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
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
          Arrastra tu archivo Excel aquí
        </h3>
        <p className="text-sm text-ink-700 mt-1 max-w-md">
          .xlsx, .xls o .csv. El archivo se procesa <strong>100% en tu
          navegador</strong> — nada se sube a ningún servidor.
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          className="btn-primary mt-4"
        >
          <Upload className="w-4 h-4" /> Seleccionar archivo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {error && (
          <p className="mt-3 text-sm text-rose-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
