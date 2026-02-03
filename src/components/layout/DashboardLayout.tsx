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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuthToken } from '@/api/client';
import { useMe } from '@/hooks/useMe';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Extrato', href: '/extrato', icon: Receipt },
  { label: 'Pagamentos', href: '/pagamentos', icon: CreditCard },
  { label: 'Nix', href: '/nix', icon: Zap },
  { label: 'Loja NSV', href: '/loja', icon: ShoppingBag },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, account } = useMe();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg nsv-gradient">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">BANCO NSV</h1>
              <p className="text-xs text-sidebar-muted">Nexon Secure Vault</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="border-b border-sidebar-border px-6 py-4">
              <p className="text-sm font-medium truncate">
                {user.display_name || user.email || 'Usuário'}
              </p>
              {account && (
                <p className="account-number text-sidebar-muted mt-1">
                  Conta: {account.account_display}
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
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-sidebar-border p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
