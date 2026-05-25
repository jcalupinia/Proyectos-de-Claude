"use client";

import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ColumnMapping, Dataset } from "@/lib/types";
import { horizontalAnalysis, verticalAnalysis } from "@/lib/kpis";
import { fmtCurrency, fmtPercent } from "@/lib/format";

type Props = { dataset: Dataset; mapping: ColumnMapping };

const PIE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
  "#ec4899",
  "#0ea5e9",
];

export default function AnalysisReport({ dataset, mapping }: Props) {
  const vertical = verticalAnalysis(dataset, mapping);
  const horizontal = horizontalAnalysis(dataset, mapping);

  if (!mapping.account || !mapping.actual) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-bold text-ink-900">
          Análisis Vertical y Horizontal
        </h2>
        <p className="text-sm text-ink-500 mt-2">
          Mapea Cuenta y Real para análisis vertical. Agrega "Año anterior"
          para análisis horizontal.
        </p>
      </div>
    );
  }

  const topVertical = vertical
    .slice()
    .sort((a, b) => Math.abs(b.Valor) - Math.abs(a.Valor))
    .slice(0, 10);

  return (
    <section id="report-analysis" className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-ink-900">
          Análisis Vertical y Horizontal
        </h2>
        <p className="text-sm text-ink-700 mt-1">
          Vertical: peso porcentual de cada cuenta sobre el total. Horizontal:
          variación frente al periodo anterior.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-ink-900 mb-3">
            Análisis vertical — Top 10 cuentas
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topVertical}
                  dataKey="Valor"
                  nameKey="Cuenta"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {topVertical.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => fmtCurrency(v)}
                  contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1 text-xs">
            {topVertical.map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 text-ink-700"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="truncate max-w-[180px]">{r.Cuenta}</span>
                </span>
                <span className="font-semibold">
                  {fmtPercent(r["% del Total"])}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="font-semibold text-ink-900 mb-3">
            Análisis horizontal — Mayores variaciones
          </h3>
          {horizontal.length === 0 ? (
            <p className="text-sm text-ink-500">
              Mapea "Año anterior" para habilitar este gráfico.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={horizontal
                    .slice()
                    .sort(
                      (a, b) => Math.abs(b.Variacion) - Math.abs(a.Variacion)
                    )
                    .slice(0, 8)
                    .map((r) => ({
                      name:
                        r.Cuenta.length > 18
                          ? r.Cuenta.slice(0, 18) + "…"
                          : r.Cuenta,
                      Variacion: r.Variacion,
                    }))}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
                >
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v: number) => fmtCurrency(v)}
                    contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
                  />
                  <Bar dataKey="Variacion" radius={[0, 6, 6, 0]}>
                    {horizontal
                      .slice()
                      .sort(
                        (a, b) =>
                          Math.abs(b.Variacion) - Math.abs(a.Variacion)
                      )
                      .slice(0, 8)
                      .map((r, i) => (
                        <Cell
                          key={i}
                          fill={r.Variacion >= 0 ? "#10b981" : "#f43f5e"}
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-ink-900 mb-3">
          Detalle vertical (composición)
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-100">
              <th className="py-2 pr-4 font-semibold">Cuenta</th>
              <th className="py-2 pr-4 font-semibold">Categoría</th>
              <th className="py-2 pr-4 font-semibold text-right">Valor</th>
              <th className="py-2 font-semibold text-right">% del Total</th>
            </tr>
          </thead>
          <tbody>
            {vertical.map((r, i) => (
              <tr key={i} className="border-b border-ink-100/60">
                <td className="py-2 pr-4 font-medium text-ink-900">
                  {r.Cuenta}
                </td>
                <td className="py-2 pr-4 text-ink-700">{r.Categoria}</td>
                <td className="py-2 pr-4 text-right">
                  {fmtCurrency(r.Valor)}
                </td>
                <td className="py-2 text-right font-semibold text-brand-700">
                  {fmtPercent(r["% del Total"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {horizontal.length > 0 && (
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-ink-900 mb-3">
            Detalle horizontal (vs año anterior)
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-ink-100">
                <th className="py-2 pr-4 font-semibold">Cuenta</th>
                <th className="py-2 pr-4 font-semibold text-right">Anterior</th>
                <th className="py-2 pr-4 font-semibold text-right">Actual</th>
                <th className="py-2 pr-4 font-semibold text-right">Variación</th>
                <th className="py-2 font-semibold text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {horizontal.map((r, i) => (
                <tr key={i} className="border-b border-ink-100/60">
                  <td className="py-2 pr-4 font-medium text-ink-900">
                    {r.Cuenta}
                  </td>
                  <td className="py-2 pr-4 text-right">{fmtCurrency(r.Anterior)}</td>
                  <td className="py-2 pr-4 text-right">{fmtCurrency(r.Actual)}</td>
                  <td
                    className={`py-2 pr-4 text-right font-semibold ${
                      r.Variacion >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {fmtCurrency(r.Variacion)}
                  </td>
                  <td
                    className={`py-2 text-right font-semibold ${
                      r["Variacion %"] >= 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {fmtPercent(r["Variacion %"])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
