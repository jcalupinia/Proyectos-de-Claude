export function toNumber(value: unknown): number {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const cleaned = value
      .replace(/[\s$€]/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "")
      .replace(",", ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export function fmtCurrency(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function fmtNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat("es-EC", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function fmtPercent(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function fmtKPI(value: number, format?: string): string {
  switch (format) {
    case "currency":
      return fmtCurrency(value);
    case "percent":
      return fmtPercent(value);
    case "ratio":
      return fmtNumber(value, 2);
    case "number":
    default:
      return fmtNumber(value, 0);
  }
}

export function colorForVariance(varPct: number, inverse = false): string {
  const positive = inverse ? varPct < 0 : varPct >= 0;
  if (Math.abs(varPct) < 0.02) return "#64748b";
  return positive ? "#10b981" : "#f43f5e";
}
