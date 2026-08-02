import { IconButton } from './ui/IconButton';
import { Tooltip } from './ui/Tooltip';
import { useTheme } from '../lib/theme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip label={isDark ? 'Tema terang' : 'Tema gelap'}>
      <IconButton
        label={isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
        onClick={toggle}
      >
        {/* Both icons stay mounted and cross-fade, so the swap reads as one
            object rotating rather than two elements popping in and out. */}
        <span className="relative grid size-4 place-items-center">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`absolute size-4 transition-[opacity,transform] duration-300 ease-out-quint ${
              isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>

          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`absolute size-4 transition-[opacity,transform] duration-300 ease-out-quint ${
              isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </span>
      </IconButton>
    </Tooltip>
  );
}
