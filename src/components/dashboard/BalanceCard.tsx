import { Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  currency: string;
  accountDisplay: string;
  status: string;
}

export function BalanceCard({ balance, currency, accountDisplay, status }: BalanceCardProps) {
  const isActive = status === 'active';

  return (
    <Card className="relative overflow-hidden border-0 nsv-gradient text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Saldo Disponível</span>
            </div>
            <div className="mt-3">
              <span className="balance-display">
                {balance.toLocaleString('pt-BR')}
              </span>
              <span className="ml-2 text-2xl font-semibold opacity-80">{currency}</span>
            </div>
            <p className="account-number mt-3 opacity-70">
              Conta NSV: {accountDisplay}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                isActive ? 'bg-white/20' : 'bg-destructive/80'
              )}
            >
              {isActive ? 'Ativa' : status}
            </div>
            <TrendingUp className="h-8 w-8 opacity-30" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
