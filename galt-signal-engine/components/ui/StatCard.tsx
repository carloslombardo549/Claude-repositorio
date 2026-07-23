import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ label, value, icon: Icon, hint, trend }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">{value}</span>
        {trend && (
          <span className={cn("text-xs font-medium", trend.positive ? "text-success-600 dark:text-emerald-400" : "text-danger-600 dark:text-rose-400")}>
            {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-ink-500 dark:text-ink-500">{hint}</p>}
    </Card>
  );
}
