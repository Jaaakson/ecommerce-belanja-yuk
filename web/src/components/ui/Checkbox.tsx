import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode;
}

export function Checkbox({ children, className = '', ...props }: CheckboxProps) {
  return (
    <label
      className={`group flex w-fit cursor-pointer select-none items-start gap-2.5 text-sm text-ink-soft transition-colors duration-150 hover:text-ink ${className}`}
    >
      <span className="relative mt-0.5 grid size-4.5 shrink-0 place-items-center">
        <input
          type="checkbox"
          className="peer size-4.5 cursor-pointer appearance-none rounded-md border border-line-strong bg-surface transition-[background-color,border-color] duration-150 checked:border-brand-500 checked:bg-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/15 group-hover:border-brand-400"
          {...props}
        />
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute size-3 scale-50 text-white opacity-0 transition-[opacity,transform] duration-150 ease-out-quint peer-checked:scale-100 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      {children}
    </label>
  );
}
