import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ProfileMenu } from './ProfileMenu';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { useCart } from '../lib/cart';

export function AppHeader({ onSearch }: { onSearch?: (keyword: string) => void }) {
  const { itemCount } = useCart();

  const [keyword, setKeyword] = useState('');
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bumped, setBumped] = useState(false);
  const previousCount = useRef(itemCount);

  // The border only appears once content slides underneath, so the header
  // reads as flat at rest and lifted while scrolling.
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 4);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A short pop on the badge confirms the cart changed even when the user is
  // looking at the product grid rather than the header.
  useEffect(() => {
    if (itemCount > previousCount.current) {
      setBumped(true);
      const timer = setTimeout(() => setBumped(false), 320);

      previousCount.current = itemCount;

      return () => clearTimeout(timer);
    }

    previousCount.current = itemCount;
  }, [itemCount]);

  return (
    <header
      className={`sticky top-0 z-40 bg-surface/80 backdrop-blur-xl transition-[box-shadow,border-color] duration-200 ease-out-quint ${
        scrolled ? 'border-b border-line shadow-sm' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3">
        <Link
          to="/"
          aria-label="BelanjaYuk, ke beranda"
          className="shrink-0 rounded-xl transition-transform duration-150 ease-out-quint hover:scale-105 active:scale-95"
        >
          <Logo withWordmark={false} />
        </Link>

        {onSearch && (
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(keyword);
            }}
          >
            {/* The button is a flex sibling rather than an absolutely placed
                overlay, so it can never fight the component's own positioning. */}
            <div className="relative min-w-0 flex-1">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 transition-colors duration-150 ${
                  focused ? 'text-brand-500' : 'text-ink-faint'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Cari barang apa?"
                aria-label="Cari barang"
                className="h-10 w-full rounded-xl border border-line bg-sunken pl-10 pr-9 text-sm text-ink transition-[border-color,box-shadow,background-color] duration-150 ease-out-quint placeholder:text-ink-faint/70 hover:border-line-strong focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />

              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('');
                    onSearch('');
                  }}
                  aria-label="Bersihkan pencarian"
                  className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-line hover:text-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <Button type="submit" className="hidden shrink-0 sm:inline-flex">
              Cari
            </Button>
          </form>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <Tooltip label="Keranjang">
            <Link
              to="/cart"
              aria-label={`Keranjang, ${itemCount} barang`}
              className="relative grid size-9 place-items-center rounded-xl border border-line bg-surface text-ink-soft transition-[background-color,border-color,color,transform] duration-150 ease-out-quint hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 active:scale-95 dark:hover:bg-brand-500/10 dark:hover:text-brand-200"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              >
                <path d="M5 6h16l-1.6 9H7.2L5 6ZM5 6l-.8-3H2" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>

              {itemCount > 0 && (
                <span
                  className={`absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold tabular text-white shadow-brand transition-transform duration-200 ease-out-quint ${
                    bumped ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </Tooltip>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
