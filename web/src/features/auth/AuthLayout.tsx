import type { ReactNode } from 'react';
import { Logo } from '../../components/Logo';
import { ThemeToggle } from '../../components/ThemeToggle';

const highlights = ['Gratis ongkir', 'Bayar COD', 'Promo harian', 'Pengiriman cepat'];

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
    <div className="min-h-screen bg-[var(--color-canvas)] px-4 py-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <aside className="hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 lg:block">
          <div className="mb-8 h-40 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6">
            <span className="grid size-11 place-items-center rounded-full bg-white/20 backdrop-blur">
              <span className="size-5 rounded-full bg-white" />
            </span>
            <div className="mt-4 space-y-2">
              <span className="block h-2 w-28 rounded-full bg-white/70" />
              <span className="block h-2 w-20 rounded-full bg-white/40" />
            </div>
          </div>

          <h2 className="font-display text-xl font-extrabold text-[var(--color-ink)]">
            BelanjaYuk — lebih fun, lebih cepat
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
            Satu tempat untuk semua kebutuhan harian, dengan harga yang jujur dan pengiriman yang
            bisa diandalkan.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <main className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Logo />
              <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight text-[var(--color-ink)]">
                {title}
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
            </div>
            <ThemeToggle />
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
