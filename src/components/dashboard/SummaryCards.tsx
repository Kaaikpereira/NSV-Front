import { Receipt, CreditCard, Zap, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Transaction } from '@/types/api';
import { isNixTransaction } from '@/hooks/useTransactions';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalTransactions = transactions.length;
  const totalPayments = transactions.filter((t) => t.type === 'payment').length;
  const totalNix = transactions.filter((t) => isNixTransaction(t.type)).length;
  const totalPurchases = transactions.filter((t) => t.type === 'purchase').length;

  const cards = [
    {
      label: 'Total de Transações',
      value: totalTransactions,
      icon: Receipt,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pagamentos',
      value: totalPayments,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Operações Nix',
      value: totalNix,
      icon: Zap,
      color: 'text-nix',
      bgColor: 'bg-nix/10',
    },
    {
      label: 'Compras na Loja',
      value: totalPurchases,
      icon: ShoppingBag,
      color: 'text-store',
      bgColor: 'bg-store/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
