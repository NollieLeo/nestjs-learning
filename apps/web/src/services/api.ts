import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
} from '@nestjs-learning/shared';
import { API_PREFIX } from '@nestjs-learning/shared';

const api = axios.create({
  baseURL: `/${API_PREFIX}`,
  timeout: 10000,
});

// 请求拦截器：自动携带 Bearer Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：401 时跳转登录
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

/** 登录 */
export const login = (data: LoginRequest) =>
  api.post<LoginResponse>('/auth/login', data);

/** 注册 */
export const register = (data: RegisterRequest) =>
  api.post('/auth/register', data);

/** 获取当前用户 */
export const getProfile = () => api.get('/auth/profile');
