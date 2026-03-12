import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cookieStorage } from '@/stores/utils';
import type { AuthUserProfile } from '@nestjs-learning/shared';

interface AuthState {
  token: string | null;
  userInfo: AuthUserProfile | null;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: AuthUserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      logout: () => set({ token: null, userInfo: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);
