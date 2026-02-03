import { Link } from 'react-router-dom';
import { Receipt, CreditCard, Zap, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const actions = [
  {
    label: 'Ver Extrato',
    description: 'Confira suas transações',
    href: '/extrato',
    icon: Receipt,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Fazer Pagamento',
    description: 'Pague contas e serviços',
    href: '/pagamentos',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    label: 'Enviar via Nix',
    description: 'Transferência instantânea',
    href: '/nix',
    icon: Zap,
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    label: 'Loja NSV',
    description: 'Itens exclusivos',
    href: '/loja',
    icon: ShoppingBag,
    gradient: 'from-amber-500 to-amber-600',
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.href} to={action.href}>
            <Card className="group h-full cursor-pointer border-0 card-hover">
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${action.gradient} p-3`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{action.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {action.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Acessar
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
