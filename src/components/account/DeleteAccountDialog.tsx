// src/components/account/DeleteAccountDialog.tsx
import { ReactNode } from "react";
import { XCircle } from "lucide-react";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: DeleteAccountDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[hsl(var(--card))] p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
              Deletar conta
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Esta ação é permanente. Sua conta no Banco NSV será encerrada e
              você perderá acesso imediato ao aplicativo.
            </p>

            <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              Alguns dados podem continuar armazenados por exigências
              regulatórias e auditoria interna.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deletando..." : "Sim, deletar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}
