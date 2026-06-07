import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import { StatusBadge } from "@/components/badges";
import { Plus, Mail, MessageSquare, CalendarCheck } from "lucide-react";
import { getCampaigns } from "@/lib/data";
import { campaignStatusLabel } from "@/lib/labels";

export default async function CampanasPage() {
  const campaigns = await getCampaigns();

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Campañas"
          subtitle="Secuencias de captación por segmento. El envío real está deshabilitado en esta fase."
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:opacity-90">
              <Plus className="w-4 h-4" /> Nueva campaña
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map((c) => {
            const targets = c.targets ?? 0;
            const replies = c.replies ?? 0;
            const meetings = c.meetings ?? 0;
            const rate = targets ? Math.round((replies / targets) * 1000) / 10 : 0;
            const progress = Math.min(100, Math.round((replies / Math.max(1, targets)) * 100) + 30);
            return (
              <div key={c.id} className="bg-[#0d1428] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold">{c.name}</h3>
                  <StatusBadge status={c.status} label={campaignStatusLabel[c.status]} />
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{c.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Metric icon={Mail} label="Contactos" value={targets} color="text-blue-400" />
                  <Metric icon={MessageSquare} label="Respuestas" value={replies} color="text-emerald-400" />
                  <Metric icon={CalendarCheck} label="Reuniones" value={meetings} color="text-purple-400" />
                </div>

                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Progreso</span>
                  <span className="text-blue-400 font-medium">{rate}% respuesta</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{c.start_date} → {c.end_date}</span>
                  <span className="capitalize">{c.channel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

function Metric({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-800/30 rounded-lg p-2.5 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <div className="text-white text-sm font-semibold">{value}</div>
      <div className="text-slate-500 text-[10px]">{label}</div>
    </div>
  );
}
