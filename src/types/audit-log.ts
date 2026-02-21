// src/types/audit-log.ts (FRONT)
export type AuditAction =
  | 'CREATE_ACCOUNT'
  | 'UPDATE_ACCOUNT'
  | 'TRANSFER_NIX'
  | 'CREATE_TRANSACTION'
  | 'USER_LOGIN'
  | 'USER_REGISTER'
  | 'UPDATE_DISPLAY_NAME'

export type AuditEntity =
  | 'user'
  | 'account'
  | 'transaction'
  | 'record'

export interface AuditLog {
  _id: string
  actorUserId: string
  action: AuditAction
  entity: AuditEntity
  entityId: string
  metadata?: Record<string, any>
  createdAt: string
}
