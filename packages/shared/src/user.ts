import { RoleEnum } from './index';

export interface UserRole {
  id: number;
  name: RoleEnum;
}

export interface AddressInfo {
  provinceCode?: string;
  provinceName?: string;
  cityCode?: string;
  cityName?: string;
  districtCode?: string;
  districtName?: string;
  detailAddress?: string;
}

export interface UserProfile {
  id: number;
  gender: number;
  avatar: string;
  addressInfo?: AddressInfo;
}

export interface User {
  id: number;
  username: string;
  roles?: UserRole[];
  profile?: UserProfile;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  role?: number;
  orderBy?: 'id' | 'username';
  order?: 'ASC' | 'DESC';
}

export interface CreateUserRequest {
  username: string;
  password?: string;
  roles?: { id: number }[];
  profile?: Omit<UserProfile, 'id'>;
}

export interface UpdateUserRequest {
  username?: string;
  roles?: { id: number }[];
  profile?: Partial<Omit<UserProfile, 'id'>>;
}
