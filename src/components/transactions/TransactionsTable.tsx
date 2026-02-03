import { useState, useMemo } from 'react';
import { format, subDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CreditCard,
  Zap,
  ShoppingBag,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, TransactionType } from '@/types/api';
import {
  getTransactionTypeLabel,
  isDebitTransaction,
  isNixTransaction,
} from '@/hooks/useTransactions';
import { cn } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

type PeriodFilter = '7' | '30' | 'all';
type TypeFilter = 'all' | 'payment' | 'nix' | 'purchase' | 'transfer';

function getTransactionIcon(type: TransactionType) {
  switch (type) {
    case 'payment':
      return CreditCard;
    case 'nix':
    case 'nix_send':
    case 'nix_receive':
      return Zap;
    case 'purchase':
      return ShoppingBag;
    case 'transfer':
      return ArrowLeftRight;
    default:
      return CreditCard;
  }
}

export function TransactionsTable({
  transactions,
  isLoading,
}: TransactionsTableProps) {
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filtro de período
    if (period !== 'all') {
      const daysAgo = parseInt(period);
      const cutoffDate = subDays(new Date(), daysAgo);
      filtered = filtered.filter((t) =>
        isAfter(new Date(t.created_at), cutoffDate)
      );
    }

    // Filtro de tipo
    if (typeFilter !== 'all') {
      if (typeFilter === 'nix') {
        filtered = filtered.filter((t) => isNixTransaction(t.type));
      } else {
        filtered = filtered.filter((t) => t.type === typeFilter);
      }
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return filtered;
  }, [transactions, period, typeFilter]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Carregando transações...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Extrato de Transações</CardTitle>
        <div className="flex gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="all">Tudo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as TypeFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="payment">Pagamentos</SelectItem>
              <SelectItem value="nix">Nix</SelectItem>
              <SelectItem value="purchase">Loja</SelectItem>
              <SelectItem value="transfer">Transferências</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Nenhuma transação encontrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                const isDebit = isDebitTransaction(transaction.type);
                const isNix = isNixTransaction(transaction.type);

                return (
                  <TableRow key={transaction.id} className="animate-fade-in">
                    <TableCell className="font-mono text-sm">
                      {format(
                        new Date(transaction.created_at),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'rounded-lg p-2',
                            isNix ? 'bg-nix/10' : 'bg-muted'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-4 w-4',
                              isNix ? 'text-nix' : 'text-muted-foreground'
                            )}
                          />
                        </div>
                        <span className="font-medium">
                          {getTransactionTypeLabel(transaction.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {transaction.description || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isDebit ? (
                          <ArrowUpRight className="h-4 w-4 text-debit" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-credit" />
                        )}
                        <span
                          className={cn(
                            'font-mono font-medium',
                            isDebit ? 'text-debit' : 'text-credit'
                          )}
                        >
                          {isDebit ? '-' : '+'}
                          {transaction.amount.toLocaleString('pt-BR')} NSV
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
