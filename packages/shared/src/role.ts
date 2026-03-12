export interface RoleQuery {
  page?: number;
  limit?: number;
  keyword?: string;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name?: string;
}
