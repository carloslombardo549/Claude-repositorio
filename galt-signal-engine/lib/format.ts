export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEurM(value: number): string {
  return `${value.toLocaleString("es-ES", { maximumFractionDigits: 1 })} M€`;
}

export function formatEur(value: number): string {
  return value.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;
}

export function relativeDays(iso: string, now: Date): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hoy";
  if (days === 1) return "hace 1 día";
  if (days < 30) return `hace ${days} días`;
  const months = Math.round(days / 30);
  if (months === 1) return "hace 1 mes";
  return `hace ${months} meses`;
}
