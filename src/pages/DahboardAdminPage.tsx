// src/components/admin/DashboardAdminPage.tsx
import { useEffect, useState } from "react";
import {
  fetchAdminAccounts,
  updateAdminAccountStatus,
  deleteAdminAccount,
  type AdminAccount,
} from "@/api/adminAccountsClient";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";

export default function DashboardAdminPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAccounts() {
    setLoading(true);
    const data = await fetchAdminAccounts();
    setAccounts(data);
    setLoading(false);
  }

  async function handleStatusChange(
    accountId: string,
    status: AdminAccount["status"]
  ) {
    await updateAdminAccountStatus(accountId, status);
    await loadAccounts();
  }

  async function handleDelete(accountId: string) {
    const ok = confirm("Tem certeza que deseja deletar esta conta?");
    if (!ok) return;

    await deleteAdminAccount(accountId);
    await loadAccounts();
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
         <LoadingState message="Carregando registros de auditoria…" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <PageHeader
          title="Dashboard Admin"
          description="Painel administrativo do NSV. Gerencie contas, logs e configurações avançadas."
        />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Admin · Contas
          </h2>
          <p className="text-xs text-muted-foreground">
            Gerencie status e ações administrativas das contas NSV.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Conta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Moeda
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-card">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{acc.account_display}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {acc.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Criada em{" "}
                        {new Date(acc.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      {acc.currency}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      value={acc.status}
                      onChange={(e) =>
                        handleStatusChange(
                          acc.id,
                          e.target.value as AdminAccount["status"]
                        )
                      }
                    >
                      <option value="active">Ativa</option>
                      <option value="blocked">Bloqueada</option>
                      <option value="suspended">Suspensa</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      className="inline-flex items-center rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(acc.id)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {accounts.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhuma conta encontrada.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}