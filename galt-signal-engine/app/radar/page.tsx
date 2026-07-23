import { PageHeader } from "@/components/ui/PageHeader";
import { RadarRunner } from "@/components/radar/RadarRunner";
import { SignalFeed, type FeedItem } from "@/components/radar/SignalFeed";
import { MOCK } from "@/lib/mock/generate";

export default function RadarPage() {
  const items: FeedItem[] = MOCK.signals.map((signal) => {
    const empresa = MOCK.companies.find((c) => c.id === signal.companyId);
    return {
      signal,
      empresaNombre: empresa?.nombre ?? "Empresa desconocida",
      empresaId: signal.companyId,
      sector: empresa?.sector ?? "",
    };
  });

  const hallazgos = [...items]
    .sort((a, b) => (a.signal.fechaDeteccion < b.signal.fechaDeteccion ? 1 : -1))
    .slice(0, 4)
    .map((i) => ({ signal: i.signal, empresaNombre: i.empresaNombre }));

  return (
    <div>
      <PageHeader
        title="Radar de señales"
        description="Ejecuta el radar para simular una pasada de búsqueda y análisis sobre fuentes públicas, y revisa el histórico de señales detectadas."
      />
      <RadarRunner hallazgos={hallazgos} empresasAnalizadas={MOCK.companies.filter((c) => !c.excluida).length} />
      <SignalFeed items={items} now={MOCK.now} />
    </div>
  );
}
