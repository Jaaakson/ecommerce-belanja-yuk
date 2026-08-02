import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--color-muted)]">
        {label}
      </label>

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-xl border bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-brand-500 focus:outline-none ${
          error ? 'border-rose-400' : 'border-[var(--color-line)]'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p id={`${inputId}-error`} className="text-xs font-medium text-rose-500">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-muted)]">{hint}</p>
      ) : null}
    </div>
  );
});
