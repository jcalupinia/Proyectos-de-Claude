"use client";

import {
  Area,
  AreaChart,
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
import { aggregateByPeriod } from "@/lib/kpis";
import { fmtCurrency } from "@/lib/format";
import KPICard from "../ui/KPICard";

type Props = { dataset: Dataset; mapping: ColumnMapping };

export default function CashFlowReport({ dataset, mapping }: Props) {
  if (!mapping.period || !mapping.amount) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-bold text-ink-900">
          Flujo de Caja y Tendencias
        </h2>
        <p className="text-sm text-ink-500 mt-2">
          Mapea las columnas "Periodo" y "Monto" para activar este reporte.
          Idealmente también "Tipo" (ingreso/egreso).
        </p>
      </div>
    );
  }

  const series = aggregateByPeriod(dataset, mapping);
  const totalIn = series.reduce((s, r) => s + r.Ingresos, 0);
  const totalOut = series.reduce((s, r) => s + r.Egresos, 0);
  const netTotal = totalIn - totalOut;
  const lastBalance = series[series.length - 1]?.["Saldo Acumulado"] ?? 0;

  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const trendNet =
    last && prev && prev["Flujo Neto"] !== 0
      ? (last["Flujo Neto"] - prev["Flujo Neto"]) / Math.abs(prev["Flujo Neto"])
      : undefined;

  return (
    <section id="report-cashflow" className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-ink-900">
          Flujo de Caja y Tendencias
        </h2>
        <p className="text-sm text-ink-700 mt-1">
          Ingresos y egresos por periodo, con saldo acumulado para visualizar
          la trayectoria de liquidez.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ingresos totales" value={totalIn} format="currency" accent="emerald" />
        <KPICard label="Egresos totales" value={totalOut} format="currency" accent="rose" />
        <KPICard
          label="Flujo neto"
          value={netTotal}
          format="currency"
          trend={trendNet}
          accent={netTotal >= 0 ? "blue" : "rose"}
        />
        <KPICard
          label="Saldo final acumulado"
          value={lastBalance}
          format="currency"
          accent="violet"
        />
      </div>

      <div className="card">
        <h3 className="font-semibold text-ink-900 mb-3">
          Saldo acumulado por periodo
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="Periodo" tick={{ fontSize: 11, fill: "#334155" }} />
              <YAxis tick={{ fontSize: 11, fill: "#334155" }} />
              <Tooltip
                formatter={(v: number) => fmtCurrency(v)}
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
              <Area
                type="monotone"
                dataKey="Saldo Acumulado"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#cashGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-ink-900 mb-3">
          Ingresos vs Egresos por periodo
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="Periodo" tick={{ fontSize: 11, fill: "#334155" }} />
              <YAxis tick={{ fontSize: 11, fill: "#334155" }} />
              <Tooltip
                formatter={(v: number) => fmtCurrency(v)}
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Egresos" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Flujo Neto" radius={[6, 6, 0, 0]}>
                {series.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d["Flujo Neto"] >= 0 ? "#3b82f6" : "#f59e0b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-ink-900 mb-3">Detalle por periodo</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-100">
              <th className="py-2 pr-4 font-semibold">Periodo</th>
              <th className="py-2 pr-4 font-semibold text-right">Ingresos</th>
              <th className="py-2 pr-4 font-semibold text-right">Egresos</th>
              <th className="py-2 pr-4 font-semibold text-right">Flujo Neto</th>
              <th className="py-2 font-semibold text-right">Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {series.map((r, i) => (
              <tr key={i} className="border-b border-ink-100/60">
                <td className="py-2 pr-4 font-medium text-ink-900">{r.Periodo}</td>
                <td className="py-2 pr-4 text-right text-emerald-600">
                  {fmtCurrency(r.Ingresos)}
                </td>
                <td className="py-2 pr-4 text-right text-rose-600">
                  {fmtCurrency(r.Egresos)}
                </td>
                <td
                  className={`py-2 pr-4 text-right font-semibold ${
                    r["Flujo Neto"] >= 0 ? "text-brand-700" : "text-amber-600"
                  }`}
                >
                  {fmtCurrency(r["Flujo Neto"])}
                </td>
                <td className="py-2 text-right font-semibold text-ink-900">
                  {fmtCurrency(r["Saldo Acumulado"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
