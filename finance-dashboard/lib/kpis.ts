import type { ColumnMapping, Dataset, RatioConfig, Row } from "./types";
import { toNumber } from "./format";

export function computeVariance(ds: Dataset, m: ColumnMapping) {
  if (!m.account || !m.budget || !m.actual) return [];
  return ds.rows
    .map((r) => {
      const account = String(r[m.account!] ?? "").trim();
      if (!account) return null;
      const budget = toNumber(r[m.budget!]);
      const actual = toNumber(r[m.actual!]);
      const variance = actual - budget;
      const variancePct = budget !== 0 ? variance / Math.abs(budget) : 0;
      return {
        Cuenta: account,
        Categoria: m.category ? String(r[m.category] ?? "") : "",
        Presupuesto: budget,
        Real: actual,
        Variacion: variance,
        "Variacion %": variancePct,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}

export function aggregateByPeriod(ds: Dataset, m: ColumnMapping) {
  if (!m.period || !m.amount) return [];
  const map = new Map<string, { ingresos: number; egresos: number; neto: number }>();
  for (const r of ds.rows) {
    const period = String(r[m.period] ?? "").trim();
    if (!period) continue;
    const amount = toNumber(r[m.amount]);
    const type = m.type ? String(r[m.type] ?? "").toLowerCase() : "";
    const isIncome =
      type.includes("ingreso") ||
      type.includes("income") ||
      type.includes("venta") ||
      (!type && amount >= 0);
    const cur = map.get(period) ?? { ingresos: 0, egresos: 0, neto: 0 };
    if (isIncome) cur.ingresos += Math.abs(amount);
    else cur.egresos += Math.abs(amount);
    cur.neto = cur.ingresos - cur.egresos;
    map.set(period, cur);
  }
  const sorted = Array.from(map.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], "es", { numeric: true })
  );
  let cum = 0;
  return sorted.map(([period, v]) => {
    cum += v.neto;
    return {
      Periodo: period,
      Ingresos: v.ingresos,
      Egresos: v.egresos,
      "Flujo Neto": v.neto,
      "Saldo Acumulado": cum,
    };
  });
}

export function verticalAnalysis(ds: Dataset, m: ColumnMapping) {
  if (!m.account || !m.actual) return [];
  const rows = ds.rows.map((r) => ({
    account: String(r[m.account!] ?? "").trim(),
    value: toNumber(r[m.actual!]),
    category: m.category ? String(r[m.category] ?? "") : "",
  })).filter((r) => r.account);

  const total = rows.reduce((s, r) => s + r.value, 0);
  return rows.map((r) => ({
    Cuenta: r.account,
    Categoria: r.category,
    Valor: r.value,
    "% del Total": total !== 0 ? r.value / total : 0,
  }));
}

export function horizontalAnalysis(ds: Dataset, m: ColumnMapping) {
  if (!m.account || !m.actual || !m.previousYear) return [];
  return ds.rows
    .map((r) => {
      const account = String(r[m.account!] ?? "").trim();
      if (!account) return null;
      const cur = toNumber(r[m.actual!]);
      const prev = toNumber(r[m.previousYear!]);
      const change = cur - prev;
      const changePct = prev !== 0 ? change / Math.abs(prev) : 0;
      return {
        Cuenta: account,
        Anterior: prev,
        Actual: cur,
        Variacion: change,
        "Variacion %": changePct,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}

function findValue(ds: Dataset, m: ColumnMapping, accountKey?: string): number {
  if (!accountKey || !m.account || !m.actual) return 0;
  const key = accountKey.toLowerCase();
  const match = ds.rows.find((r) => {
    const account = String(r[m.account!] ?? "").trim().toLowerCase();
    return account === key || account.includes(key);
  });
  return match ? toNumber(match[m.actual!]) : 0;
}

export function computeRatios(ds: Dataset, m: ColumnMapping, r: RatioConfig) {
  const ca = findValue(ds, m, r.currentAssets);
  const cl = findValue(ds, m, r.currentLiabilities);
  const inv = findValue(ds, m, r.inventory);
  const ta = findValue(ds, m, r.totalAssets);
  const tl = findValue(ds, m, r.totalLiabilities);
  const eq = findValue(ds, m, r.equity);
  const ni = findValue(ds, m, r.netIncome);
  const rev = findValue(ds, m, r.revenue);
  const cogs = findValue(ds, m, r.cogs);
  const op = findValue(ds, m, r.operatingIncome);

  return [
    {
      Grupo: "Liquidez",
      Ratio: "Liquidez Corriente",
      Formula: "Activo Corriente / Pasivo Corriente",
      Valor: cl !== 0 ? ca / cl : 0,
      Tipo: "ratio",
    },
    {
      Grupo: "Liquidez",
      Ratio: "Prueba Ácida",
      Formula: "(Activo Corriente - Inventarios) / Pasivo Corriente",
      Valor: cl !== 0 ? (ca - inv) / cl : 0,
      Tipo: "ratio",
    },
    {
      Grupo: "Endeudamiento",
      Ratio: "Endeudamiento Total",
      Formula: "Pasivo Total / Activo Total",
      Valor: ta !== 0 ? tl / ta : 0,
      Tipo: "percent",
    },
    {
      Grupo: "Endeudamiento",
      Ratio: "Apalancamiento",
      Formula: "Activo Total / Patrimonio",
      Valor: eq !== 0 ? ta / eq : 0,
      Tipo: "ratio",
    },
    {
      Grupo: "Rentabilidad",
      Ratio: "ROE",
      Formula: "Utilidad Neta / Patrimonio",
      Valor: eq !== 0 ? ni / eq : 0,
      Tipo: "percent",
    },
    {
      Grupo: "Rentabilidad",
      Ratio: "ROA",
      Formula: "Utilidad Neta / Activo Total",
      Valor: ta !== 0 ? ni / ta : 0,
      Tipo: "percent",
    },
    {
      Grupo: "Rentabilidad",
      Ratio: "Margen Neto",
      Formula: "Utilidad Neta / Ingresos",
      Valor: rev !== 0 ? ni / rev : 0,
      Tipo: "percent",
    },
    {
      Grupo: "Rentabilidad",
      Ratio: "Margen Bruto",
      Formula: "(Ingresos - Costo) / Ingresos",
      Valor: rev !== 0 ? (rev - cogs) / rev : 0,
      Tipo: "percent",
    },
    {
      Grupo: "Rentabilidad",
      Ratio: "Margen Operacional",
      Formula: "Utilidad Operacional / Ingresos",
      Valor: rev !== 0 ? op / rev : 0,
      Tipo: "percent",
    },
  ];
}
