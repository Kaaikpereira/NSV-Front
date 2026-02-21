// NixPage.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NixForm } from '@/components/forms/NixForm';
import { NixRecentTransfers } from '@/components/nix/NixRecentTransfers';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NixPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <PageHeader
          title="Nix"
          description="Envie dinheiro instantaneamente para outras contas NSV."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <NixForm />
        <NixRecentTransfers />
      </div>
    </DashboardLayout>
  );
}
