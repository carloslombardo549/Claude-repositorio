import { PageHeader } from "@/components/ui/PageHeader";
import { EmpresasExplorer, type CompanyRow } from "@/components/empresas/EmpresasExplorer";
import { MOCK, signalsForCompany } from "@/lib/mock/generate";
import { TODOS_TIPOS_SENAL } from "@/lib/mock/signalTemplates";

export default function EmpresasPage() {
  const rows: CompanyRow[] = MOCK.companies.map((c) => ({
    ...c,
    tiposSenal: [...new Set(signalsForCompany(c.id).map((s) => s.tipo))],
  }));

  const sectores = [...new Set(MOCK.companies.map((c) => c.sector))].sort();
  const ciudades = [...new Set(MOCK.companies.map((c) => c.ciudad))].sort();

  return (
    <div>
      <PageHeader
        title="Empresas objetivo"
        description="Empresas B2B españolas detectadas por el radar, puntuadas según el ICP de Galt Capital."
      />
      <EmpresasExplorer companies={rows} sectores={sectores} ciudades={ciudades} tiposSenal={TODOS_TIPOS_SENAL} />
    </div>
  );
}
