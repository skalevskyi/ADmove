'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const THEME_KEY = 'spm-theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

/** Resolved appearance applied to `html` — `html.dark` when `'dark'`. */
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (next: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Reads `spm-theme` (`light` | `dark` | `auto`) or legacy `*-theme` (`light` | `dark` only). `null` = treat as `auto`. */
function readStoredMode(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || key === THEME_KEY) continue;
    if (!key.endsWith('-theme')) continue;
    const legacyStored = localStorage.getItem(key);
    if (legacyStored === 'dark' || legacyStored === 'light') return legacyStored;
  }
  return null;
}

function getResolvedTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const themeModeRef = useRef(themeMode);
  themeModeRef.current = themeMode;

  useLayoutEffect(() => {
    const mode = readStoredMode() ?? 'auto';
    const resolved = getResolvedTheme(mode);
    setThemeModeState(mode);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  const setThemeMode = useCallback((next: ThemeMode) => {
    const resolved = getResolvedTheme(next);
    setThemeModeState(next);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, next);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const prev = themeModeRef.current;
    const next: ThemeMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light';
    setThemeMode(next);
  }, [setThemeMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (themeMode !== 'auto') return undefined;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next: ResolvedTheme = mq.matches ? 'dark' : 'light';
      setResolvedTheme(next);
      applyTheme(next);
    };

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [themeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ themeMode, resolvedTheme, setThemeMode, toggleTheme }),
    [themeMode, resolvedTheme, setThemeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
