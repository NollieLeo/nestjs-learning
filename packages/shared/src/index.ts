/** API 路径前缀 */
export const API_PREFIX = 'api/v1';

/** 密码最小长度 */
export const PASSWORD_MIN_LENGTH = 6;

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

export interface UserProfile {
  id: number;
  username: string;
  roles?: RoleEnum[];
}
