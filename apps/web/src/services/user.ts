import { api } from './api';
import type {
  User,
  UserQuery,
  PaginatedResponse,
} from '@nestjs-learning/shared';

export type { User, UserQuery, PaginatedResponse };

/** 获取用户列表 */
export const getUserList = (params?: UserQuery) =>
  api.get<unknown, { data: PaginatedResponse<User> }>('/user', { params });

/** 删除用户 */
export const deleteUser = (id: number) => api.delete(`/user/${id}`);

/** 获取用户详情 */
export const getUserDetail = (id: number) =>
  api.get<unknown, { data: User }>(`/user/${id}`);

/** 创建用户 */
export const createUser = (data: Record<string, unknown>) =>
  api.post('/user', data);

/** 更新用户 */
export const updateUser = (id: number, data: Record<string, unknown>) =>
  api.put(`/user/${id}`, data);
