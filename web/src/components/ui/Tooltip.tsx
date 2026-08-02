import type { ReactNode } from 'react';

/**
 * CSS-only tooltip. Hidden from assistive tech because every element that uses
 * it already carries an aria-label — announcing both would read the same
 * string twice.
 */
export function Tooltip({
  label,
  children,
  side = 'bottom',
}: {
  label: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
}) {
  const position =
    side === 'top'
      ? 'bottom-full mb-2 origin-bottom'
      : 'top-full mt-2 origin-top';

  return (
    <span className="group/tip relative inline-flex">
      {children}

      <span
        aria-hidden
        className={`
          pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 ${position}
          whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-2xs font-medium text-canvas
          opacity-0 shadow-md transition-[opacity,transform] duration-150 ease-out-quint
          scale-95
          group-hover/tip:scale-100 group-hover/tip:opacity-100
          group-focus-visible/tip:scale-100 group-focus-visible/tip:opacity-100
        `}
      >
        {label}
      </span>
    </span>
  );
}
