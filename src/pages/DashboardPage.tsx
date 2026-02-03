import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useMe } from '@/hooks/useMe';
import { useTransactions } from '@/hooks/useTransactions';

export default function DashboardPage() {
  const { user, account, isLoading: isLoadingMe, isError: isErrorMe, refreshMe } = useMe();
  const { transactions, isLoading: isLoadingTx, isError: isErrorTx, refresh: refreshTx } = useTransactions();

  const isLoading = isLoadingMe || isLoadingTx;
  const isError = isErrorMe || isErrorTx;

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando seu painel..." />
      </DashboardLayout>
    );
  }

  if (isError || !account || !user) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Não foi possível carregar os dados da sua conta"
          onRetry={() => {
            refreshMe();
            refreshTx();
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`Olá, ${user.display_name || user.email || 'Desenvolvedor'}!`}
        description="Bem-vindo ao seu painel Banco NSV"
      />

      <div className="space-y-8">
        {/* Balance Card */}
        <BalanceCard
          balance={account.balance}
          currency={account.currency}
          accountDisplay={account.account_display}
          status={account.status}
        />

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Acesso Rápido</h2>
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
