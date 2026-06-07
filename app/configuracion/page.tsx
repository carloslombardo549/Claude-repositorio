import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import SettingsView from "@/components/SettingsView";
import { getIcp, getExclusions } from "@/lib/data";

export default async function ConfiguracionPage() {
  const [icp, exclusions] = await Promise.all([getIcp(), getExclusions()]);

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Configuración"
          subtitle="Perfil de cliente ideal, lista de exclusión y gestión de roles."
        />
        <SettingsView icp={icp} exclusions={exclusions} />
      </div>
    </MainLayout>
  );
}
