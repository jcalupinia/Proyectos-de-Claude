export type Row = Record<string, string | number | null>;

export type Dataset = {
  fileName: string;
  sheetName: string;
  headers: string[];
  rows: Row[];
};

export type ColumnMapping = {
  account?: string;
  category?: string;
  budget?: string;
  actual?: string;
  previousYear?: string;
  period?: string;
  amount?: string;
  type?: string;
};

export type ReportTab =
  | "variance"
  | "vertical-horizontal"
  | "ratios"
  | "cashflow";

export type Template = {
  id: string;
  name: string;
  createdAt: string;
  mapping: ColumnMapping;
  ratios?: RatioConfig;
};

export type RatioConfig = {
  currentAssets?: string;
  currentLiabilities?: string;
  inventory?: string;
  totalAssets?: string;
  totalLiabilities?: string;
  equity?: string;
  netIncome?: string;
  revenue?: string;
  cogs?: string;
  operatingIncome?: string;
};

export type KPI = {
  label: string;
  value: number;
  format?: "currency" | "percent" | "ratio" | "number";
  trend?: number;
  hint?: string;
};
