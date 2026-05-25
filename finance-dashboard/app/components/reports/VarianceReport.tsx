"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ColumnMapping, Dataset } from "@/lib/types";
import { computeVariance } from "@/lib/kpis";
import { fmtCurrency, fmtPercent } from "@/lib/format";
import KPICard from "../ui/KPICard";

type Props = { dataset: Dataset; mapping: ColumnMapping };

export default function VarianceReport({ dataset, mapping }: Props) {
  const rows = computeVariance(dataset, mapping);

  if (!mapping.account || !mapping.budget || !mapping.actual) {
    return (
      <EmptyState
        title="Variación Presupuesto vs Real"
        msg="Mapea las columnas Cuenta, Presupuesto y Real para ver este reporte."
      />
    );
  }

  const totalBudget = rows.reduce((s, r) => s + r.Presupuesto, 0);
  const totalActual = rows.reduce((s, r) => s + r.Real, 0);
  const totalVar = totalActual - totalBudget;
  const totalVarPct = totalBudget !== 0 ? totalVar / Math.abs(totalBudget) : 0;
  const favorables = rows.filter((r) => r.Variacion >= 0).length;
  const desfavorables = rows.length - favorables;

  const chartData = rows
    .slice()
    .sort((a, b) => Math.abs(b.Variacion) - Math.abs(a.Variacion))
    .slice(0, 12)
    .map((r) => ({
      name: r.Cuenta.length > 22 ? r.Cuenta.slice(0, 22) + "…" : r.Cuenta,
      Presupuesto: r.Presupuesto,
      Real: r.Real,
      _variance: r.Variacion,
    }));

  return (
    <section id="report-variance" className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-ink-900">
          Variación Presupuesto vs Real
        </h2>
        <p className="text-sm text-ink-700 mt-1">
          Comparación cuenta por cuenta. Las desviaciones se ordenan por
          magnitud para enfocar en lo material.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Presupuesto total"
          value={totalBudget}
          format="currency"
          accent="blue"
        />
        <KPICard
          label="Real total"
          value={totalActual}
          format="currency"
          accent="violet"
        />
        <KPICard
          label="Variación"
          value={totalVar}
          format="currency"
          trend={totalVarPct}
          accent={totalVar >= 0 ? "emerald" : "rose"}
        />
        <KPICard
          label="Cuentas favorables"
          value={favorables}
          format="number"
          hint={`${desfavorables} desfavorables`}
          accent="amber"
        />
      </div>

      <div className="card">
        <h3 className="font-semibold text-ink-900 mb-3">
          Top 12 variaciones por magnitud
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: "#334155" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#334155" }} />
              <Tooltip
                formatter={(v: number) => fmtCurrency(v)}
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Presupuesto" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Real" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d._variance >= 0 ? "#10b981" : "#f43f5e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-ink-900 mb-3">Detalle por cuenta</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-100">
              <th className="py-2 pr-4 font-semibold">Cuenta</th>
              <th className="py-2 pr-4 font-semibold">Categoría</th>
              <th className="py-2 pr-4 font-semibold text-right">Presupuesto</th>
              <th className="py-2 pr-4 font-semibold text-right">Real</th>
              <th className="py-2 pr-4 font-semibold text-right">Variación</th>
              <th className="py-2 font-semibold text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-ink-100/60">
                <td className="py-2 pr-4 font-medium text-ink-900">{r.Cuenta}</td>
                <td className="py-2 pr-4 text-ink-700">{r.Categoria}</td>
                <td className="py-2 pr-4 text-right">{fmtCurrency(r.Presupuesto)}</td>
                <td className="py-2 pr-4 text-right">{fmtCurrency(r.Real)}</td>
                <td
                  className={`py-2 pr-4 text-right font-semibold ${
                    r.Variacion >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {fmtCurrency(r.Variacion)}
                </td>
                <td
                  className={`py-2 text-right font-semibold ${
                    r["Variacion %"] >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {fmtPercent(r["Variacion %"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EmptyState({ title, msg }: { title: string; msg: string }) {
  return (
    <div className="card text-center py-12">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      <p className="text-sm text-ink-500 mt-2">{msg}</p>
    </div>
  );
}
