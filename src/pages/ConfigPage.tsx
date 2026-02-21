// src/pages/ConfigPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useMe } from "@/hooks/useMe";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  XCircle,
  MonitorSmartphone,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { uploadAvatar, fetchAvatarBlob } from "@/api/avatarClient";
import { clearAuthToken } from "@/api/client";
import { deleteMyAccount } from "@/api/accountsClient";
import { useDevices } from "@/hooks/useDevices";

/* ===== Modal de deletar conta ===== */
interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: DeleteAccountDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[hsl(var(--card))] p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
              Deletar conta
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Esta ação é permanente. Sua conta no Banco NSV será encerrada e
              você perderá acesso imediato ao aplicativo.
            </p>

            <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              Alguns dados podem continuar armazenados por exigências
              regulatórias e auditoria interna.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deletando..." : "Sim, deletar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Modal de erro ===== */
interface ErrorDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

function ErrorDialog({
  open,
  title = "Ocorreu um erro",
  message,
  onClose,
}: ErrorDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[hsl(var(--card))] p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Página principal ===== */
export default function ConfigPage() {
  const { user, account, isLoading, isError, refreshMe } = useMe();

  const [uploading, setUploading] = useState(false);
  const [errorUpload, setErrorUpload] = useState<string | null>(null);

  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const [avatarSrc, setAvatarSrc] = useState<string>(
    "/img/avatar-placeholder.png"
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErrorOpen, setDeleteErrorOpen] = useState(false);

  const navigate = useNavigate();

  const {
    devices,
    loading: loadingDevices,
    error: devicesError,
    refresh: refreshDevices,
    revoke,
  } = useDevices();

  // ===== Avatar loader =====
  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadAvatar() {
      if (!user) {
        setAvatarSrc("/img/avatar-placeholder.png");
        return;
      }

      try {
        const blob = await fetchAvatarBlob(avatarVersion);
        if (!blob) {
          setAvatarSrc("/img/avatar-placeholder.png");
          return;
        }

        objectUrl = URL.createObjectURL(blob);
        setAvatarSrc(objectUrl);
      } catch (err) {
        console.error("[ConfigPage] loadAvatar error", err);
        setAvatarSrc("/img/avatar-placeholder.png");
      }
    }

    loadAvatar();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user, avatarVersion]);

  // ===== Estados globais =====
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando configurações da conta..." />
      </DashboardLayout>
    );
  }

  if (isError || !user) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Não foi possível carregar as informações da sua conta."
          onRetry={refreshMe}
        />
      </DashboardLayout>
    );
  }

  const displayName = user.display_name || "Cliente NSV";

  // ===== Upload avatar =====
  async function handleAvatarChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorUpload("O arquivo selecionado não é uma imagem válida.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorUpload("A imagem deve ter no máximo 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setErrorUpload(null);
      setUploading(true);

      await uploadAvatar(formData);
      await refreshMe();
      setAvatarVersion(Date.now());
    } catch (err) {
      console.error("[ConfigPage] uploadAvatar error", err);
      setErrorUpload("Não foi possível atualizar sua foto de perfil.");
    } finally {
      setUploading(false);
    }
  }

  // ===== Deletar conta (confirmação do modal) =====
  async function handleConfirmDeleteAccount() {
    try {
      setDeleting(true);
      await deleteMyAccount();
      clearAuthToken();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("[ConfigPage] delete account error", err);
      setDeleteErrorOpen(true);
    } finally {
      setDeleting(false);
    }
  }

  // ===== Render =====
  return (
    <DashboardLayout>
      {/* Cabeçalho */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
          Configurações
        </p>
        <h1 className="text-2xl font-semibold text-[#0B1220]">
          Preferências da conta
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Gerencie seu perfil e as camadas de segurança do Banco NSV.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* ===== Perfil ===== */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                <User className="h-5 w-5 text-[#0F2A44]" />
              </div>
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Informações associadas à sua conta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Foto de perfil
              </p>

              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-12 w-12">
                  <img
                    src={avatarSrc}
                    alt="Foto de perfil"
                    className={`h-12 w-12 rounded-full object-cover transition-opacity ${
                      uploading ? "opacity-50" : "opacity-100"
                    }`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/img/avatar-placeholder.png";
                    }}
                  />

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>

                <label className="text-xs font-medium text-[#0B1220]">
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-medium text-white ${
                      uploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#0F172A] cursor-pointer"
                    }`}
                  >
                    {uploading ? "Atualizando..." : "Alterar foto"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </label>
              </div>

              {errorUpload && (
                <p className="mt-1 text-xs text-red-500">
                  {errorUpload}
                </p>
              )}

              <p className="mt-1 text-xs text-[#6B7280]">
                Imagem quadrada, até 5MB. Armazenamento protegido pelo
                protocolo SNA-456.
              </p>
            </div>

            {/* Nome */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Nome
              </p>
              <p className="mt-1 text-sm font-medium text-[#0B1220]">
                {displayName}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Email
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-[#0B1220]">
                <Mail className="h-4 w-4 text-[#6B7280]" />
                {user.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== Segurança ===== */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                <Shield className="h-5 w-5 text-[#0F2A44]" />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Status geral da proteção da conta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Status
              </p>
              <p className="mt-1 text-sm font-medium text-green-600">
                Conta protegida
              </p>
            </div>

            <p className="text-xs text-[#6B7280]">
              Acesso monitorado e protegido contra atividades suspeitas.
            </p>
          </CardContent>
        </Card>

        {/* ===== Dispositivos Conectados ===== */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                  <MonitorSmartphone className="h-5 w-5 text-[#0F2A44]" />
                </div>
                <div>
                  <CardTitle>Dispositivos conectados</CardTitle>
                  <CardDescription>
                    Sessões ativas vinculadas à sua conta.
                  </CardDescription>
                </div>
              </div>
              <button
                type="button"
                onClick={refreshDevices}
                className="inline-flex items-center gap-1 rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#4B5563] hover:bg-[#F3F4F6]"
              >
                <RefreshCw className="h-3 w-3" />
                Atualizar
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {loadingDevices ? (
              <p className="text-xs text-[#6B7280]">
                Carregando dispositivos...
              </p>
            ) : devicesError ? (
              <p className="text-xs text-red-600">{devicesError}</p>
            ) : devices.length === 0 ? (
              <p className="text-xs text-[#6B7280]">
                Nenhum dispositivo adicional conectado à sua conta no momento.
              </p>
            ) : (
              <div className="space-y-3">
                {devices.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4 transition hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0F2A44]/10">
                        <Smartphone className="h-4 w-4 text-[#0F2A44]" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-[#0B1220]">
                            {d.nice_name}
                          </p>
                          {d.is_current && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                              Sessão atual
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          IP {d.ip || "desconhecido"} • Última atividade:{" "}
                          {new Date(d.last_seen_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {!d.is_current && (
                      <button
                        type="button"
                        onClick={() => revoke(d.id)}
                        className="rounded-md border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                      >
                        Encerrar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-[#6B7280]">
              Caso identifique um acesso desconhecido, encerre a sessão e
              altere sua senha imediatamente.
            </p>
          </CardContent>
        </Card>

        {/* ===== Proteções Avançadas / SNA ===== */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                <Lock className="h-5 w-5 text-[#0F2A44]" />
              </div>
              <div>
                <CardTitle>Proteções avançadas</CardTitle>
                <CardDescription>
                  Camadas técnicas ativas na infraestrutura NSV.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            {/* SNA */}
            <div className="rounded-lg border border-[#E5E7EB] p-4">
              <p className="text-sm font-medium text-[#0B1220]">
                Protocolo SNA-456
              </p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Sistema proprietário responsável pela proteção e
                criptografia de dados sensíveis.
              </p>
            </div>

            {/* Arquivos */}
            <div className="rounded-lg border border-[#E5E7EB] p-4">
              <p className="text-sm font-medium text-[#0B1220]">
                Criptografia de arquivos
              </p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Imagens, comprovantes e documentos são protegidos
                automaticamente.
              </p>
            </div>

            {/* Monitoramento */}
            <div className="rounded-lg border border-[#E5E7EB] p-4">
              <p className="text-sm font-medium text-[#0B1220]">
                Monitoramento contínuo
              </p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Atividades são analisadas em tempo real para garantir
                integridade e prevenção de fraudes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ===== Encerramento da conta ===== */}
        <Card className="md:col-span-2 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Eye className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-700">
                  Encerramento da conta
                </CardTitle>
                <CardDescription>
                  Operação permanente. Todos os dados operacionais serão
                  desativados.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-red-700 md:max-w-xl">
              Ao deletar sua conta, você perderá acesso ao Banco NSV e às
              suas credenciais. Alguns dados podem ser mantidos para fins
              regulatórios e de conformidade.
            </p>

            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="self-start rounded-md border border-red-500 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
              Deletar conta
            </button>
          </CardContent>
        </Card>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        onConfirm={async () => {
          await handleConfirmDeleteAccount();
          setDeleteOpen(false);
        }}
        loading={deleting}
      />

      <ErrorDialog
        open={deleteErrorOpen}
        onClose={() => setDeleteErrorOpen(false)}
        title="Não foi possível deletar sua conta"
        message="Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte do Banco NSV."
      />
    </DashboardLayout>
  );
}
