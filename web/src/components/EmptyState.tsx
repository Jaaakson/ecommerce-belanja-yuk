import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-rise flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-sunken text-ink-faint">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={icon} />
        </svg>
      </span>

      <p className="mt-4 font-display text-base font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
