import { useAntdTable } from 'ahooks';
import { getUserList, User } from '@/services';
import { useCrudModal } from '@/hooks/useCrudModal';

const getTableData = async (
  { current, pageSize }: { current: number; pageSize: number },
  formData: Record<string, unknown>,
) => {
  const res = await getUserList({
    page: current,
    limit: pageSize,
    ...formData,
  });

  return {
    total: res.data.pagination.total,
    list: res.data.data,
  };
};

export const useUserTable = () => {
  const { tableProps, refresh } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const crud = useCrudModal<User>(refresh);

  return {
    tableProps,
    refresh,
    ...crud,
  };
};
