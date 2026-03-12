import { api } from './api';
import type {
  RoleQuery,
  PaginatedResponse,
  UserRole,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@nestjs-learning/shared';

export type { RoleQuery, UserRole };

/** 获取角色列表 */
export const getRoleList = (params?: RoleQuery) =>
  api.get<unknown, { data: PaginatedResponse<UserRole> }>('/roles', { params });

/** 创建角色 */
export const createRole = (data: CreateRoleRequest) => api.post('/roles', data);

/** 更新角色 */
export const updateRole = (id: number, data: UpdateRoleRequest) =>
  api.put(`/roles/${id}`, data);

/** 删除角色 */
export const deleteRole = (id: number) => api.delete(`/roles/${id}`);
