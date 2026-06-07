"use client";

import MainLayout from "@/components/MainLayout";
import { FileDown, TrendingUp, TrendingDown, Building2, Calendar, Target, CheckCircle2 } from "lucide-react";

const kpis = [
  { label: "Cuentas investigadas", value: 245, prev: 198, color: "text-white" },
  { label: "Contactos identificados", value: 412, prev: 340, color: "text-blue-400" },
  { label: "Mensajes enviados", value: 387, prev: 310, color: "text-purple-400" },
  { label: "Tasa de apertura", value: "68%", prev: "61%", color: "text-amber-400", noCalc: true },
  { label: "Respuestas recibidas", value: 37, prev: 28, color: "text-blue-400" },
  { label: "Tasa de respuesta", value: "9.6%", prev: "9.0%", color: "text-emerald-400", noCalc: true },
  { label: "Respuestas positivas", value: 11, prev: 7, color: "text-emerald-400" },
  { label: "Reuniones agendadas", value: 5, prev: 3, color: "text-rose-400" },
];

const topCuentas = [
  { empresa: "Manufactura del Norte", industria: "Manufactura", scoreIA: 95, estado: "Contactada", reuniones: 1 },
  { empresa: "Grupo Industrial Monterrey", industria: "Manufactura", scoreIA: 94, estado: "En proceso", reuniones: 1 },
  { empresa: "TechSoluciones MX", industria: "Tecnología", scoreIA: 91, estado: "Convertida", reuniones: 2 },
  { empresa: "Pharma Innovación", industria: "Farmacéutica", scoreIA: 88, estado: "En proceso", reuniones: 1 },
  { empresa: "LogiTrans México", industria: "Logística", scoreIA: 87, estado: "En proceso", reuniones: 0 },
];

const proximaSemana = [
  "Dar seguimiento a 8 contactos que no respondieron en los últimos 5 días",
  "Preparar propuesta personalizada para Manufactura del Norte (reunión el miércoles)",
  "Investigar 15 nuevas cuentas del sector farmacéutico",
  "Reactivar campaña 'Salud Corporativa' con nuevo ángulo de propuesta de valor",
  "Revisar y optimizar secuencia de mensajes para canal WhatsApp",
];

function calcChange(curr: number, prev: number): number {
  return Math.round(((curr - prev) / prev) * 100);
}

export default function ReportePage() {
  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Reporte Semanal</h1>
            <p className="text-slate-400 mt-1">Período: 2 – 8 de junio, 2025</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-600">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        {/* Report Container */}
        <div className="space-y-6">
          {/* Report Header Card */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xl font-black">A</span>
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">ACAI — Sistema de Adquisición de Clientes con IA</h2>
                  <p className="text-slate-400 text-sm">Reporte de Actividad Semanal · Generado el 8 de junio, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs">Período</div>
                <div className="text-white font-semibold">02 Jun — 08 Jun 2025</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Resumen Ejecutivo
            </h3>
            <div className="bg-blue-500/5 border border-blue-500/15 rounded-lg p-4">
              <p className="text-slate-300 leading-relaxed">
                Esta semana el sistema procesó <strong className="text-white">245 cuentas objetivo</strong> e identificó{" "}
                <strong className="text-white">412 contactos decisores</strong>. Se enviaron{" "}
                <strong className="text-white">387 mensajes personalizados</strong> a través de LinkedIn y Email, logrando una{" "}
                <strong className="text-emerald-400">tasa de respuesta del 9.6%</strong> — por encima del benchmark del sector (7.2%).
                Se agendaron <strong className="text-white">5 reuniones</strong> con prospectos de alta calificación, representando
                un <strong className="text-emerald-400">incremento del 67%</strong> respecto a la semana anterior.
                La campaña <span className="text-amber-400">"Salud Corporativa"</span> fue pausada para revisión estratégica.
              </p>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              KPIs de la Semana
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => {
                const change = kpi.noCalc
                  ? null
                  : calcChange(kpi.value as number, kpi.prev as number);
                const isUp = change !== null && change > 0;
                return (
                  <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">{kpi.label}</div>
                    <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {change !== null ? (
                        <>
                          {isUp ? (
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-rose-400" />
                          )}
                          <span className={`text-xs ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                            {isUp ? "+" : ""}{change}% vs semana anterior
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-500 text-xs">vs {kpi.prev} anterior</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-5">Desglose de Actividad por Canal</h3>
            <div className="space-y-4">
              {[
                { canal: "LinkedIn", enviados: 198, aperturas: 134, respuestas: 19, color: "bg-blue-500" },
                { canal: "Email", enviados: 156, aperturas: 108, respuestas: 14, color: "bg-purple-500" },
                { canal: "WhatsApp", enviados: 33, aperturas: 29, respuestas: 4, color: "bg-emerald-500" },
              ].map((row) => (
                <div key={row.canal} className="flex items-center gap-6">
                  <div className="w-20 text-slate-300 text-sm font-medium">{row.canal}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-1.5">
                      <span>{row.enviados} enviados</span>
                      <span>{row.aperturas} abiertos ({Math.round((row.aperturas/row.enviados)*100)}%)</span>
                      <span>{row.respuestas} respuestas ({Math.round((row.respuestas/row.enviados)*100)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.respuestas / row.enviados) * 100 * 3}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Accounts */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Top Cuentas de la Semana
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">#</th>
                  <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">Empresa</th>
                  <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">Industria</th>
                  <th className="text-center text-slate-400 text-xs font-medium pb-3 pr-4">Score IA</th>
                  <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">Estado</th>
                  <th className="text-center text-slate-400 text-xs font-medium pb-3">Reuniones</th>
                </tr>
              </thead>
              <tbody>
                {topCuentas.map((cuenta, i) => (
                  <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pr-4 text-slate-500 text-sm">{i + 1}</td>
                    <td className="py-3 pr-4 text-white text-sm font-medium">{cuenta.empresa}</td>
                    <td className="py-3 pr-4 text-slate-400 text-sm">{cuenta.industria}</td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-emerald-400 text-sm font-bold">{cuenta.scoreIA}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        cuenta.estado === "Convertida"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      }`}>{cuenta.estado}</span>
                    </td>
                    <td className="py-3 text-center text-slate-300 text-sm">{cuenta.reuniones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Next Week Plan */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Plan para la Próxima Semana
            </h3>
            <div className="space-y-3">
              {proximaSemana.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
