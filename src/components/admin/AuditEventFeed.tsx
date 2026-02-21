// src/components/admin/AuditEventFeed.tsx
import { auditActionMap } from '@/lib/audit-map'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { AuditLog } from '@/types/audit-log'

type Props = {
  logs: AuditLog[]
}

export function AuditEventFeed({ logs }: Props) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <AuditEventItem key={log._id} log={log} />
      ))}
    </div>
  )
}

function AuditEventItem({ log }: { log: AuditLog }) {
  const [open, setOpen] = useState(false)

  const action = auditActionMap[log.action]
  const Icon = action?.icon

  const severityStyles = {
    info: 'border-blue-500/30 bg-blue-50/40',
    warning: 'border-amber-500/30 bg-amber-50/40',
    critical: 'border-red-500/40 bg-red-50/40',
  }

  return (
    <Card
      className={cn(
        'border p-4 transition',
        severityStyles[action?.severity ?? 'info']
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm">
            {Icon && <Icon className="h-4 w-4" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {action?.label ?? log.action}
              </span>

              <Badge variant="outline" className="text-[10px]">
                {log.entity}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {action?.describe
                ? action.describe(log)
                : 'Evento registrado no sistema'}
            </p>

            <div className="text-xs text-muted-foreground">
              Usuário {log.actorUserId.slice(0, 6)}…
              {log.actorUserId.slice(-4)} •{' '}
              {new Date(log.createdAt).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              open && 'rotate-180'
            )}
          />
        </button>
      </div>

      {open && (
        <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs">
          <div>
            <strong>Entity ID:</strong> {log.entityId}
          </div>

          {log.metadata && (
            <pre className="mt-2 overflow-x-auto rounded bg-background p-2 text-[11px]">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          )}
        </div>
      )}
    </Card>
  )
}
