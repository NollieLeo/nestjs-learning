import { useAntdTable } from 'ahooks';
import { getUserList, User } from '@/services';
import { useCrudModal } from '@/hooks/useCrudModal';
import type { FormInstance } from 'antd';
import type { UserQuery } from '@nestjs-learning/shared';

// Type definitions to help ahooks and our backend match
interface PaginatedParams {
  current: number;
  pageSize: number;
  sorter?: {
    field?: string;
    order?: 'ascend' | 'descend';
  };
}

const getTableData = async (
  { current, pageSize, sorter }: PaginatedParams,
  formData: Record<string, unknown>,
) => {
  const queryParams: UserQuery = {
    page: current,
    limit: pageSize,
    keyword: formData.keyword as string | undefined,
    role: formData.role as number | undefined,
  };

  // 处理排序参数映射
  if (sorter?.field && sorter?.order) {
    queryParams.orderBy = sorter.field as 'id' | 'username';
    queryParams.order = sorter.order === 'ascend' ? 'ASC' : 'DESC';
  }

  const res = await getUserList(queryParams);

  return {
    total: res.data.pagination.total,
    list: res.data.data,
  };
};

export const useUserTable = (form: FormInstance) => {
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
  });

  const crud = useCrudModal<User>(search.submit);

  return {
    tableProps,
    search,
    ...crud,
  };
};
