import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NixForm } from '@/components/forms/NixForm';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NixPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Nix"
        description="Envie dinheiro instantaneamente para outras contas NSV"
      />
      <NixForm />
    </DashboardLayout>
  );
}
