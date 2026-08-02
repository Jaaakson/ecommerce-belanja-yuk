import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';

export function AppHeader({ onSearch }: { onSearch?: (keyword: string) => void }) {
  const { user, logout } = useAuth();
  const { itemCount, clear } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  function handleLogout() {
    logout();
    clear();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-surface)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="shrink-0">
          <Logo withWordmark={false} />
          <span className="sr-only">BelanjaYuk</span>
        </Link>

        {onSearch && (
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(keyword);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari barang apa? (misal: sepatu, headset, kopi)"
              aria-label="Cari barang"
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] py-2 pl-9 pr-20 text-sm text-[var(--color-ink)] transition-colors placeholder:text-[var(--color-muted)]/70 focus:border-brand-500 focus:outline-none"
            />
            <Button type="submit" className="absolute right-1 top-1 !px-3 !py-1.5 text-xs">
              Cari
            </Button>
          </form>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <Link
            to="/cart"
            className="relative grid size-9 place-items-center rounded-xl border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:text-brand-500"
            aria-label={`Keranjang, ${itemCount} barang`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 6h16l-1.6 9H7.2L5 6ZM5 6l-.8-3H2" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-100 text-xs font-bold text-brand-700">
              {initials}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-rose-500"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
