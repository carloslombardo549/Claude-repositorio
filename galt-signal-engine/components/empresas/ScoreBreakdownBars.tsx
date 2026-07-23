import type { ScoreBreakdown } from "@/lib/types";

const ROWS: { key: keyof Omit<ScoreBreakdown, "total">; label: string; max: number }[] = [
  { key: "icpFit", label: "Encaje con ICP", max: 35 },
  { key: "senalNecesidad", label: "Señal de necesidad o intención", max: 30 },
  { key: "problemaComercial", label: "Problema comercial probable", max: 20 },
  { key: "accesibilidadDecisor", label: "Accesibilidad del decisor", max: 15 },
];

export function ScoreBreakdownBars({ score }: { score: ScoreBreakdown }) {
  return (
    <div className="space-y-3">
      {ROWS.map((row) => {
        const value = score[row.key];
        const pct = Math.round((value / row.max) * 100);
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-ink-700 dark:text-ink-300">{row.label}</span>
              <span className="text-ink-500 dark:text-ink-500">
                {value}/{row.max}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-ink-100 dark:bg-ink-800">
              <div className="h-2 rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
