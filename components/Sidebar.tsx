"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  Wand2,
  FileBarChart2,
  ExternalLink,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cuentas", label: "Cuentas Objetivo", icon: Building2 },
  { href: "/contactos", label: "Contactos", icon: Users },
  { href: "/campanas", label: "Campañas", icon: Megaphone },
  { href: "/generador", label: "Generador de Mensajes", icon: Wand2 },
  { href: "/reporte", label: "Reporte Semanal", icon: FileBarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0d1428] border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none">ACAI</div>
            <div className="text-slate-400 text-xs mt-0.5">Sistema de Adquisición</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-2 mt-2 border-t border-slate-800">
          <Link
            href="/landing-ejemplo"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-150 group"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
            Ver Landing de Ejemplo
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              AV
            </div>
            <div>
              <div className="text-white text-sm font-medium">Admin User</div>
              <div className="text-slate-500 text-xs">admin@acai.mx</div>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
