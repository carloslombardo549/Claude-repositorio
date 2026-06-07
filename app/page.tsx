import MainLayout from "@/components/MainLayout";
import StatsCard from "@/components/StatsCard";
import PageHeader from "@/components/PageHeader";
import WeeklyChart from "@/components/WeeklyChart";
import { StatusBadge } from "@/components/badges";
import {
  Building2, Users, Megaphone, MessageSquare, ThumbsUp, CalendarCheck,
  MessageSquare as MsgIcon, Calendar, UserPlus, Search, Send,
} from "lucide-react";
import {
  getDashboardStats, getCampaigns, getActivity, getWeeklyTrend, getOrganization,
} from "@/lib/data";
import { campaignStatusLabel } from "@/lib/labels";

const activityIcons: Record<string, React.ElementType> = {
  reply: MsgIcon, meeting: Calendar, contact: UserPlus, research: Search, message: Send,
};
const activityColors: Record<string, string> = {
  reply: "bg-blue-500/20 text-blue-400",
  meeting: "bg-emerald-500/20 text-emerald-400",
  contact: "bg-purple-500/20 text-purple-400",
  research: "bg-amber-500/20 text-amber-400",
  message: "bg-slate-500/20 text-slate-400",
};

export default async function Dashboard() {
  const [stats, campaigns, activity, trend, org] = await Promise.all([
    getDashboardStats(), getCampaigns(), getActivity(), Promise.resolve(getWeeklyTrend()), getOrganization(),
  ]);

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Dashboard"
          subtitle={`${org.name} — resumen de captación, semana del 1 al 7 de junio de 2026`}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatsCard title="Empresas objetivo" value={stats.companies} icon={Building2} color="blue" trend={`${stats.gradeA} de grado A`} trendUp />
          <StatsCard title="Contactos" value={stats.contacts} icon={Users} color="purple" trend="con decisores" trendUp />
          <StatsCard title="Campañas activas" value={stats.activeCampaigns} icon={Megaphone} color="emerald" trend="en curso" trendUp />
          <StatsCard title="Respuestas" value={stats.replies} icon={MessageSquare} color="amber" trend={`${stats.replyRate}% tasa respuesta`} trendUp />
          <StatsCard title="Respuestas positivas" value={stats.positiveReplies} icon={ThumbsUp} color="emerald" trend={`${stats.conversionRate}% conversión`} trendUp />
          <StatsCard title="Reuniones" value={stats.meetings} icon={CalendarCheck} color="rose" trend="agendadas" trendUp />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold">Actividad semanal de captación</h2>
                <p className="text-slate-400 text-sm mt-0.5">Últimas 8 semanas</p>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Contactos</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Respuestas</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Reuniones</span>
              </div>
            </div>
            <WeeklyChart data={trend} />
          </div>

          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-5">Actividad reciente</h2>
            <div className="space-y-4">
              {activity.map((item) => {
                const Icon = activityIcons[item.kind] || MsgIcon;
                const colorClass = activityColors[item.kind] || activityColors.message;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm leading-snug">{item.description}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.entity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Rendimiento de campañas</h2>
            <a href="/campanas" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">Ver todas →</a>
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
                {campaigns.map((c) => {
                  const rate = c.targets ? Math.round(((c.replies ?? 0) / c.targets) * 1000) / 10 : 0;
                  return (
                    <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="text-white text-sm font-medium">{c.name}</div>
                        <div className="text-slate-500 text-xs">{c.channel}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={c.status} label={campaignStatusLabel[c.status]} />
                      </td>
                      <td className="py-3 pr-4 text-right text-slate-300 text-sm">{c.targets ?? 0}</td>
                      <td className="py-3 pr-4 text-right text-slate-300 text-sm">{c.replies ?? 0}</td>
                      <td className="py-3 pr-4 text-right text-slate-300 text-sm">{c.meetings ?? 0}</td>
                      <td className="py-3 text-right"><span className="text-blue-400 text-sm font-medium">{rate}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
