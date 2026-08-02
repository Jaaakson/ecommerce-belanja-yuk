import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from './ui/Avatar';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';
import { useClickOutside } from '../lib/useClickOutside';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const { clear } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(containerRef, close, open);

  if (!user) return null;

  function handleLogout() {
    logout();
    clear();
    navigate('/login', { replace: true });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu akun"
        className="group flex items-center gap-2 rounded-xl p-0.5 pr-1 transition-colors duration-150 hover:bg-sunken sm:pr-2"
      >
        <Avatar name={user.fullName} interactive />

        <span className="hidden max-w-28 truncate text-xs font-semibold text-ink sm:block">
          {user.fullName.split(' ')[0]}
        </span>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`hidden size-3.5 text-ink-faint transition-transform duration-200 ease-out-quint sm:block ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right animate-rise overflow-hidden rounded-2xl border border-line bg-surface shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-line px-3 py-3">
            <Avatar name={user.fullName} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.fullName}</p>
              <p className="truncate text-2xs text-ink-faint">{user.email}</p>
            </div>
          </div>

          <div className="p-1.5">
            <MenuItem
              label="Keluar"
              tone="critical"
              onClick={handleLogout}
              icon="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  label,
  icon,
  onClick,
  tone = 'default',
}: {
  label: string;
  icon: string;
  onClick: () => void;
  tone?: 'default' | 'critical';
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`
        flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium
        transition-colors duration-150
        ${
          tone === 'critical'
            ? 'text-critical hover:bg-critical/10'
            : 'text-ink-soft hover:bg-sunken hover:text-ink'
        }
      `}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={icon} />
      </svg>
      {label}
    </button>
  );
}
