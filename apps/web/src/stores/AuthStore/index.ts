import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cookieStorage } from '@/stores/utils';

interface AuthState {
  token: string | null;
  userInfo: { id: number; username: string } | null;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: { id: number; username: string }) => void;
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
