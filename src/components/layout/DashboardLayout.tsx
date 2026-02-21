import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Zap,
  ShoppingBag,
  LogOut,
  Shield,
  Settings,
  FileText,
  UserStar, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuthToken } from '@/api/client';
import { useMe } from '@/hooks/useMe';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const baseNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Extrato', href: '/extrato', icon: Receipt },
    { label: 'Pagamentos', href: '/pagamentos', icon: CreditCard },
    { label: 'Nix', href: '/nix', icon: Zap },
    { label: 'Loja NSV', href: '/loja', icon: ShoppingBag },
    { label: 'Configurações', href: '/config', icon: Settings },
    
  ];

interface DashboardLayoutProps {
  children: ReactNode;
}

// DashboardLayout.tsx (versão alinhada com index.css)
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, account } = useMe();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const navItems =
    user?.role === 'admin'
      ? [...baseNavItems, { label: 'Logs (admin)', href: '/admin/audit-logs', icon: FileText },
       { label: 'Dashboard Admin', href: '/admin', icon: UserStar },

      ]
      : baseNavItems


  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-[hsl(var(--sidebar-border))] px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg nsv-gradient">
              <Shield className="h-6 w-6 text-[hsl(var(--sidebar-foreground))]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">BANCO NSV</h1>
              <p className="text-xs text-[hsl(var(--sidebar-muted))]">
                Nexon Secure Vault
              </p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="border-b border-[hsl(var(--sidebar-border))] px-6 py-4">
              <p className="truncate text-sm font-medium">
                {user.display_name || user.email || 'Usuário'}
              </p>
              {account && (
                <p className="mt-1 text-xs text-[hsl(var(--sidebar-muted))]">
                  Conta:{' '}
                  <span className="font-mono">
                    {account.account_display}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'sidebar-link-active'
                      : 'text-[hsl(var(--sidebar-foreground))]/70 hover:bg-[hsl(var(--sidebar-accent))]/60 hover:text-[hsl(var(--sidebar-foreground))]'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(var(--sidebar-foreground))]/70 transition-colors hover:bg-[hsl(var(--sidebar-accent))]/60 hover:text-[hsl(var(--sidebar-foreground))]"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
