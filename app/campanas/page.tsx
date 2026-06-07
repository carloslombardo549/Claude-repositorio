"use client";

import MainLayout from "@/components/MainLayout";
import { campaigns } from "@/lib/mockData";
import { Plus, Play, Pause, BarChart2, Users, MessageSquare, Calendar, ArrowRight } from "lucide-react";

const estadoStyles: Record<string, string> = {
  Activa: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Pausada: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export default function CampanasPage() {
  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Campañas</h1>
            <p className="text-slate-400 mt-1">Gestiona tus campañas de outreach activas</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </button>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-[#0d1428] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200 card-glow group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-3">
                  <h3 className="text-white font-semibold text-lg leading-tight">{campaign.nombre}</h3>
                  <p className="text-slate-400 text-xs mt-1">{campaign.industria} · {campaign.canal}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${estadoStyles[campaign.estado]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${campaign.estado === "Activa" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  {campaign.estado}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{campaign.descripcion}</p>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Progreso de campaña</span>
                  <span className="font-medium text-white">{campaign.progreso}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      campaign.estado === "Activa" ? "bg-gradient-to-r from-blue-500 to-emerald-500" : "bg-amber-500/60"
                    }`}
                    style={{ width: `${campaign.progreso}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
                  <span>{campaign.fechaInicio}</span>
                  <span>{campaign.fechaFin}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-slate-800/40 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                    <Users className="w-3 h-3" />
                    <span>Contactos</span>
                  </div>
                  <div className="text-white font-bold text-lg">{campaign.contactos}</div>
                </div>
                <div className="bg-slate-800/40 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>Respuestas</span>
                  </div>
                  <div className="text-blue-400 font-bold text-lg">{campaign.respuestas}</div>
                </div>
                <div className="bg-slate-800/40 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Reuniones</span>
                  </div>
                  <div className="text-emerald-400 font-bold text-lg">{campaign.reuniones}</div>
                </div>
              </div>

              {/* Tasa Respuesta */}
              <div className="flex items-center justify-between mb-5 bg-slate-800/30 rounded-lg px-3 py-2">
                <span className="text-slate-400 text-xs">Tasa de respuesta</span>
                <span className="text-blue-400 font-semibold text-sm">{campaign.tasaRespuesta}%</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex-1 justify-center ${
                  campaign.estado === "Activa"
                    ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                }`}>
                  {campaign.estado === "Activa" ? (
                    <><Pause className="w-3 h-3" /> Pausar</>
                  ) : (
                    <><Play className="w-3 h-3" /> Reanudar</>
                  )}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex-1 justify-center border border-slate-700">
                  <BarChart2 className="w-3 h-3" /> Análisis
                </button>
                <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total contactados", value: campaigns.reduce((a, c) => a + c.contactos, 0), color: "text-white" },
            { label: "Total respuestas", value: campaigns.reduce((a, c) => a + c.respuestas, 0), color: "text-blue-400" },
            { label: "Total reuniones", value: campaigns.reduce((a, c) => a + c.reuniones, 0), color: "text-emerald-400" },
            {
              label: "Tasa promedio",
              value: `${(campaigns.reduce((a, c) => a + c.tasaRespuesta, 0) / campaigns.length).toFixed(1)}%`,
              color: "text-purple-400",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d1428] border border-slate-800 rounded-xl p-5 text-center">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-slate-400 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
