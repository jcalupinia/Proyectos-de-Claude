"use client";

import type { ColumnMapping, Dataset, RatioConfig } from "@/lib/types";
import { computeRatios } from "@/lib/kpis";
import { fmtKPI } from "@/lib/format";
import KPICard from "../ui/KPICard";

type Props = {
  dataset: Dataset;
  mapping: ColumnMapping;
  ratios: RatioConfig;
};

const GROUP_ACCENT: Record<string, "blue" | "violet" | "emerald" | "amber"> = {
  Liquidez: "blue",
  Endeudamiento: "amber",
  Rentabilidad: "emerald",
};

export default function RatiosReport({ dataset, mapping, ratios }: Props) {
  const hasConfig = Object.values(ratios).some(Boolean);
  if (!mapping.account || !mapping.actual || !hasConfig) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-bold text-ink-900">Ratios Financieros</h2>
        <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto">
          Mapea las columnas básicas y abre la sección "Ratios financieros" en
          la consola para indicar qué cuenta corresponde a cada concepto
          (Activo Corriente, Patrimonio, etc.).
        </p>
      </div>
    );
  }

  const data = computeRatios(dataset, mapping, ratios);
  const grouped = data.reduce<Record<string, typeof data>>((acc, r) => {
    (acc[r.Grupo] ??= []).push(r);
    return acc;
  }, {});

  return (
    <section id="report-ratios" className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-ink-900">
          Ratios Financieros
        </h2>
        <p className="text-sm text-ink-700 mt-1">
          Indicadores clave de liquidez, endeudamiento y rentabilidad
          calculados desde tu balance.
        </p>
      </header>

      {Object.entries(grouped).map(([group, ratiosArr]) => (
        <div key={group} className="space-y-3">
          <h3 className="text-lg font-bold text-ink-900">{group}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratiosArr.map((r) => (
              <KPICard
                key={r.Ratio}
                label={r.Ratio}
                value={r.Valor}
                format={r.Tipo as "ratio" | "percent"}
                hint={r.Formula}
                accent={GROUP_ACCENT[group]}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-ink-900 mb-3">Resumen tabular</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-100">
              <th className="py-2 pr-4 font-semibold">Grupo</th>
              <th className="py-2 pr-4 font-semibold">Ratio</th>
              <th className="py-2 pr-4 font-semibold">Fórmula</th>
              <th className="py-2 font-semibold text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-b border-ink-100/60">
                <td className="py-2 pr-4 font-medium text-ink-900">{r.Grupo}</td>
                <td className="py-2 pr-4 font-medium text-ink-900">{r.Ratio}</td>
                <td className="py-2 pr-4 text-ink-700">{r.Formula}</td>
                <td className="py-2 text-right font-semibold text-brand-700">
                  {fmtKPI(r.Valor, r.Tipo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
