import { Space, Button, Tag, Popconfirm, Avatar } from 'antd';
import type { TableProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '@/services';
import { RoleEnum } from '@nestjs-learning/shared';
import { formatAddressInfo } from '@/utils/address';

interface UseUserColumnsProps {
  currentUserId?: number;
  onEdit: (record: User) => void;
  onDelete: (id: number) => Promise<void>;
}

export const useUserColumns = ({
  currentUserId,
  onEdit,
  onDelete,
}: UseUserColumnsProps): TableProps<User>['columns'] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: '头像',
      key: 'avatar',
      width: 80,
      render: (_: unknown, record: User) => (
        <Avatar
          src={record.profile?.avatar}
          icon={!record.profile?.avatar && <UserOutlined />}
        />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      render: (_: unknown, record: User) => (
        <Space>
          <span>{record.username}</span>
          {currentUserId === record.id && <Tag color="blue">当前账号</Tag>}
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
      title: '性别',
      key: 'gender',
      width: 80,
      render: (_: unknown, record: User) => {
        const gender = record.profile?.gender;
        if (gender === 1) return <Tag color="blue">男</Tag>;
        if (gender === 2) return <Tag color="magenta">女</Tag>;
        return <Tag color="default">保密</Tag>;
      },
    },
    {
      title: '地址',
      key: 'address',
      render: (_: unknown, record: User) =>
        formatAddressInfo(record.profile?.addressInfo),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => {
        const isSelf = currentUserId === record.id;

        return (
          <Space size="middle">
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除该用户吗？"
              onConfirm={() => onDelete(record.id)}
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
};
