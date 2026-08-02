import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

/** Header for signed-out pages: landing, login, and register. */
export function PublicHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
        <Link
          to="/"
          aria-label="BelanjaYuk, ke beranda"
          className="rounded-xl transition-transform duration-150 ease-out-quint hover:scale-[1.03] active:scale-95"
        >
          <Logo />
        </Link>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {/* The current page's own action is dropped: offering "Masuk" while
              already on the login screen is noise. */}
          {pathname !== '/login' && (
            <Link to="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
          )}

          {pathname !== '/register' && (
            <Link to="/register">
              <Button>Daftar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
