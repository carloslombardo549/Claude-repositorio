"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Radar,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/empresas", label: "Empresas objetivo", icon: Building2 },
  { href: "/radar", label: "Radar de señales", icon: Radar },
  { href: "/contactos", label: "Contactos y decisores", icon: Users },
  { href: "/aprobacion", label: "Cola de aprobación", icon: ClipboardCheck },
  { href: "/campanas", label: "Campañas", icon: Megaphone },
  { href: "/respuestas", label: "Bandeja de respuestas", icon: Inbox },
  { href: "/reuniones", label: "Reuniones", icon: CalendarClock },
  { href: "/informes", label: "Informes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-sm font-bold text-ink-950">
            G
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">Galt Signal</span>
            <span className="text-[11px] font-medium tracking-wide text-ink-500 dark:text-ink-400">Engine</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-ink-900 text-white dark:bg-gold-500 dark:text-ink-950"
                  : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-200 px-5 py-4 text-xs text-ink-500 dark:border-ink-800 dark:text-ink-500">
        <p className="font-medium text-ink-700 dark:text-ink-300">Galt Capital</p>
        <p>Fase demo · datos simulados</p>
      </div>
    </div>
  );
}
