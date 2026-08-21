import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "info";

const toneStyles: Record<Tone, { icon: string; delta: string }> = {
  primary: { icon: "bg-primary-soft text-primary", delta: "text-primary" },
  success: { icon: "bg-success-soft text-success", delta: "text-success" },
  warning: { icon: "bg-warning-soft text-warning-foreground", delta: "text-warning-foreground" },
  info: { icon: "bg-info-soft text-info", delta: "text-info" },
};

export function StatCard({
  label,
  value,
  hint,
  delta,
  deltaGood,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: number;
  deltaGood?: boolean;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const styles = toneStyles[tone];
  const positive = deltaGood ?? (delta ?? 0) >= 0;

  return (
    <article className="card-surface hover-lift p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", styles.icon)}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="numeric mt-3 text-3xl font-extrabold">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
              positive ? "bg-success-soft text-success" : "bg-warning-soft text-warning-foreground",
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta > 0 ? "+" : ""}
            {delta.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </article>
  );
}
