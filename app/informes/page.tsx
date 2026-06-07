import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import WeeklyChart from "@/components/WeeklyChart";
import { Download, TrendingUp } from "lucide-react";
import { getDashboardStats, getWeeklyTrend, getOrganization, getMeetings } from "@/lib/data";

export default async function InformesPage() {
  const [stats, trend, org, meetings] = await Promise.all([
    getDashboardStats(), Promise.resolve(getWeeklyTrend()), getOrganization(), getMeetings(),
  ]);

  const rows = [
    { label: "Empresas objetivo investigadas", value: stats.companies },
    { label: "Cuentas de grado A", value: stats.gradeA },
    { label: "Contactos identificados", value: stats.contacts },
    { label: "Respuestas recibidas", value: stats.replies },
    { label: "Respuestas positivas", value: stats.positiveReplies },
    { label: "Reuniones agendadas", value: meetings.filter((m) => m.status === "scheduled").length },
    { label: "Tasa de respuesta", value: `${stats.replyRate}%` },
    { label: "Tasa de conversión a positiva", value: `${stats.conversionRate}%` },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Informes semanales"
          subtitle={`${org.name} — semana del 1 al 7 de junio de 2026`}
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 hover:bg-slate-700">
              <Download className="w-4 h-4" /> Exportar PDF
            </button>
          }
        />

        <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
            <TrendingUp className="w-4 h-4" /> Resumen ejecutivo
          </div>
          <p className="text-slate-200 leading-relaxed">
            Esta semana se investigaron y clasificaron {stats.companies} empresas objetivo, de las cuales{" "}
            <strong className="text-white">{stats.gradeA} son cuentas de grado A</strong>. Se recibieron{" "}
            {stats.replies} respuestas ({stats.replyRate}% de tasa de respuesta) y{" "}
            <strong className="text-white">{stats.positiveReplies} fueron positivas</strong>, con{" "}
            {meetings.filter((m) => m.status === "scheduled").length} reuniones agendadas para los próximos días.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Métricas de la semana</h2>
            <div className="divide-y divide-slate-800">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2.5">
                  <span className="text-slate-400 text-sm">{r.label}</span>
                  <span className="text-white text-sm font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Evolución (8 semanas)</h2>
            <WeeklyChart data={trend} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
