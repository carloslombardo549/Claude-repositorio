import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import CompaniesView from "@/components/CompaniesView";
import { getCompanies, getIcp, getExclusions } from "@/lib/data";

export default async function EmpresasPage() {
  const [companies, icp, exclusions] = await Promise.all([
    getCompanies(), getIcp(), getExclusions(),
  ]);

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Empresas objetivo"
          subtitle="Cuentas clasificadas A/B/C según su encaje con el perfil de cliente ideal."
        />
        <CompaniesView companies={companies} icp={icp} exclusions={exclusions} />
      </div>
    </MainLayout>
  );
}
