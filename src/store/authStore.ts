import { create } from 'zustand';
import { type User, mockUser } from '@/utils/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string) => Promise<boolean>;
  setOnboarded: (isOnboarded: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser, // Seed with mock user for local development
  isAuthenticated: true,
  isOnboarded: true, // true by default for Max's pre-seeded profile, false for new signups

  login: async (email, _password) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      user: {
        id: 'user-sarah',
        name: 'Sarah Jenkins',
        email: email,
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
      },
      isAuthenticated: true,
      isOnboarded: true, // Assume mock user is onboarded
    });
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isOnboarded: false });
  },

  register: async (name, email) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      user: {
        id: Math.random().toString(),
        name,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      },
      isAuthenticated: true,
      isOnboarded: false, // New users need onboarding!
    });
    return true;
  },

  setOnboarded: (isOnboarded) => set({ isOnboarded }),
}));
