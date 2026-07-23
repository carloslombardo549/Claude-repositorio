import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 px-6 py-14 text-center dark:border-ink-700">
      <Icon className="mb-1 h-8 w-8 text-ink-400 dark:text-ink-600" strokeWidth={1.5} />
      <p className="text-sm font-medium text-ink-700 dark:text-ink-300">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-500 dark:text-ink-500">{description}</p>}
    </div>
  );
}
