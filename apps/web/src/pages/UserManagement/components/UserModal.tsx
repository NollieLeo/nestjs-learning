import { Modal, Form, Input, Select, message, Radio, Divider } from 'antd';
import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import {
  createUser,
  updateUser,
  User,
  getRoleList,
  UserRole,
} from '@/services';
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from '@nestjs-learning/shared';

interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editData?: User | null;
}

export default function UserModal({
  open,
  onCancel,
  onSuccess,
  editData,
}: UserModalProps) {
  const [form] = Form.useForm();
  const isEdit = !!editData;

  const { data: roleOptions, run: fetchRoles } = useRequest(
    async () => {
      const res = await getRoleList({ limit: 100 });
      return res.data.data.map((r: UserRole) => ({
        label: r.name,
        value: r.id,
      }));
    },
    { manual: true },
  );

  const { runAsync: submit, loading } = useRequest(
    async (
      values: CreateUserRequest & UpdateUserRequest & { roles?: number[] },
    ) => {
      const payload = {
        username: values.username as string,
        password: values.password,
        roles: values.roles ? values.roles.map((id: number) => ({ id })) : [],
        profile: {
          avatar: values.profile?.avatar || '',
          gender: values.profile?.gender ?? 0,
          address: values.profile?.address || '',
        },
      };

      if (isEdit && editData) {
        await updateUser(editData.id, payload);
        message.success('更新成功');
      } else {
        await createUser(payload);
        message.success('创建成功');
      }
    },
    { manual: true },
  );

  useEffect(() => {
    if (open) {
      fetchRoles();
      if (editData) {
        form.setFieldsValue({
          username: editData.username,
          roles: editData.roles?.map((r: UserRole) => r.id),
          profile: {
            avatar: editData.profile?.avatar,
            gender: editData.profile?.gender ?? 0,
            address: editData.profile?.address,
          },
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editData, form, fetchRoles]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await submit(values);
      onSuccess();
    } catch {
      // Form validation error or API error caught by interceptor
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑用户' : '新建用户'}
      open={open}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ roles: [], profile: { gender: 0 } }}
      >
        <Divider titlePlacement="left" plain>
          基础信息
        </Divider>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item name="roles" label="角色分配">
          <Select
            mode="multiple"
            placeholder="请选择角色"
            options={roleOptions}
            allowClear
          />
        </Form.Item>

        <Divider titlePlacement="left" plain>
          资料卡
        </Divider>
        <Form.Item name={['profile', 'avatar']} label="头像 URL">
          <Input placeholder="输入头像图片链接" />
        </Form.Item>

        <Form.Item name={['profile', 'gender']} label="性别">
          <Radio.Group>
            <Radio value={0}>保密</Radio>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name={['profile', 'address']} label="联系地址">
          <Input.TextArea placeholder="请输入详细地址" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
