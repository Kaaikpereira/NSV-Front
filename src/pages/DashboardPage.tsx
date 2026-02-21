import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { HeaderProfile } from "@/components/dashboard/HeaderProfile";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useMe } from "@/hooks/useMe";
import { useTransactions } from "@/hooks/useTransactions";

// DashboardPage.tsx
export default function DashboardPage() {
  const {
    user,
    account,
    isLoading: isLoadingMe,
    isError: isErrorMe,
    refreshMe,
  } = useMe();
  const {
    transactions,
    isLoading: isLoadingTx,
    isError: isErrorTx,
    refresh: refreshTx,
  } = useTransactions();

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

  function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 5) return 'Boa madrugada';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}



  const displayName = user.display_name || user.email || "Cliente NSV";
  const greeting = getGreeting();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bem-vindo ao Banco NSV
          </p>

          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            {greeting}, {displayName}!
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Plataforma financeira segura com NSV.
          </p>
        </div>

        <div className="hidden md:block">
          <HeaderProfile />
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        <BalanceCard
          balance={account.balance}
          currency={account.currency}
          accountDisplay={account.account_display}
          status={account.status}
        />

        <SummaryCards transactions={transactions} />

        <div>
          <h2 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-foreground">
            Acesso rápido
          </h2>
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}