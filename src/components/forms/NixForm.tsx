import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Loader2, CheckCircle2, Info } from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { transferNix } from '@/api/nixApi';
import { useMe } from '@/hooks/useMe';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';

const nixSchema = z.object({
  toAccount: z
    .string()
    .min(3, 'Conta inválida')
    .regex(/^\d{4}-\d$/, 'Formato: 0000-0 (ex: 4155-1)'),
  amount: z
    .number({ invalid_type_error: 'Digite um valor válido' })
    .min(0.01, 'Valor mínimo é 0,01 NSV')
    .max(100000, 'Valor máximo é 100.000 NSV'),
  description: z.string().max(200, 'Descrição muito longa').optional(),
});

type NixFormData = z.infer<typeof nixSchema>;

export function NixForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastRecipient, setLastRecipient] = useState('');
  const { account, refreshMe } = useMe();
  const { refresh: refreshTransactions } = useTransactions();

  const form = useForm<NixFormData>({
    resolver: zodResolver(nixSchema),
    defaultValues: {
      toAccount: '',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = async (data: NixFormData) => {
    if (!account) return;

    if (data.amount > account.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    if (data.toAccount === account.account_display) {
      toast.error('Você não pode enviar Nix para sua própria conta');
      return;
    }

    setIsSubmitting(true);
    try {
      await transferNix({
        to_account: data.toAccount,
        amount: data.amount,
        description: data.description || undefined,
      });

      await Promise.all([refreshMe(), refreshTransactions()]);

      setLastRecipient(data.toAccount);
      setShowSuccess(true);
      form.reset();
      toast.success(`Nix enviado para ${data.toAccount}!`);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar Nix'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-xl nix-gradient p-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle>Enviar Nix</CardTitle>
            <CardDescription>
              Transferência instantânea para outro usuário NSV
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {account && (
          <Alert className="mb-6 border-nix/30 bg-nix/5">
            <Info className="h-4 w-4 text-nix" />
            <AlertDescription className="text-sm">
              Sua conta NSV:{' '}
              <span className="account-number font-semibold">
                {account.account_display}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <CheckCircle2 className="h-16 w-16 text-nix" />
            <p className="text-lg font-medium">Nix enviado para {lastRecipient}!</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="toAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta NSV de destino</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0000-0"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>
                      Descrição{' '}
                      <span className="text-muted-foreground">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Pagamento do almoço"
                        rows={2}
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
                className="w-full bg-nix hover:bg-nix/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Enviar Nix
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
