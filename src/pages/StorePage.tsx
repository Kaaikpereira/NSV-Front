import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StoreItemCard } from '@/components/store/StoreItemCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { storeItems } from '@/data/storeItems';
import { useMe } from '@/hooks/useMe';

export default function StorePage() {
  const { account } = useMe();

  return (
    <DashboardLayout>
      <PageHeader
        title="Loja NSV"
        description="Itens cosméticos exclusivos para sua conta"
      />

      <Alert className="mb-6 border-store/30 bg-store/5">
        <Info className="h-4 w-4 text-store" />
        <AlertDescription>
          Esta é uma loja sandbox. Nenhuma cobrança real será feita.{' '}
          {account && (
            <span className="font-medium">
              Seu saldo: {account.balance.toLocaleString('pt-BR')} NSV
            </span>
          )}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {storeItems.map((item) => (
          <StoreItemCard key={item.id} item={item} />
        ))}
      </div>
    </DashboardLayout>
  );
}
