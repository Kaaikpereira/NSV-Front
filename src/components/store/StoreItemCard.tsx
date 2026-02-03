import { useState } from 'react';
import { ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { StoreItem } from '@/types/api';
import { createTransaction } from '@/api/transactionsApi';
import { useMe } from '@/hooks/useMe';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StoreItemCardProps {
  item: StoreItem;
}

export function StoreItemCard({ item }: StoreItemCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const { account, refreshMe } = useMe();
  const { refresh: refreshTransactions } = useTransactions();

  const canAfford = account ? account.balance >= item.price : false;

  const handlePurchase = async () => {
    if (!canAfford || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createTransaction({
        type: 'purchase',
        amount: item.price,
        description: `Loja NSV: ${item.name}`,
      });

      await Promise.all([refreshMe(), refreshTransactions()]);

      setPurchased(true);
      toast.success(
        <div>
          <p className="font-medium">Compra realizada!</p>
          <p className="text-sm text-muted-foreground">
            Sandbox: nenhuma cobrança real
          </p>
        </div>
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao comprar item'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className={cn(
        'card-hover overflow-hidden',
        purchased && 'ring-2 ring-primary'
      )}
    >
      <CardContent className="p-6">
        <div className="mb-4 text-5xl">{item.icon}</div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-xl font-bold text-primary">
            {item.price.toLocaleString('pt-BR')} NSV
          </span>
        </div>
        <Button
          className={cn(
            'mt-4 w-full',
            purchased && 'bg-credit hover:bg-credit/90'
          )}
          disabled={!canAfford || isSubmitting || purchased}
          onClick={handlePurchase}
        >
          {purchased ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Comprado
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Comprando...
            </>
          ) : !canAfford ? (
            'Saldo insuficiente'
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Comprar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
