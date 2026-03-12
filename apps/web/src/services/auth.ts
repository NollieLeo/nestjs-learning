/** 登录 */
// 注意这里返回类型泛型改为具体的业务数据格式，因为拦截器里我们已经做了脱壳处理

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@nestjs-learning/shared';
import { api } from './api';

// Axios 实际上返回的 response.data 就是 LoginResponse 了
export const login = (data: LoginRequest) =>
  api.post<unknown, { data: LoginResponse }>('/auth/login', data);

/** 注册 */
export const register = (data: RegisterRequest) =>
  api.post('/auth/register', data);

import type {
  User,
  UpdateMyProfileRequest,
  UpdatePasswordRequest,
} from '@nestjs-learning/shared';

/** 获取当前用户 */
export const getProfile = () =>
  api.get<unknown, { data: User }>('/auth/profile');

/** 更新自己的个人资料 */
export const updateMyProfile = (data: UpdateMyProfileRequest) =>
  api.put('/auth/profile', data);

/** 更新自己的密码 */
export const updateMyPassword = (data: UpdatePasswordRequest) =>
  api.put('/auth/password', data);
