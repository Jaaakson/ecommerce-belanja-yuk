import { useId, type SelectHTMLAttributes } from 'react';

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
  const generatedId = useId();
  const selectId = id ?? props.name ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-2xs font-semibold uppercase tracking-wide text-ink-faint"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={`
            h-11 w-full cursor-pointer appearance-none rounded-xl border bg-surface
            pl-3.5 pr-10 text-sm text-ink
            transition-[border-color,box-shadow] duration-150 ease-out-quint
            hover:border-line-strong
            focus:outline-none focus:ring-4
            ${
              error
                ? 'border-critical focus:border-critical focus:ring-critical/15'
                : 'border-line focus:border-brand-500 focus:ring-brand-500/15'
            }
            ${props.value ? '' : 'text-ink-faint'}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-ink">
              {option.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {error && <p className="animate-fade-in text-2xs font-medium text-critical">{error}</p>}
    </div>
  );
}
