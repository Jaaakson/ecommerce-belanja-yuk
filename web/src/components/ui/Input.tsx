import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leading, trailing, id, className = '', ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-2xs font-semibold uppercase tracking-wide text-ink-faint"
      >
        {label}
      </label>

      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            {leading}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`
            h-11 w-full rounded-xl border bg-surface text-sm text-ink
            transition-[border-color,box-shadow,background-color] duration-150 ease-out-quint
            placeholder:text-ink-faint/70
            hover:border-line-strong
            focus:outline-none focus:ring-4
            disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-faint
            ${leading ? 'pl-10' : 'pl-3.5'}
            ${trailing ? 'pr-11' : 'pr-3.5'}
            ${
              error
                ? 'border-critical focus:border-critical focus:ring-critical/15'
                : 'border-line focus:border-brand-500 focus:ring-brand-500/15'
            }
            ${className}
          `}
          {...props}
        />

        {trailing && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={`flex items-start gap-1 text-2xs ${
            error ? 'animate-fade-in font-medium text-critical' : 'text-ink-faint'
          }`}
        >
          {error && (
            <svg viewBox="0 0 24 24" className="mt-px size-3 shrink-0" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
            </svg>
          )}
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

/** Toggles password visibility from inside the field's trailing slot. */
export function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
      className="grid size-8 place-items-center rounded-lg text-ink-faint transition-colors duration-150 hover:bg-sunken hover:text-brand-500"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        {visible && <path d="m3 3 18 18" strokeLinecap="round" />}
      </svg>
    </button>
  );
}

/** Password field with a built-in visibility toggle. */
export function PasswordInput(props: Omit<InputProps, 'type' | 'trailing'>) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={<PasswordToggle visible={visible} onToggle={() => setVisible((v) => !v)} />}
    />
  );
}
