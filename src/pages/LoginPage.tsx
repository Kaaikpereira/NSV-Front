import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setAuthToken } from '@/api/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error('Digite seu token de acesso');
      return;
    }

    setIsLoading(true);
    
    // Simula validação do token
    try {
      setAuthToken(token.trim());
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch {
      toast.error('Token inválido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl nsv-gradient">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Banco NSV</CardTitle>
          <CardDescription>
            Nexon Secure Vault - Sandbox Bancário para Devs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token">Token de Acesso (Supabase)</Label>
              <Input
                id="token"
                type="password"
                placeholder="Cole seu access_token aqui"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use o access_token gerado pelo Supabase Auth
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Ambiente de desenvolvimento:</strong> Este é um sandbox bancário
              para testes. Dados protegidos pelo protocolo SNA-456.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
