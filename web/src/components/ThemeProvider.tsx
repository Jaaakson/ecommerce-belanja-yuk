import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from '../lib/theme';

const STORAGE_KEY = 'belanjayuk.theme';

function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored) return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
