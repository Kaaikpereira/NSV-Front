import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTransactions } from '@/hooks/useTransactions';

export default function StatementPage() {
  const { transactions, isLoading, isError, refresh } = useTransactions();

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando extrato..." />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Não foi possível carregar o extrato"
          onRetry={refresh}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Extrato"
        description="Histórico completo das suas transações"
      />
      <TransactionsTable transactions={transactions} />
    </DashboardLayout>
  );
}
