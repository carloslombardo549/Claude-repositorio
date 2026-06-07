"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Megaphone, Wand2, Inbox,
  GitBranch, CalendarCheck, FileBarChart2, Settings, Zap, LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/empresas", label: "Empresas objetivo", icon: Building2 },
  { href: "/contactos", label: "Contactos", icon: Users },
  { href: "/campanas", label: "Campañas", icon: Megaphone },
  { href: "/generador", label: "Generador de mensajes", icon: Wand2 },
  { href: "/respuestas", label: "Bandeja de respuestas", icon: Inbox },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/reuniones", label: "Reuniones", icon: CalendarCheck },
  { href: "/informes", label: "Informes semanales", icon: FileBarChart2 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
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
            <div className="text-white font-bold text-lg leading-none">Captia</div>
            <div className="text-slate-400 text-xs mt-0.5">Captación B2B</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
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
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div>
              <div className="text-white text-sm font-medium">Admin Agencia</div>
              <div className="text-slate-500 text-xs">Cliente Demo S.L.</div>
            </div>
          </div>
          <Link href="/login" className="text-slate-500 hover:text-slate-300 transition-colors" title="Cerrar sesión">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
