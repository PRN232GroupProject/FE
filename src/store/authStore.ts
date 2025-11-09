import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '../types/user.types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loginToStore: (token: string, user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginToStore: (token, user) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);