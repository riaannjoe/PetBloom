import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types/domain';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    { name: 'petbloom-theme' },
  ),
);
