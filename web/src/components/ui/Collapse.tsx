import { useState, type ReactNode } from 'react';

/**
 * Grid-based collapse. Animating `grid-template-rows` from 0fr to 1fr is the
 * only way to transition to an unknown content height without measuring it in
 * JavaScript or hardcoding a max-height that clips or lags.
 */
export function Collapse({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-line transition-colors duration-150 hover:border-line-strong">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-sunken"
      >
        <span className="flex-1">
          <span className="block text-sm font-semibold text-ink">{title}</span>
          {hint && <span className="mt-0.5 block text-2xs text-ink-faint">{hint}</span>}
        </span>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`size-4 shrink-0 text-ink-faint transition-transform duration-250 ease-out-quint ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out-quint ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-line p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
