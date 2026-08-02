import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder = 'Pilih',
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--color-muted)]">
        {label}
      </label>

      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        className={`w-full appearance-none rounded-xl border bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] transition-colors focus:border-brand-500 focus:outline-none ${
          error ? 'border-rose-400' : 'border-[var(--color-line)]'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
