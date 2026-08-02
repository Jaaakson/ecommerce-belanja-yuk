import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`
        grid size-9 shrink-0 place-items-center rounded-xl
        border border-line bg-surface text-ink-soft
        transition-[background-color,border-color,color,transform] duration-150 ease-out-quint
        hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600
        active:scale-95
        dark:hover:bg-brand-500/10 dark:hover:text-brand-200
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
