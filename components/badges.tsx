import type { AccountGrade } from "@/lib/types";

const gradeStyles: Record<AccountGrade, string> = {
  A: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  B: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  C: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  unrated: "bg-slate-700/30 text-slate-500 border-slate-700",
};

export function GradeBadge({ grade }: { grade: AccountGrade }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border ${gradeStyles[grade]}`}
      title={`Cuenta ${grade === "unrated" ? "sin clasificar" : grade}`}
    >
      {grade === "unrated" ? "–" : grade}
    </span>
  );
}

// Pastilla de estado genérica con mapa de colores por palabra clave.
const statusStyles: Record<string, string> = {
  // genéricos / verdes
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  activa: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  won: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  replied: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contacted: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  meeting: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  scheduled: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  researching: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ready: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  pending_approval: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  paused: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  draft: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  new: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  lost: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  rejected: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  negative: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  positive: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  neutral: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const style = statusStyles[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/30";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {label ?? status}
    </span>
  );
}
