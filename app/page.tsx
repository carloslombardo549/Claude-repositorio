"use client";

import MainLayout from "@/components/MainLayout";
import StatsCard from "@/components/StatsCard";
import {
  Building2,
  Users,
  Megaphone,
  MessageSquare,
  ThumbsUp,
  CalendarCheck,
  MessageSquareText,
  Calendar,
  UserPlus,
  Search,
  Send,
} from "lucide-react";
import { weeklyChartData, recentActivity, campaigns } from "@/lib/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const activityIcons: Record<string, React.ElementType> = {
  MessageSquare,
  Calendar,
  UserPlus,
  Search,
  Send,
};

const activityColors: Record<string, string> = {
  respuesta: "bg-blue-500/20 text-blue-400",
  reunion: "bg-emerald-500/20 text-emerald-400",
  contacto: "bg-purple-500/20 text-purple-400",
  investigacion: "bg-amber-500/20 text-amber-400",
  mensaje: "bg-slate-500/20 text-slate-400",
};

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Resumen de actividad — semana del 2 al 8 de junio, 2025</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatsCard
            title="Cuentas investigadas"
            value={245}
            icon={Building2}
            color="blue"
            trend="+12 esta semana"
            trendUp
          />
          <StatsCard
            title="Contactos identificados"
            value={412}
            icon={Users}
            color="purple"
            trend="+28 esta semana"
            trendUp
          />
          <StatsCard
            title="Campañas activas"
            value={3}
            icon={Megaphone}
            color="emerald"
            trend="2 en LinkedIn"
            trendUp
          />
          <StatsCard
            title="Respuestas recibidas"
            value={37}
            icon={MessageSquare}
            color="amber"
            trend="9.0% tasa respuesta"
            trendUp
          />
          <StatsCard
            title="Respuestas positivas"
            value={11}
            icon={ThumbsUp}
            color="emerald"
            trend="29.7% conversión"
            trendUp
          />
          <StatsCard
            title="Reuniones agendadas"
            value={5}
            icon={CalendarCheck}
            color="rose"
            trend="+2 esta semana"
            trendUp
          />
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold">Actividad semanal de outreach</h2>
                <p className="text-slate-400 text-sm mt-0.5">Últimas 8 semanas</p>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Contactos</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Respuestas</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Reuniones</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklyChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorContactos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRespuestas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReuniones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" />
                <XAxis dataKey="semana" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0d1428", border: "1px solid #1e2d4d", borderRadius: "8px", color: "#e2e8f0" }}
                  cursor={{ stroke: "#253660" }}
                />
                <Area type="monotone" dataKey="contactos" stroke="#3b82f6" strokeWidth={2} fill="url(#colorContactos)" />
                <Area type="monotone" dataKey="respuestas" stroke="#10b981" strokeWidth={2} fill="url(#colorRespuestas)" />
                <Area type="monotone" dataKey="reuniones" stroke="#a855f7" strokeWidth={2} fill="url(#colorReuniones)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-5">Actividad reciente</h2>
            <div className="space-y-4">
              {recentActivity.map((item) => {
                const Icon = activityIcons[item.icon] || MessageSquare;
                const colorClass = activityColors[item.tipo] || activityColors.mensaje;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm leading-snug">{item.descripcion}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.empresa} · {item.tiempo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Rendimiento de campañas</h2>
            <a href="/campanas" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
              Ver todas →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">Campaña</th>
                  <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">Estado</th>
                  <th className="text-right text-slate-400 text-xs font-medium pb-3 pr-4">Contactos</th>
                  <th className="text-right text-slate-400 text-xs font-medium pb-3 pr-4">Respuestas</th>
                  <th className="text-right text-slate-400 text-xs font-medium pb-3 pr-4">Reuniones</th>
                  <th className="text-right text-slate-400 text-xs font-medium pb-3">Tasa respuesta</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="text-white text-sm font-medium">{c.nombre}</div>
                      <div className="text-slate-500 text-xs">{c.canal}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.estado === "Activa"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.estado === "Activa" ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {c.estado}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-slate-300 text-sm">{c.contactos}</td>
                    <td className="py-3 pr-4 text-right text-slate-300 text-sm">{c.respuestas}</td>
                    <td className="py-3 pr-4 text-right text-slate-300 text-sm">{c.reuniones}</td>
                    <td className="py-3 text-right">
                      <span className="text-blue-400 text-sm font-medium">{c.tasaRespuesta}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
