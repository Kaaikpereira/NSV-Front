// src/pages/AdminAuditLogsPage.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getAuditLogs } from "@/api/admin";
import { useMe } from "@/hooks/useMe";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

import { Shield } from "lucide-react";
import { AuditLog } from "@/types/audit-log";
import { AuditEventFeed } from "@/components/admin/AuditEventFeed";

export default function AdminAuditLogsPage() {
  const { user } = useMe();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // bloqueio defensivo no front
  if (user && user.role !== "admin") {
    return (
      <DashboardLayout>
        <ErrorState
          message="Acesso restrito. Apenas administradores podem visualizar os logs de auditoria."
          onRetry={() => {}}
        />
      </DashboardLayout>
    );
  }

  const loadLogs = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getAuditLogs();
      // aceita tanto { logs: [...] } quanto [...] direto
      const safeLogs = Array.isArray((data as any)?.logs)
        ? (data as any).logs
        : Array.isArray(data)
        ? (data as any)
        : [];
      setLogs(safeLogs as AuditLog[]);
    } catch (err) {
      console.error("Admin audit logs error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando registros de auditoria…" />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Não foi possível carregar os logs de auditoria."
          onRetry={loadLogs}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header institucional */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Shield className="h-4 w-4" />
          Segurança & Compliance
        </div>

        <h1 className="text-2xl font-semibold text-foreground">
          Logs de Auditoria
        </h1>

        <p className="max-w-3xl text-sm text-muted-foreground">
          Registro imutável das ações críticas executadas no sistema NSV.
          Utilizado para rastreabilidade, análise forense e conformidade.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atividade Administrativa</CardTitle>
          <CardDescription>
            Exibindo os últimos {logs?.length ?? 0} eventos registrados no
            sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {logs && logs.length > 0 ? (
            <AuditEventFeed logs={logs} />
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Nenhum evento de auditoria registrado até o momento.
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}