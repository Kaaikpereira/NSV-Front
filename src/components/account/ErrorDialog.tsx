// src/components/ui/ErrorDialog.tsx
import { XCircle } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export function ErrorDialog({
  open,
  title = "Ocorreu um erro",
  message,
  onClose,
}: ErrorDialogProps) {
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
              {title}
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}