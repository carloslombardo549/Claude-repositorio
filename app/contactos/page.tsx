"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { contacts } from "@/lib/mockData";
import { Search, ChevronDown, Linkedin, Mail, MessageCircle, Users } from "lucide-react";

const estadoColors: Record<string, string> = {
  "Respondió": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Contactado": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Pendiente": "bg-slate-500/15 text-slate-400 border-slate-500/30",
  "Reunión agendada": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const avatarColors: Record<string, string> = {
  blue: "from-blue-500 to-blue-700",
  emerald: "from-emerald-500 to-emerald-700",
  purple: "from-purple-500 to-purple-700",
  slate: "from-slate-500 to-slate-700",
};

const canalIcons: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  Email: Mail,
  WhatsApp: MessageCircle,
};

export default function ContactosPage() {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterEmpresa, setFilterEmpresa] = useState("Todas");

  const empresas = ["Todas", ...Array.from(new Set(contacts.map((c) => c.empresa)))];
  const estados = ["Todos", "Respondió", "Contactado", "Pendiente", "Reunión agendada"];

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.cargo.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "Todos" || c.estado === filterEstado;
    const matchEmpresa = filterEmpresa === "Todas" || c.empresa === filterEmpresa;
    return matchSearch && matchEstado && matchEmpresa;
  });

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Contactos</h1>
            <p className="text-slate-400 mt-1">{contacts.length} decisores identificados</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            + Agregar contacto
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o cargo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d1428] border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={filterEmpresa}
              onChange={(e) => setFilterEmpresa(e.target.value)}
              className="appearance-none bg-[#0d1428] border border-slate-700 rounded-lg px-4 py-2.5 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {empresas.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="appearance-none bg-[#0d1428] border border-slate-700 rounded-lg px-4 py-2.5 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {estados.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d1428] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Nombre</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Cargo</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Empresa</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Email</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Canal preferido</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Estado</th>
                <th className="text-center text-slate-400 text-xs font-medium py-3 px-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => {
                const CanalIcon = canalIcons[contact.canalPreferido] || Mail;
                return (
                  <tr
                    key={contact.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[contact.color] || avatarColors.slate} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {contact.iniciales}
                        </div>
                        <span className="text-white text-sm font-medium">{contact.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-sm">{contact.cargo}</td>
                    <td className="py-3.5 px-4 text-slate-300 text-sm">{contact.empresa}</td>
                    <td className="py-3.5 px-4">
                      <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                        {contact.email}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <CanalIcon className="w-3.5 h-3.5" />
                        {contact.canalPreferido}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoColors[contact.estado] || estadoColors["Pendiente"]}`}>
                        {contact.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        Enviar mensaje
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No se encontraron contactos con los filtros seleccionados</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Mostrando {filtered.length} de {contacts.length} contactos
        </div>
      </div>
    </MainLayout>
  );
}
