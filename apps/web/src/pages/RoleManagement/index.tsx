import { Table, Space, Button, Tag, Popconfirm, message } from 'antd';
import { useAntdTable } from 'ahooks';
import { getRoleList, deleteRole, UserRole } from '@/services';
import styles from './RoleManagement.module.scss';
import RoleModal from './components/RoleModal';
import { useCrudModal } from '@/hooks/useCrudModal';

const getTableData = async (
  { current, pageSize }: { current: number; pageSize: number },
  formData: Record<string, unknown>,
) => {
  const res = await getRoleList({
    page: current,
    limit: pageSize,
    ...formData,
  });

  return {
    total: res.data.pagination.total,
    list: res.data.data,
  };
};

export default function RoleManagement() {
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
  } = useCrudModal<UserRole>(refresh);

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('删除成功');
      refresh();
    } catch {
      // API error caught by interceptor
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
      title: '角色标识',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        const color = name === 'admin' ? 'volcano' : 'green';
        return <Tag color={color}>{name.toUpperCase()}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: UserRole) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该角色吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>角色管理</h2>
        <Button type="primary" onClick={handleAdd}>
          新增角色
        </Button>
      </div>
      <Table rowKey="id" {...tableProps} columns={columns} />
      <RoleModal
        open={modalOpen}
        onCancel={handleCancel}
        onSuccess={handleModalSuccess}
        editData={editData}
      />
    </div>
  );
}
