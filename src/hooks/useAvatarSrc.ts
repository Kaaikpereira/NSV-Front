// src/hooks/useAvatarSrc.ts
import { useEffect, useState } from 'react';
import { fetchAvatarBlob } from '@/api/avatarClient';
import { useMe } from '@/hooks/useMe';

export function useAvatarSrc(version?: number) {
  const { user } = useMe();
  const [avatarSrc, setAvatarSrc] = useState('/img/avatar-placeholder.png');

  useEffect(() => {
    if (!user) {
      setAvatarSrc('/img/avatar-placeholder.png');
      return;
    }

    let currentUrl: string | null = null;

    (async () => {
      try {
        const blob = await fetchAvatarBlob(version);
        if (!blob) {
          setAvatarSrc('/img/avatar-placeholder.png');
          return;
        }
        const url = URL.createObjectURL(blob);
        currentUrl = url;
        setAvatarSrc(url);
      } catch (e) {
        console.error('[useAvatarSrc] erro ao carregar avatar', e);
        setAvatarSrc('/img/avatar-placeholder.png');
      }
    })();

    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [user, version]);

  return avatarSrc;
}