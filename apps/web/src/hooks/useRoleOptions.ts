import { useRequest } from 'ahooks';
import { getRoleList, UserRole } from '@/services';
import type { DefaultOptionType } from 'antd/es/select';

export function useRoleOptions() {
  const { data, loading, run } = useRequest(
    async (): Promise<DefaultOptionType[]> => {
      const res = await getRoleList({ limit: 100 });
      // 适配 Ant Design 的 Select Options 类型
      return res.data.data.map((r: UserRole) => ({
        label: r.name,
        value: r.id,
      }));
    },
    { manual: true },
  );

  return {
    roleOptions: data || [],
    loading,
    fetchRoles: run,
  };
}
