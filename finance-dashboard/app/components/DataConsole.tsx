"use client";

import { Settings2, Save, FolderOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Select from "./ui/Select";
import type { ColumnMapping, Dataset, RatioConfig, Template } from "@/lib/types";
import { deleteTemplate, loadTemplates, saveTemplate } from "@/lib/templates";

type Props = {
  dataset: Dataset;
  mapping: ColumnMapping;
  ratios: RatioConfig;
  onMappingChange: (m: ColumnMapping) => void;
  onRatiosChange: (r: RatioConfig) => void;
};

export default function DataConsole({
  dataset,
  mapping,
  ratios,
  onMappingChange,
  onRatiosChange,
}: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [showRatios, setShowRatios] = useState(false);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const set = (k: keyof ColumnMapping) => (v: string) =>
    onMappingChange({ ...mapping, [k]: v || undefined });

  const setRatio = (k: keyof RatioConfig) => (v: string) =>
    onRatiosChange({ ...ratios, [k]: v || undefined });

  function handleSave() {
    if (!templateName.trim()) return;
    const t: Template = {
      id: crypto.randomUUID(),
      name: templateName.trim(),
      createdAt: new Date().toISOString(),
      mapping,
      ratios,
    };
    saveTemplate(t);
    setTemplates(loadTemplates());
    setTemplateName("");
  }

  function handleLoad(id: string) {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    onMappingChange(t.mapping);
    if (t.ratios) onRatiosChange(t.ratios);
  }

  function handleDelete(id: string) {
    deleteTemplate(id);
    setTemplates(loadTemplates());
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-bold text-ink-900">
          Consola — mapeo de columnas
        </h2>
        <span className="ml-auto text-xs text-ink-500">
          {dataset.rows.length} filas · hoja "{dataset.sheetName}"
        </span>
      </div>

      <p className="text-sm text-ink-700 mb-4">
        Indica qué columna de tu Excel corresponde a cada campo. Las opcionales
        habilitan reportes adicionales.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Select
          label="Cuenta / Concepto"
          value={mapping.account}
          onChange={set("account")}
          options={dataset.headers}
        />
        <Select
          label="Categoría"
          value={mapping.category}
          onChange={set("category")}
          options={dataset.headers}
          optional
        />
        <Select
          label="Presupuesto"
          value={mapping.budget}
          onChange={set("budget")}
          options={dataset.headers}
          optional
        />
        <Select
          label="Real / Actual"
          value={mapping.actual}
          onChange={set("actual")}
          options={dataset.headers}
        />
        <Select
          label="Año anterior"
          value={mapping.previousYear}
          onChange={set("previousYear")}
          options={dataset.headers}
          optional
        />
        <Select
          label="Periodo (para flujo)"
          value={mapping.period}
          onChange={set("period")}
          options={dataset.headers}
          optional
        />
        <Select
          label="Monto (para flujo)"
          value={mapping.amount}
          onChange={set("amount")}
          options={dataset.headers}
          optional
        />
        <Select
          label="Tipo (ingreso/egreso)"
          value={mapping.type}
          onChange={set("type")}
          options={dataset.headers}
          optional
        />
      </div>

      <details
        className="mt-5 border-t border-ink-100 pt-4"
        open={showRatios}
        onToggle={(e) => setShowRatios((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-sm font-semibold text-ink-700 hover:text-brand-600">
          Ratios financieros — identificadores de cuenta
        </summary>
        <p className="text-xs text-ink-500 mt-2 mb-3">
          Escribe el nombre exacto (o parte) de la cuenta que representa cada
          concepto en tu Excel. Por ejemplo: "Activo Corriente".
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["currentAssets", "Activo Corriente"],
            ["currentLiabilities", "Pasivo Corriente"],
            ["inventory", "Inventarios"],
            ["totalAssets", "Activo Total"],
            ["totalLiabilities", "Pasivo Total"],
            ["equity", "Patrimonio"],
            ["netIncome", "Utilidad Neta"],
            ["revenue", "Ingresos / Ventas"],
            ["cogs", "Costo de Ventas"],
            ["operatingIncome", "Utilidad Operacional"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="label">{label}</span>
              <input
                className="input mt-1"
                placeholder="ej: Activo Corriente"
                value={(ratios as Record<string, string | undefined>)[key] ?? ""}
                onChange={(e) =>
                  setRatio(key as keyof RatioConfig)(e.target.value)
                }
              />
            </label>
          ))}
        </div>
      </details>

      <div className="mt-5 border-t border-ink-100 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Save className="w-4 h-4 text-ink-700" />
          <span className="text-sm font-semibold text-ink-700">
            Plantillas reutilizables
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="input flex-1 min-w-[200px]"
            placeholder="Nombre de la plantilla (ej: P&L mensual)"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!templateName.trim()}
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
        {templates.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-ink-100 text-sm text-ink-900"
              >
                <FolderOpen className="w-3.5 h-3.5 text-brand-600" />
                <button onClick={() => handleLoad(t.id)} className="font-medium">
                  {t.name}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="ml-1 text-ink-500 hover:text-rose-600"
                  aria-label="Eliminar plantilla"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
