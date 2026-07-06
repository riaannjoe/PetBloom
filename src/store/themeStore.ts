import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  setTheme: (theme: ThemeMode) => {
    set({ theme });
    localStorage.setItem('petbloom-theme', theme);
    get().initializeTheme();
  },
  initializeTheme: () => {
    const theme = (localStorage.getItem('petbloom-theme') as ThemeMode) || 'system';
    set({ theme });

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  },
}));

// Setup media query listener for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useThemeStore.getState().theme;
    if (currentTheme === 'system') {
      useThemeStore.getState().initializeTheme();
    }
  });
}
