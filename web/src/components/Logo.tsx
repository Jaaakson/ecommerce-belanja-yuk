export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-500 shadow-sm shadow-brand-500/40">
        <svg viewBox="0 0 24 24" className="size-4 text-white" fill="currentColor">
          <path d="M6 6h13l-1.5 8H7.5L6 6ZM6 6 5.2 3H3M8 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm7 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-extrabold tracking-tight text-[var(--color-ink)]">
          BelanjaYuk
        </span>
      )}
    </span>
  );
}
