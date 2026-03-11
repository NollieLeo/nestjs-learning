/** API 路径前缀 */
export const API_PREFIX = 'api/v1';

/** 密码最小长度 */
export const PASSWORD_MIN_LENGTH = 6;

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
}
