import { useAuthStore } from '@/stores';
import { RoleEnum } from '@nestjs-learning/shared';

export function usePermissions() {
  const { userInfo } = useAuthStore();

  const isAdmin = userInfo?.roles?.includes(RoleEnum.ADMIN) ?? false;

  const hasRole = (role: RoleEnum) => {
    return userInfo?.roles?.includes(role) ?? false;
  };

  return {
    isAdmin,
    hasRole,
  };
}
