// src/components/dashboard/HeaderProfile.tsx
import { useAvatarSrc } from '@/hooks/useAvatarSrc';
import { useMe } from '@/hooks/useMe';

import { User as HeroUser } from "@heroui/react"; // ou caminho gerado pelo CLI

export function HeaderProfile() {
  const { user, account } = useMe();

  const avatarSrc = useAvatarSrc(); // ou useAvatarSrc(avatarVersion)
  console.log('HeaderProfile avatarSrc =', avatarSrc);


  return (
    <HeroUser
      name={`Conta NSV: ${account?.account_display ?? "—"}`}
      description={`Status: ${user?.role ?? "Cliente"}`}
      avatarProps={{
        src: avatarSrc,
        className:"bg-transparent text-left nsv-avatar-visible"
      }}
      className="bg-transparent text-left"
    />
  );
}