// src/components/nix/NixRecentTransfers.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  useTransactions,
  isNixTransaction,
  isDebitTransaction,
} from '@/hooks/useTransactions';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
} from 'lucide-react';
import type { Transaction } from '@/types/api';
import { cn } from '@/lib/utils';

export function NixRecentTransfers() {
  const { transactions, isLoading } = useTransactions();

  const nixTransfers = (transactions ?? [])
    .filter((tx) => isNixTransaction(tx.type))
    .slice(0, 5);

  return (
    <Card className="h-full border-nix/15 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Transferências Nix
          </CardTitle>

          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            tempo real
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Loading */}
        {isLoading && (
          <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
            Carregando movimentações…
          </div>
        )}

        {/* Empty */}
        {!isLoading && nixTransfers.length === 0 && (
          <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
            Nenhuma transferência Nix recente.
          </div>
        )}

        {/* List */}
        {!isLoading &&
          nixTransfers.map((tx: Transaction) => {
            const isDebit = isDebitTransaction(tx.type);
            const Icon = isDebit
              ? ArrowUpRight
              : ArrowDownLeft;

            const hasName = Boolean(tx.counterparty_name);

            const displayName =
              tx.counterparty_name ??
              tx.counterparty_account ??
              'Conta NSV';
              console.log('NixRecentTransfers displayName =', displayName);

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl border bg-background px-4 py-3 transition hover:bg-muted/40"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      isDebit
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-emerald-500/10 text-emerald-600'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">
                      {isDebit ? 'Enviado para' : 'Recebido de'}{' '}
                      <span className="font-semibold">
                        {displayName}
                      </span>
                    </span>

                    {hasName && tx.counterparty_account && (
                      <span className="text-[11px] text-muted-foreground">
                        Conta {tx.counterparty_account}
                      </span>
                    )}

                    <span className="text-[11px] text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString(
                        'pt-BR',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div
                  className={cn(
                    'font-mono text-sm font-semibold',
                    isDebit
                      ? 'text-red-500'
                      : 'text-emerald-600'
                  )}
                >
                  {isDebit ? '-' : '+'}
                  {tx.amount.toLocaleString('pt-BR')} NSV
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}