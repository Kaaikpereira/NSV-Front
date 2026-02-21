import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWatcher } from "@/components/auth/AuthWatcher";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import StatementPage from "./pages/StatementPage";
import PaymentsPage from "./pages/PaymentsPage";
import NixPage from "./pages/NixPage";
import StorePage from "./pages/StorePage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import OnboardingDisplayNamePage from "./pages/OnboardingDisplayName";
import ConfigPage from "./pages/ConfigPage";
import AdminAuditLogsPage from "./pages/AdminAuditLogsPage";
import AdminDashboardPage from "./pages/DahboardAdminPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <AuthWatcher />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/onboarding/display-name"
            element={<OnboardingDisplayNamePage />}
          />
          <Route path="/extrato" element={<StatementPage />} />
          <Route path="/pagamentos" element={<PaymentsPage />} />
          <Route path="/nix" element={<NixPage />} />
          <Route path="/loja" element={<StorePage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;