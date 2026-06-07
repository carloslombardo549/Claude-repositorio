"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { companies } from "@/lib/mockData";
import { Search, Plus, ExternalLink, ChevronDown, Building2, TrendingUp } from "lucide-react";

const estadoColors: Record<string, string> = {
  Investigada: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Contactada: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "En proceso": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Convertida: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const scoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-blue-400";
  if (score >= 70) return "text-amber-400";
  return "text-rose-400";
};

export default function CuentasPage() {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterIndustria, setFilterIndustria] = useState("Todas");

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.industria.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "Todos" || c.estado === filterEstado;
    const matchIndustria = filterIndustria === "Todas" || c.industria === filterIndustria;
    return matchSearch && matchEstado && matchIndustria;
  });

  const industrias = ["Todas", ...Array.from(new Set(companies.map((c) => c.industria)))];
  const estados = ["Todos", "Investigada", "Contactada", "En proceso", "Convertida"];

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Cuentas Objetivo</h1>
            <p className="text-slate-400 mt-1">{companies.length} empresas investigadas con IA</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Investigar nueva cuenta
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar empresa o industria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d1428] border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
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
          <div className="relative">
            <select
              value={filterIndustria}
              onChange={(e) => setFilterIndustria(e.target.value)}
              className="appearance-none bg-[#0d1428] border border-slate-700 rounded-lg px-4 py-2.5 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {industrias.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d1428] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Empresa</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Industria</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Tamaño</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Ingresos Est.</th>
                <th className="text-center text-slate-400 text-xs font-medium py-3 px-4">Score IA</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Estado</th>
                <th className="text-center text-slate-400 text-xs font-medium py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{company.nombre}</div>
                        <div className="text-slate-500 text-xs">{company.sitio}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 text-sm">{company.industria}</td>
                  <td className="py-4 px-4 text-slate-300 text-sm">{company.tamano}</td>
                  <td className="py-4 px-4 text-slate-300 text-sm font-medium">{company.ingresos}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${scoreColor(company.scoreIA)}`}>
                        {company.scoreIA}
                      </span>
                      <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${company.scoreIA >= 90 ? "bg-emerald-500" : company.scoreIA >= 80 ? "bg-blue-500" : company.scoreIA >= 70 ? "bg-amber-500" : "bg-rose-500"}`}
                          style={{ width: `${company.scoreIA}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoColors[company.estado]}`}>
                      {company.estado}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        Ver perfil
                      </button>
                      <a
                        href={`https://${company.sitio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-300 transition-colors p-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <Building2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No se encontraron empresas con los filtros seleccionados</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando {filtered.length} de {companies.length} cuentas</span>
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            Score promedio: {Math.round(companies.reduce((a, c) => a + c.scoreIA, 0) / companies.length)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
