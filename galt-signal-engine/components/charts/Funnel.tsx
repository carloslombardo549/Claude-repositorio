interface FunnelStep {
  label: string;
  value: number;
}

export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1);
  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const width = Math.max((step.value / max) * 100, 4);
        const prev = steps[idx - 1];
        const conversion = prev && prev.value > 0 ? Math.min(100, Math.round((step.value / prev.value) * 100)) : null;
        return (
          <div key={step.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-ink-700 dark:text-ink-300">{step.label}</span>
              <span className="text-ink-500 dark:text-ink-400">
                {step.value}
                {conversion !== null && <span className="ml-2 text-ink-400 dark:text-ink-500">({conversion}%)</span>}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
