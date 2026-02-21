import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Loader2, Mail, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setAuthToken } from '@/api/client'
import { toast } from 'sonner'
import { BaseUrl } from '@/utils/localhost'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${BaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erro ao criar conta')
        return
      }

      setAuthToken(data.token)
      navigate('/onboarding/display-name')
    } catch {
      toast.error('Erro ao conectar ao servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* ÁREA INSTITUCIONAL */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-primary to-[hsl(var(--sidebar-accent))]">
        <div className="max-w-md px-10 space-y-6 text-primary-foreground">
          <h2 className="text-3xl font-semibold">
            Nexon Secure Vault
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Crie sua conta para acessar um ambiente financeiro seguro,
            com tecnologia de criptografia proprietária.
          </p>
        </div>
      </div>

      {/* REGISTER */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            w-full max-w-md
            rounded-2xl
            bg-card
            border border-border
            shadow-[0_12px_35px_-15px_rgba(15,42,68,0.35)]
            p-8
            space-y-6
          "
        >
          {/* HEADER */}
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Criar conta
              </h1>
              <p className="text-xs text-muted-foreground">
                Nexon Secure Vault
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nome completo */}
            <div className="space-y-2">
              <Label className="text-foreground">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                  className="
                    pl-10 h-11
                    bg-card
                    border border-input
                    text-foreground
                    placeholder:text-[hsl(var(--muted-foreground))/0.7]
                    focus:border-[hsl(var(--accent))]
                    focus:ring-1 focus:ring-[hsl(var(--accent))/0.3]
                  "
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="
                    pl-10 h-11
                    bg-card
                    border border-input
                    text-foreground
                    placeholder:text-[hsl(var(--muted-foreground))/0.7]
                    focus:border-[hsl(var(--accent))]
                    focus:ring-1 focus:ring-[hsl(var(--accent))/0.3]
                  "
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="
                    pl-10 h-11
                    bg-card
                    border border-input
                    text-foreground
                    placeholder:text-[hsl(var(--muted-foreground))/0.7]
                    focus:border-[hsl(var(--accent))]
                    focus:ring-1 focus:ring-[hsl(var(--accent))/0.3]
                  "
                />
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="space-y-2">
              <Label className="text-foreground">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="
                    pl-10 h-11
                    bg-card
                    border border-input
                    text-foreground
                    placeholder:text-[hsl(var(--muted-foreground))/0.7]
                    focus:border-[hsl(var(--accent))]
                    focus:ring-1 focus:ring-[hsl(var(--accent))/0.3]
                  "
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full h-11
                rounded-xl
                bg-primary
                hover:bg-primary/90
                text-primary-foreground
                font-semibold
                tracking-wide
                shadow-md
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          {/* FOOTER */}
          <div className="text-center text-sm text-muted-foreground">
            Já possui conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              Acessar
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}