
import { AuditLog } from '@/types/audit-log'
import {
  PlusCircle,
  ArrowLeftRight,
  LogIn,
  User,
  Pencil,
} from 'lucide-react'

export const auditActionMap = {
  CREATE_ACCOUNT: {
    label: 'Conta criada',
    severity: 'info',
    icon: PlusCircle,
    describe: (log: AuditLog) =>
      `Conta ${log.metadata?.account_display} criada com saldo inicial de ${log.metadata?.initialBalance} ${log.metadata?.currency}`,
  },

  TRANSFER_NIX: {
    label: 'Transferência Nix',
    severity: 'warning',
    icon: ArrowLeftRight,
    describe: (log: AuditLog) =>
      `Transferência de ${log.metadata?.amount} NSV para ${log.metadata?.toUser}`,
  },

  USER_LOGIN: {
    label: 'Login realizado',
    severity: 'info',
    icon: LogIn,
    describe: () => 'Usuário autenticado com sucesso',
  },

  UPDATE_DISPLAY_NAME: {
    label: 'Nome alterado',
    severity: 'warning',
    icon: Pencil,
    describe: (log: AuditLog) =>
      `Nome alterado para "${log.metadata?.newName}"`,
  },

  USER_REGISTER: {
    label: 'Usuário registrado',
    severity: 'info',
    icon: User,
    describe: () => 'Novo usuário registrado no sistema',
  },
} as const
