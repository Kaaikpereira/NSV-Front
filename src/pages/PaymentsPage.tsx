import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { PageHeader } from '@/components/ui/PageHeader';

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Pagamentos"
        description="Simule pagamentos e acompanhe seu saldo"
      />
      <PaymentForm />
    </DashboardLayout>
  );
}
