import { StateStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

// 自定义 Cookie 存储引擎
export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7, path: '/' });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name, { path: '/' });
  },
};
