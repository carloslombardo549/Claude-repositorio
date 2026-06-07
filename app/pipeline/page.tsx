import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import { getDeals } from "@/lib/data";
import { dealStageLabel } from "@/lib/labels";
import type { DealStage } from "@/lib/types";

const STAGES: DealStage[] = ["lead", "qualified", "meeting", "proposal", "won", "lost"];
const stageAccent: Record<DealStage, string> = {
  lead: "border-t-slate-500",
  qualified: "border-t-blue-500",
  meeting: "border-t-indigo-500",
  proposal: "border-t-amber-500",
  won: "border-t-emerald-500",
  lost: "border-t-rose-500",
};

function euros(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function PipelinePage() {
  const deals = await getDeals();
  const open = deals.filter((d) => d.stage !== "lost");
  const totalValue = open.reduce((s, d) => s + d.value, 0);
  const won = deals.filter((d) => d.stage === "won").reduce((s, d) => s + d.value, 0);

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Pipeline comercial"
          subtitle={`${open.length} oportunidades abiertas · ${euros(totalValue)} en pipeline · ${euros(won)} ganado`}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const value = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage} className={`bg-[#0d1428] border border-slate-800 border-t-2 ${stageAccent[stage]} rounded-xl p-3 min-h-[200px]`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-white text-sm font-semibold">{dealStageLabel[stage]}</span>
                  <span className="text-slate-500 text-xs">{stageDeals.length}</span>
                </div>
                <div className="text-slate-500 text-xs mb-3 px-1">{euros(value)}</div>
                <div className="space-y-2">
                  {stageDeals.map((d) => (
                    <div key={d.id} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 hover:border-slate-600 transition-colors cursor-default">
                      <div className="text-white text-xs font-medium leading-snug">{d.title}</div>
                      <div className="text-blue-400 text-xs font-semibold mt-1">{euros(d.value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
