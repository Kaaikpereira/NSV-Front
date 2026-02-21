import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';

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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { useMe } from '@/hooks/useMe';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccountLookup } from '@/hooks/useAccountLookup';
import { nixTransfer } from '@/api/nixApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/* =======================
   Schema
======================= */

const nixSchema = z.object({
  toAccount: z
    .string()
    .regex(/^\d{4}-\d$/, 'Formato inválido'),
  amount: z.number().min(0.01),
  description: z.string().max(200).optional(),
});

type NixFormData = z.infer<typeof nixSchema>;

/* =======================
   Component
======================= */

export function NixForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastRecipient, setLastRecipient] = useState('');

  const { account, refreshMe } = useMe();
  const { refresh: refreshTransactions } = useTransactions();

  const form = useForm<NixFormData>({
    resolver: zodResolver(nixSchema),
    mode: 'onChange',
    defaultValues: {
      toAccount: '',
      amount: undefined,
      description: '',
    },
  });

  const toAccountValue = form.watch('toAccount');
  const amount = form.watch('amount');

  const isValidAccountFormat = /^\d{4}-\d$/.test(toAccountValue);

  const { data: recipientAccount, isLoading: isLookupLoading } =
    useAccountLookup(isValidAccountFormat ? toAccountValue : null);

  const insufficientBalance =
    account && amount ? amount > account.balance : false;

  const canSubmit =
    form.formState.isValid &&
    !!recipientAccount &&
    !insufficientBalance &&
    !isSubmitting;

  const onSubmit = async (data: NixFormData) => {
    if (!account) return;

    setIsSubmitting(true);
    try {
      await nixTransfer({
        to_account: data.toAccount,
        amount: data.amount,
        description: data.description || undefined,
      });

      await Promise.all([refreshMe(), refreshTransactions()]);

      setLastRecipient(data.toAccount);
      setShowSuccess(true);
      form.reset();

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao enviar Nix'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl border-nix/15 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Enviar Nix</CardTitle>
        <CardDescription className="text-xs">
          Transferência instantânea entre contas NSV
        </CardDescription>
      </CardHeader>

      <CardContent>
        {showSuccess ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <CheckCircle2 className="h-14 w-14 text-nix" />
            <p className="text-sm font-medium">
              Nix enviado para {lastRecipient}
            </p>
            {account && (
              <p className="text-xs text-muted-foreground">
                Novo saldo:{' '}
                <strong>
                  {account.balance.toLocaleString('pt-BR')} NSV
                </strong>
              </p>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* =======================
                 DESTINATÁRIO
              ======================= */}
              <FormField
                control={form.control}
                name="toAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Destinatário
                    </FormLabel>

                    <FormControl>
                      <div
                        className={cn(
                          'flex items-center gap-3 rounded-xl border px-4 py-3 transition',
                          recipientAccount
                            ? 'border-nix bg-nix/5'
                            : 'border-muted bg-background'
                        )}
                      >
                        <Avatar className="h-9 w-9">
                          {recipientAccount?.avatar_url && (
                            <AvatarImage
                              src={recipientAccount.avatar_url}
                            />
                          )}
                          <AvatarFallback>
                            {recipientAccount
                              ? recipientAccount.display_name
                                  .split(' ')
                                  .map((p) => p[0])
                                  .join('')
                              : 'NSV'}
                          </AvatarFallback>
                        </Avatar>

                        <Input
                          autoFocus
                          placeholder="0000-0"
                          className="border-0 p-0 font-mono text-sm focus-visible:ring-0"
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <div className="mt-2 text-xs">
                      {!toAccountValue && (
                        <span className="text-muted-foreground">
                          Digite a conta NSV do destinatário
                        </span>
                      )}

                      {isValidAccountFormat && isLookupLoading && (
                        <span className="text-muted-foreground">
                          Verificando conta…
                        </span>
                      )}

                      {recipientAccount && (
                        <span className="font-medium text-nix">
                          {recipientAccount.display_name} • Conta{' '}
                          {recipientAccount.number}
                        </span>
                      )}

                      {isValidAccountFormat &&
                        !isLookupLoading &&
                        !recipientAccount && (
                          <span className="text-destructive">
                            Conta não encontrada
                          </span>
                        )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* =======================
                 VALOR
              ======================= */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Valor
                    </FormLabel>

                    <FormControl>
                      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-4">
                        <span className="text-sm font-semibold text-muted-foreground">
                          NSV
                        </span>

                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="0,00"
                          className="border-0 bg-transparent p-0 text-right text-2xl font-semibold focus-visible:ring-0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </div>
                    </FormControl>

                    {insufficientBalance && (
                      <p className="mt-1 text-xs text-destructive">
                        Saldo insuficiente para esse valor
                      </p>
                    )}

                    {account && (
                      <div className="mt-3 flex gap-2">
                        {[50, 100, 500].map((v) => (
                          <Button
                            key={v}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              form.setValue('amount', v)
                            }
                          >
                            {v}
                          </Button>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            form.setValue(
                              'amount',
                              account.balance
                            )
                          }
                        >
                          Máx
                        </Button>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* =======================
                 DESCRIÇÃO
              ======================= */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Descrição (opcional)
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* =======================
                 CTA
              ======================= */}
              <Button
                type="submit"
                className="w-full bg-nix"
                disabled={!canSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando…
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