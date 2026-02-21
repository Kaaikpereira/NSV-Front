// src/hooks/useAccountLookup.ts
import { useState, useEffect } from 'react';
import { lookupAccount, type AccountLookupResponse } from '@/api/accountsClient';

export function useAccountLookup(accountNumber: string) {
  const [data, setData] = useState<AccountLookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accountNumber || accountNumber.length < 3) {
      setData(null);
      return;
    }

    const ctrl = new AbortController();
    setIsLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const result = await lookupAccount(accountNumber);
        if (!ctrl.signal.aborted) {
          setData(result);
        }
      } catch {
        if (!ctrl.signal.aborted) {
          setData(null);
        }
      } finally {
        if (!ctrl.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      ctrl.abort();
    };
  }, [accountNumber]);

  return { data, isLoading };
}
