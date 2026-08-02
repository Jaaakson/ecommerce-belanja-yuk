import { useCallback, useState, type ReactNode } from 'react';
import { ToastContext, type Toast, type ToastTone } from '../lib/toast';

const DISMISS_AFTER_MS = 3200;

const accents: Record<ToastTone, string> = {
  success: 'text-positive',
  error: 'text-critical',
  info: 'text-brand-500',
};

const icons: Record<ToastTone, string> = {
  success: 'M20 6 9 17l-5-5',
  error: 'M12 8v5M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  info: 'M12 16v-5M12 8h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback(
    (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)),
    [],
  );

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = Date.now() + Math.random();

      // Cap the stack: a queue taller than three obscures the page it reports on.
      setToasts((current) => [...current.slice(-2), { id, tone, message }]);
      setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="
              pointer-events-auto flex w-full max-w-sm items-center gap-2.5
              rounded-full border border-line bg-surface/85 py-2 pl-3 pr-2
              shadow-lg backdrop-blur-xl
              animate-rise
            "
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={`size-4 shrink-0 ${accents[toast.tone]}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icons[toast.tone]} />
            </svg>

            <p className="flex-1 truncate text-xs font-medium text-ink">{toast.message}</p>

            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="grid size-6 shrink-0 place-items-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-sunken hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
