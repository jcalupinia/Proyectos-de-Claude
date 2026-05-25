"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { fmtKPI } from "@/lib/format";
import clsx from "clsx";

type Props = {
  label: string;
  value: number;
  format?: "currency" | "percent" | "ratio" | "number";
  trend?: number;
  hint?: string;
  accent?: "blue" | "emerald" | "rose" | "amber" | "violet";
};

const accents: Record<string, string> = {
  blue: "from-brand-500 to-brand-700",
  emerald: "from-emerald-400 to-emerald-600",
  rose: "from-rose-400 to-rose-600",
  amber: "from-amber-400 to-amber-600",
  violet: "from-violet-400 to-violet-600",
};

export default function KPICard({
  label,
  value,
  format,
  trend,
  hint,
  accent = "blue",
}: Props) {
  const trendIcon =
    trend === undefined ? null : trend > 0.001 ? (
      <ArrowUpRight className="w-4 h-4" />
    ) : trend < -0.001 ? (
      <ArrowDownRight className="w-4 h-4" />
    ) : (
      <Minus className="w-4 h-4" />
    );

  const trendColor =
    trend === undefined
      ? ""
      : trend > 0.001
      ? "text-emerald-600 bg-emerald-50"
      : trend < -0.001
      ? "text-rose-600 bg-rose-50"
      : "text-ink-500 bg-ink-100";

  return (
    <div className="relative overflow-hidden card">
      <div
        className={clsx(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br",
          accents[accent]
        )}
      />
      <div className="relative">
        <div className="label">{label}</div>
        <div className="mt-2 text-3xl font-extrabold text-ink-900 tracking-tight">
          {fmtKPI(value, format)}
        </div>
        <div className="mt-3 flex items-center justify-between">
          {trend !== undefined ? (
            <span className={clsx("pill", trendColor)}>
              {trendIcon}
              {(trend * 100).toFixed(1)}%
            </span>
          ) : (
            <span />
          )}
          {hint && <span className="text-xs text-ink-500">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
