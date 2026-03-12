import { Table, Space, Button, Tag, Popconfirm, message } from 'antd';
import { useAntdTable } from 'ahooks';
import { getUserList, deleteUser, User } from '@/services';
import styles from './UserManagement.module.scss';
import { RoleEnum } from '@nestjs-learning/shared';
import UserModal from './components/UserModal';
import { useCrudModal } from '@/hooks/useCrudModal';
import { useAuthStore } from '@/stores';

// API 调用适配给 ahooks 的 useAntdTable
const getTableData = async (
  { current, pageSize }: { current: number; pageSize: number },
  formData: Record<string, unknown>,
) => {
  const res = await getUserList({
    page: current,
    limit: pageSize,
    ...formData,
  });

  // 根据服务端返回的数据结构进行适配
  // 这里 api.ts 的拦截器返回的是 res.data
  return {
    total: res.data.pagination.total,
    list: res.data.data,
  };
};

export default function UserManagement() {
  const { userInfo } = useAuthStore();
  const { tableProps, refresh } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const {
    modalOpen,
    editData,
    handleAdd,
    handleEdit,
    handleModalSuccess,
    handleCancel,
  } = useCrudModal<User>(refresh);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      refresh();
    } catch {
      // 错误已经在拦截器中抛出提示了
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      key: 'username',
      render: (_: unknown, record: User) => (
        <Space>
          <span>{record.username}</span>
          {userInfo?.id === record.id && <Tag color="blue">当前账号</Tag>}
        </Space>
      ),
    },
    {
      title: '角色',
      key: 'roles',
      dataIndex: 'roles',
      render: (_: unknown, record: User) => (
        <>
          {record.roles?.map((role) => {
            const color = role.name === RoleEnum.ADMIN ? 'volcano' : 'green';
            return (
              <Tag color={color} key={role.id}>
                {role.name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '地址',
      key: 'address',
      render: (_: unknown, record: User) => record.profile?.address || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => {
        const isSelf = userInfo?.id === record.id;

        return (
          <Space size="middle">
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除该用户吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
              disabled={isSelf}
            >
              <Button type="link" danger disabled={isSelf}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>用户管理</h2>
        <Button type="primary" onClick={handleAdd}>
          新增用户
        </Button>
      </div>
      <Table rowKey="id" {...tableProps} columns={columns} />
      <UserModal
        open={modalOpen}
        onCancel={handleCancel}
        onSuccess={handleModalSuccess}
        editData={editData}
      />
    </div>
  );
}
