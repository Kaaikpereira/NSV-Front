import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createTransaction } from '@/api/transactionsApi';
import { useMe } from '@/hooks/useMe';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';

const paymentSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Digite um valor válido' })
    .min(0.01, 'Valor mínimo é 0,01 NSV')
    .max(100000, 'Valor máximo é 100.000 NSV'),
  description: z
    .string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(200, 'Descrição muito longa'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { account, refreshMe } = useMe();
  const { refresh: refreshTransactions } = useTransactions();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    if (!account) return;

    if (data.amount > account.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTransaction({
        type: 'payment',
        amount: data.amount,
        description: data.description,
      });

      await Promise.all([refreshMe(), refreshTransactions()]);

      setShowSuccess(true);
      form.reset();
      toast.success('Pagamento realizado com sucesso!');

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao processar pagamento'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle>Novo Pagamento</CardTitle>
            <CardDescription>
              Simule um pagamento debitando do seu saldo NSV
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <CheckCircle2 className="h-16 w-16 text-credit" />
            <p className="text-lg font-medium">Pagamento realizado!</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (NSV)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Pagamento assinatura mensal"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {account && (
                <p className="text-sm text-muted-foreground">
                  Saldo disponível:{' '}
                  <span className="font-mono font-medium">
                    {account.balance.toLocaleString('pt-BR')} NSV
                  </span>
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Confirmar Pagamento'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
