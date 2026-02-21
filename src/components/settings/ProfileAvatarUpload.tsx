import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useMe } from '@/hooks/useMe';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, User, Mail } from 'lucide-react';
import { uploadAvatar } from '@/api/avatarClient';
import { getAuthToken } from '@/api/client';
import { BaseUrl } from '@/utils/localhost';

const AVATAR_URL = `${BaseUrl}/me/avatar`;

export default function ConfigPage() {
  const { user, account, isLoading, isError, refreshMe } = useMe();
  const [uploading, setUploading] = useState(false);
  const [errorUpload, setErrorUpload] = useState<string | null>(null);

  // versão local para forçar recarregar do servidor
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  // URL efetiva que o <img> vai usar (blob ou placeholder)
  const [avatarSrc, setAvatarSrc] = useState<string>('/img/avatar-placeholder.png');

  // carrega o avatar do servidor com Authorization
  useEffect(() => {
    async function loadAvatar() {
      if (!user) {
        setAvatarSrc('/img/avatar-placeholder.png');
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setAvatarSrc('/img/avatar-placeholder.png');
        return;
      }

      try {
        const res = await fetch(`${AVATAR_URL}?v=${avatarVersion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setAvatarSrc('/img/avatar-placeholder.png');
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAvatarSrc(url);
      } catch (e) {
        console.error('[ConfigPage] loadAvatar error', e);
        setAvatarSrc('/img/avatar-placeholder.png');
      }
    }

    loadAvatar();
  }, [user, avatarVersion]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando configurações..." />
      </DashboardLayout>
    );
  }

  if (isError || !user) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Não foi possível carregar os dados do seu perfil"
          onRetry={refreshMe}
        />
      </DashboardLayout>
    );
  }

  const displayName = user.display_name || 'Cliente NSV';

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setErrorUpload(null);
      setUploading(true);

      await uploadAvatar(formData);
      await refreshMe();

      // força o useEffect recarregar o avatar do backend
      setAvatarVersion(Date.now());
    } catch (err) {
      console.error(err);
      setErrorUpload('Não foi possível atualizar sua foto de perfil.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <DashboardLayout>
      {/* Header da página */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
          Configurações
        </p>
        <h1 className="text-2xl font-semibold text-[#0B1220]">
          Preferências da conta
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Gerencie suas informações de perfil e segurança do Banco NSV.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* Card Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                <User className="h-5 w-5 text-[#0F2A44]" />
              </div>
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Dados básicos usados no seu painel e nos comprovantes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Foto de perfil */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Foto de perfil
              </p>

              <div className="mt-2 flex items-center gap-4">
                <img
                  src={avatarSrc}
                  alt="Foto de perfil"
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    console.error(
                      '[ConfigPage] img onError src =',
                      (e.currentTarget as HTMLImageElement).src
                    );
                    (e.currentTarget as HTMLImageElement).src =
                      '/img/avatar-placeholder.png';
                  }}
                />

                <label className="text-xs font-medium text-[#0B1220]">
                  <span className="cursor-pointer rounded-md bg-[#0F172A] px-3 py-1 text-xs font-medium text-white">
                    {uploading ? 'Enviando...' : 'Trocar foto'}
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
                Use uma imagem quadrada, até 5MB. O arquivo é protegido pela SNA-456 no servidor.
              </p>
            </div>

            <div className="h-px bg-[#E5E7EB]" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Nome de exibição
              </p>
              <p className="mt-1 text-sm font-medium text-[#0B1220]">
                {displayName}
              </p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Definido na etapa inicial após criar sua conta. Em breve você poderá alterar por aqui.
              </p>
            </div>

            <div className="h-px bg-[#E5E7EB]" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                E-mail
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#6B7280]" />
                <p className="text-sm text-[#0B1220]">
                  {user.email || '—'}
                </p>
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">
                Atualização de e-mail é gerenciada pelo Supabase Auth.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card Segurança */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F2A44]/10">
                <Shield className="h-5 w-5 text-[#0F2A44]" />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Visão geral da proteção da sua conta NSV.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Sessão atual
              </p>
              <p className="mt-1 text-[#0B1220]">
                Autenticado via Supabase, usando token de acesso temporário.
              </p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Se ficar muito tempo inativo, pode ser necessário fazer login novamente.
              </p>
            </div>

            <div className="h-px bg-[#E5E7EB]" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Dados bancários NSV
              </p>
              <p className="mt-1 text-[#0B1220]">
                Seus saldos, conta NSV e identificadores sensíveis são protegidos pela SNA-456.
              </p>
              {account && (
                <p className="mt-1 text-xs text-[#6B7280]">
                  Conta ativa:&nbsp;
                  <span className="font-mono font-medium">
                    {account.account_display}
                  </span>
                </p>
              )}
            </div>

            <div className="h-px bg-[#E5E7EB]" />

            <p className="text-xs text-[#6B7280]">
              Em versões futuras, você poderá gerenciar dispositivos, sessões e chaves adicionais aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
