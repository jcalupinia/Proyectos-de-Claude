"use client";

import { useEffect, useRef, useState } from "react";
import { X, Sparkles, Settings, Eye, EyeOff, Send } from "lucide-react";
import type { ParsedDocument } from "@/lib/parsers";
import {
  analyzeDocument,
  DEFAULT_MODEL,
  getApiKey,
  getModel,
  setApiKey,
  setModel,
} from "@/lib/ai";

type Props = {
  doc: ParsedDocument;
  onClose: () => void;
};

const SUGGESTIONS = [
  "Identifica las variaciones más relevantes y posibles causas.",
  "Resume los hallazgos financieros clave en bullets ejecutivos.",
  "Extrae todos los importes monetarios con su concepto y fecha.",
  "Detecta inconsistencias, outliers o errores aritméticos.",
  "Proyecta las tendencias para los próximos 3 periodos.",
];

export default function AIAnalysisDialog({ doc, onClose }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyLocal] = useState("");
  const [model, setModelLocal] = useState(DEFAULT_MODEL);
  const [reveal, setReveal] = useState(false);
  const [question, setQuestion] = useState(SUGGESTIONS[0]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKeyLocal(getApiKey());
    setModelLocal(getModel());
    setShowSettings(!getApiKey());
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  function saveSettings() {
    setApiKey(apiKey.trim());
    setModel(model.trim() || DEFAULT_MODEL);
    setShowSettings(false);
  }

  async function run() {
    setError(null);
    setOutput("");
    setRunning(true);
    try {
      await analyzeDocument({ doc, question }, (chunk) => {
        setOutput((prev) => prev + chunk);
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm grid place-items-center p-4 no-print"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-pop max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-ink-900">Análisis con IA</h2>
            <span className="text-xs text-ink-500 ml-2 truncate max-w-[200px]">
              {doc.fileName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="btn-ghost text-sm"
              aria-label="Configurar"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="btn-ghost text-sm">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {showSettings && (
          <div className="p-5 border-b border-ink-100 bg-ink-100/40 space-y-3">
            <p className="text-sm text-ink-700">
              Tu API key se guarda <strong>solo en tu navegador</strong>{" "}
              (localStorage). Las llamadas se hacen directamente desde aquí a{" "}
              <code className="text-xs bg-white px-1 py-0.5 rounded">
                api.anthropic.com
              </code>{" "}
              sin pasar por ningún servidor intermedio.
            </p>
            <label className="block">
              <span className="label">API Key de Anthropic</span>
              <div className="mt-1 flex gap-2">
                <input
                  type={reveal ? "text" : "password"}
                  className="input"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(e) => setApiKeyLocal(e.target.value)}
                />
                <button
                  className="btn-ghost"
                  onClick={() => setReveal(!reveal)}
                  type="button"
                >
                  {reveal ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <span className="text-xs text-ink-500 mt-1 inline-block">
                Obtenla en console.anthropic.com → Settings → API Keys
              </span>
            </label>
            <label className="block">
              <span className="label">Modelo</span>
              <select
                className="input mt-1"
                value={model}
                onChange={(e) => setModelLocal(e.target.value)}
              >
                <option value="claude-opus-4-7">claude-opus-4-7 (más potente)</option>
                <option value="claude-sonnet-4-6">claude-sonnet-4-6 (recomendado)</option>
                <option value="claude-haiku-4-5">claude-haiku-4-5 (rápido y económico)</option>
              </select>
            </label>
            <button
              onClick={saveSettings}
              className="btn-primary"
              disabled={!apiKey.trim()}
            >
              Guardar configuración
            </button>
          </div>
        )}

        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuestion(s)}
                className="pill bg-ink-100 hover:bg-brand-50 hover:text-brand-700 text-ink-700"
              >
                {s}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="label">Tu pregunta o instrucción</span>
            <textarea
              className="input mt-1 min-h-[80px]"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Qué quieres saber sobre este documento?"
            />
          </label>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {(output || running) && (
            <div
              ref={outputRef}
              className="rounded-xl border border-ink-100 bg-ink-100/30 p-4 max-h-80 overflow-y-auto"
            >
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-ink-900 font-sans text-sm leading-relaxed">
                {output}
                {running && (
                  <span className="inline-block w-2 h-4 bg-brand-600 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="p-5 border-t border-ink-100 flex items-center justify-between gap-3">
          <span className="text-xs text-ink-500">
            {doc.kind === "image"
              ? "Análisis visual con modelo multimodal"
              : doc.text
              ? `${doc.text.length.toLocaleString()} caracteres`
              : doc.datasets
              ? `${doc.datasets.reduce((s, d) => s + d.rows.length, 0)} filas en ${doc.datasets.length} hoja(s)`
              : ""}
          </span>
          <button
            onClick={run}
            disabled={running || !question.trim()}
            className="btn-primary"
          >
            <Send className="w-4 h-4" />
            {running ? "Analizando…" : "Analizar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
