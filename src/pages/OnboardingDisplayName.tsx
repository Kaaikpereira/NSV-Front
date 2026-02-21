import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { updateDisplayName } from '@/api/user'
import { ApiError } from '@/api/client' // <-- faltava isso

export default function OnboardingDisplayNamePage() {
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim() || displayName.trim().length < 3) {
      toast.error('Digite um nome com pelo menos 3 caracteres')
      return
    }

    setIsLoading(true)
    try {
      const data = await updateDisplayName(displayName.trim())
      toast.success(`Prazer, ${data.user.display_name}!`)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao conectar ao servidor')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="
          w-full max-w-md
          rounded-2xl
          bg-white
          border border-[#D9E1EC]
          shadow-[0_12px_35px_-15px_rgba(15,42,68,0.35)]
          p-8
          space-y-6
        "
      >
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Bem-vindo ao banco NSV
          </p>
          <h1 className="text-xl font-semibold text-[#0B1220]">
            Como você gostaria de ser chamado?
          </h1>
          <p className="text-sm text-[#6B7280]">
            Esse será o nome exibido no seu painel e em futuros comprovantes.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Ex: Kaik Novais"
              disabled={isLoading}
              className="
                h-11
                bg-white
                border border-[#D9E1EC]
                text-[#0B1220]
                placeholder:text-[#9CA3AF]
                focus:border-[#1E6F9F]
                focus:ring-1 focus:ring-[#1E6F9F]/30
              "
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="
              w-full h-11
              rounded-xl
              bg-[#0F2A44]
              hover:bg-[#12385C]
              text-white
              font-semibold
              tracking-wide
              shadow-md
            "
          >
            {isLoading ? 'Salvando...' : 'Continuar para o painel'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}