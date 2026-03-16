/** API 路径前缀 */
export const API_PREFIX = 'api/v1';

/** 密码最小长度 */
export const PASSWORD_MIN_LENGTH = 6;

/** 用户名最小长度 */
export const USERNAME_MIN_LENGTH = 2;

/** 用户名最大长度 */
export const USERNAME_MAX_LENGTH = 20;

/** 全局 API 响应统一格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 角色定义枚举 */
export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

/** Auth 相关接口类型 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UpdatePasswordRequest {
  oldPassword?: string; // Optional if you are an admin resetting, but required for self
  newPassword: string;
}

export interface UpdateMyProfileRequest {
  username?: string;
  profile?: {
    avatar?: string;
    gender?: number;
    address?: string;
  };
}

export interface AuthUserProfile {
  id: number;
  username: string;
  roles?: RoleEnum[];
  avatar?: string;
  gender?: number;
}

/** ===== 公共业务类型 (用户、分页等) ===== */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export * from './role';
export * from './user';
