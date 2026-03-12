import { Table, Button, message } from 'antd';
import { deleteUser } from '@/services';
import styles from './UserManagement.module.scss';
import UserModal from './components/UserModal';
import { useAuthStore } from '@/stores';
import { useUserColumns } from './hooks/useUserColumns';
import { useUserTable } from './hooks/useUserTable';

export default function UserManagement() {
  const { userInfo } = useAuthStore();
  const {
    tableProps,
    refresh,
    modalOpen,
    editData,
    handleAdd,
    handleEdit,
    handleModalSuccess,
    handleCancel,
  } = useUserTable();

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      refresh();
    } catch {
      // 错误已经在拦截器中抛出提示了
    }
  };

  const columns = useUserColumns({
    currentUserId: userInfo?.id,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

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
