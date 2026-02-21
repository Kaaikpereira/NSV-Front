// src/pages/PaymentsPage.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplet,
  Loader2,
  Package,
  RefreshCw,
  Smartphone,
  Wifi,
  Zap,
} from "lucide-react";
import { useMe } from "@/hooks/useMe";
import {
  useTransactions,
  getTransactionTypeLabel,
  isDebitTransaction,
} from "@/hooks/useTransactions";
import { useInvoices } from "@/hooks/useInvoices";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";

const categoryIcons = {
  telefone: <Smartphone className="h-4 w-4" />,
  internet: <Wifi className="h-4 w-4" />,
  agua: <Droplet className="h-4 w-4" />,
  energia: <Zap className="h-4 w-4" />,
  assinatura: <Package className="h-4 w-4" />,
};

const categoryColors = {
  telefone: "bg-blue-100 text-blue-700",
  internet: "bg-purple-100 text-purple-700",
  agua: "bg-cyan-100 text-cyan-700",
  energia: "bg-yellow-100 text-yellow-700",
  assinatura: "bg-pink-100 text-pink-700",
};

export default function PaymentsPage() {
  // Dados reais do usuário e conta
  const { user, account, isLoading: accountLoading, refreshMe } = useMe();

  const createTransaction = useCreateTransaction();
  // Transações reais do extrato
  const {
    transactions,
    isLoading: transLoading,
    refresh: refreshTransactions,
  } = useTransactions();

  // Faturas fake (usando saldo real)
  const { pendingInvoices, invoices, totalDue, payInvoice } = useInvoices(
    account?.balance || 0
  );

  const [payingId, setPayingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    invoiceId: string;
    amount: number;
    title: string;
  } | null>(null);

  async function handlePayInvoice(invoiceId: string) {
  setPayingId(invoiceId);

  try {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    await createTransaction.mutateAsync({
      type: 'payment',
      amount: invoice.amount,
      description: `Pagamento fatura: ${invoice.title}`,
    });

    // manter controle local das faturas fake
    await payInvoice(invoiceId);
  } catch (err) {
    console.error('Erro ao pagar fatura:', err);
  } finally {
    setPayingId(null);
    setConfirmDialog(null);
  }
}

  const loading = accountLoading || transLoading;

  return (
    <DashboardLayout>
      <PageHeader
        title="Pagamentos e Faturas"
        description="Gerencie faturas pendentes e acompanhe todas as transações da sua conta NSV."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
        {/* Coluna esquerda */}
        <div className="space-y-6">
          {/* Faturas Pendentes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Faturas Pendentes</CardTitle>
                    <CardDescription>
                      {pendingInvoices.length} fatura
                      {pendingInvoices.length !== 1 ? "s" : ""} aguardando
                      pagamento
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280]">Total devido</p>
                  <p className="text-lg font-semibold text-red-600">
                    {totalDue.toLocaleString("pt-BR")} NSV
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {pendingInvoices.length === 0 ? (
                <p className="text-xs text-[#6B7280]">
                  Nenhuma fatura pendente! Você está em dia.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className={`rounded-lg border p-3 transition ${
                        inv.status === "overdue"
                          ? "border-red-300 bg-red-50"
                          : "border-[#E5E7EB] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 rounded-full p-2 ${
                              categoryColors[inv.category]
                            }`}
                          >
                            {categoryIcons[inv.category]}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#111827]">
                              {inv.title}
                            </p>
                            <p className="text-[11px] text-[#6B7280]">
                              {inv.company}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[10px] text-[#9CA3AF]">
                                Vencimento:{" "}
                                {new Date(inv.due_date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                              {inv.status === "overdue" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-200 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                  Vencida
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#111827]">
                            {inv.amount.toLocaleString("pt-BR")} NSV
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setConfirmDialog({
                                invoiceId: inv.id,
                                amount: inv.amount,
                                title: inv.title,
                              })
                            }
                            disabled={payingId === inv.id}
                            className="mt-2 h-7 text-[11px]"
                          >
                            {payingId === inv.id ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Processando
                              </>
                            ) : (
                              "Pagar"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extrato / Histórico de Transações */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                    <CreditCard className="h-5 w-5 text-[#0F2A44]" />
                  </div>
                  <div>
                    <CardTitle>Extrato da Conta</CardTitle>
                    <CardDescription>
                      Todas as transações da sua conta NSV em tempo real.
                    </CardDescription>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => refreshTransactions()}
                  disabled={transLoading}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${transLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {transLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[#6B7280]" />
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-xs text-[#6B7280]">
                  Nenhuma transação registrada ainda.
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2.5 hover:bg-[#F9FAFB] transition"
                    >
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs font-semibold text-[#111827]">
                          {getTransactionTypeLabel(txn.type)}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">
                          {txn.description || "Sem descrição"}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF]">
                          {new Date(txn.created_at).toLocaleString("pt-BR")}
                        </p>
                        {txn.counterparty_name && (
                          <p className="text-[10px] font-medium text-[#0F2A44]">
                            {txn.counterparty_name}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-xs font-semibold ${
                            isDebitTransaction(txn.type)
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {isDebitTransaction(txn.type) ? "-" : "+"}
                          {txn.amount.toLocaleString("pt-BR")} NSV
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-600">Concluído</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita: Resumo da Conta */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                  <CreditCard className="h-5 w-5 text-[#0F2A44]" />
                </div>
                <div>
                  <CardTitle>Saldo da Conta NSV</CardTitle>
                  <CardDescription>
                    Dados em tempo real da sua conta.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {accountLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-[#6B7280]" />
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                      Saldo Disponível
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#111827]">
                      {account
                        ? account.balance.toLocaleString("pt-BR")
                        : "0,00"}{" "}
                      NSV
                    </p>
                    <div className="mt-3 space-y-1 rounded-lg bg-blue-50 p-2.5">
                      <p className="text-[10px] text-blue-700">
                        📊 Total devido em faturas:
                      </p>
                      <p className="text-sm font-semibold text-blue-900">
                        {totalDue.toLocaleString("pt-BR")} NSV
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4">
                    <p className="mb-2 text-[11px] uppercase tracking-wide text-[#6B7280]">
                      Informações da Conta
                    </p>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">
                          
Número da conta
                        </span>
                        <span className="font-mono font-semibold text-[#111827]">
                          {account?.account_display || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Moeda</span>
                        <span className="font-semibold text-[#111827]">
                          {account?.currency || "NSV"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Status da conta</span>
                        <span
                          className={`font-semibold ${
                            account?.status === "active"
                              ? "text-emerald-600"
                              : account?.status === "blocked"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {account?.status === "active"
                            ? "Ativa"
                            : account?.status === "blocked"
                            ? "Bloqueada"
                            : "Fechada"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4">
                    <p className="mb-3 text-[11px] uppercase tracking-wide text-[#6B7280]">
                      Limites e Políticas
                    </p>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex items-center justify-between rounded-md bg-[#F3F4F6] p-2.5">
                        <span className="text-[#6B7280]">Limite diário</span>
                        <span className="font-semibold text-[#111827]">
                          25.000 NSV
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-[#F3F4F6] p-2.5">
                        <span className="text-[#6B7280]">
                          Limite por operação
                        </span>
                        <span className="font-semibold text-[#111827]">
                          10.000 NSV
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-[#F3F4F6] p-2.5">
                        <span className="text-[#6B7280]">Juros de mora</span>
                        <span className="font-semibold text-[#111827]">
                          2% a.m.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4">
                    <p className="text-[10px] leading-relaxed text-[#6B7280]">
                      ℹ️ Sistema de simulação educacional. Dados reais
                      sincronizados com sua conta NSV. Nenhum valor real é
                      debitado de contas bancárias.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card de Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Faturas pagas</span>
                <span className="font-semibold text-[#111827]">
                  {invoices.filter((inv) => inv.status === "paid").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Faturas pendentes</span>
                <span className="font-semibold text-red-600">
                  {pendingInvoices.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Total de transações</span>
                <span className="font-semibold text-[#111827]">
                  {transactions.length}
                </span>
              </div>
              <div className="border-t border-[#E5E7EB] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">Gasto total</span>
                  <span className="font-semibold text-[#111827]">
                    {transactions
                      .filter((t) => isDebitTransaction(t.type))
                      .reduce((acc, t) => acc + t.amount, 0)
                      .toLocaleString("pt-BR")}{" "}
                    NSV
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmação de pagamento */}
      <AlertDialog
        open={!!confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pagamento de fatura</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a pagar a fatura:{" "}
              <span className="font-semibold text-[#111827]">
                {confirmDialog?.title}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 rounded-lg bg-blue-50 p-3">
            <p className="text-[11px] text-blue-700">Valor a ser debitado</p>
            <p className="mt-1 text-lg font-bold text-blue-900">
              {confirmDialog?.amount.toLocaleString("pt-BR")} NSV
            </p>
            <p className="mt-2 text-[10px] text-blue-600">
              Saldo após pagamento:{" "}
              {account
                ? (
                    account.balance - (confirmDialog?.amount || 0)
                  ).toLocaleString("pt-BR")
                : "0,00"}{" "}
              NSV
            </p>
          </div>

          <AlertDialogDescription>
            Após confirmar, esse valor será debitado de sua conta NSV e a
            fatura será marcada como paga.
          </AlertDialogDescription>

          <div className="flex gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog) {
                  handlePayInvoice(confirmDialog.invoiceId);
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar pagamento
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}