import type { ReactNode } from 'react';
import { PublicHeader } from '../../components/PublicHeader';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <PublicHeader />

      <div className="relative px-4 py-10 sm:py-16">
        {/* A single soft brand glow gives the flat canvas depth without adding
            an ornament that competes with the form. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-lg rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15"
        />

        <main className="animate-rise mx-auto w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-md sm:p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
