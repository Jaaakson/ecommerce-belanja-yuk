import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { ThemeToggle } from '../../components/ThemeToggle';

const highlights = [
  { label: 'Gratis ongkir', icon: 'M5 18H3V6h11v12H9m10 0h2v-5l-3-4h-4v9h1' },
  { label: 'Bayar COD', icon: 'M2 7h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Zm0 0 3-4h14l3 4M12 12v4m-2-2h4' },
  { label: 'Promo harian', icon: 'M20 12V8H6a2 2 0 0 1 0-4h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 0 0 0 4h4v-4Z' },
];

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
    <div className="relative min-h-screen overflow-hidden bg-canvas px-4 py-6 sm:py-10">
      {/* A single soft brand glow gives the flat canvas depth without adding an
          ornament that competes with the form. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15"
      />

      <div className="relative mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Link
          to="/"
          aria-label="Kembali ke beranda"
          className="hidden overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-[border-color,box-shadow] duration-250 ease-out-quint hover:border-brand-200 hover:shadow-md lg:block dark:hover:border-brand-500/30"
        >
          <div className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-7">
            <div aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -bottom-12 -left-6 size-28 rounded-full bg-white/5" />

            <p className="relative font-display text-2xl font-extrabold leading-tight text-white">
              Belanja jadi
              <br />
              lebih ringan.
            </p>
            <p className="relative mt-2 max-w-64 text-sm leading-relaxed text-white/75">
              Harga jujur, pengiriman cepat, dan ribuan produk yang siap dikirim hari ini.
            </p>
          </div>

          <ul className="divide-y divide-line">
            {highlights.map((item) => (
              <li key={item.label} className="flex items-center gap-3 px-6 py-3.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/12 dark:text-brand-300">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink-soft">{item.label}</span>
              </li>
            ))}
          </ul>
        </Link>

        <main className="animate-rise rounded-3xl border border-line bg-surface p-6 shadow-md sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            {/* The logo is the way back out: without it the only exit from an
                auth screen is the browser's back button. */}
            <Link
              to="/"
              aria-label="BelanjaYuk, kembali ke beranda"
              className="rounded-xl transition-transform duration-150 ease-out-quint hover:scale-[1.03] active:scale-95"
            >
              <Logo />
            </Link>

            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-ink-soft transition-colors duration-150 hover:bg-sunken hover:text-ink sm:inline-flex"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
                </svg>
                Beranda
              </Link>

              <ThemeToggle />
            </div>
          </div>

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
