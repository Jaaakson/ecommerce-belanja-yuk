import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-brand hover:bg-brand-600 hover:shadow-md active:bg-brand-700 disabled:bg-brand-500/45 disabled:shadow-none',
  outline:
    'border border-line bg-surface text-ink hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100 dark:hover:bg-brand-500/10 dark:hover:text-brand-200',
  ghost:
    'text-ink-soft hover:bg-sunken hover:text-ink active:bg-line',
  danger:
    'bg-critical text-white hover:brightness-110 active:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-2xs font-semibold',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm font-semibold',
  lg: 'h-12 gap-2 rounded-xl px-5 text-sm font-bold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`
        relative inline-flex select-none items-center justify-center
        transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out-quint
        active:scale-[0.97]
        disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...props}
    >
      {/* Label keeps its position while loading; swapping it for a spinner
          would make the button jump and lose its accessible name. */}
      <span className={loading ? 'invisible' : 'contents'}>{children}</span>

      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner className="size-4" />
        </span>
      )}
    </button>
  );
}
