import { mockUser, type User } from '@/utils/mockData';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUser;
  },

  async login(email: string, _password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: 'user-sarah',
      name: 'Sarah Jenkins',
      email: email,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  async register(name: string, email: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: Math.random().toString(),
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
    };
  },
};
