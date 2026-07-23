"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200/70 bg-ink-50/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80 sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden text-sm text-ink-500 dark:text-ink-400 lg:block">
        Sistema interno de captación B2B
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-full border border-ink-200 py-1 pl-1 pr-3 dark:border-ink-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-[11px] font-semibold text-ink-950">
            GC
          </span>
          <span className="hidden text-xs font-medium text-ink-600 dark:text-ink-300 sm:block">Galt Capital</span>
        </div>
      </div>
    </header>
  );
}
