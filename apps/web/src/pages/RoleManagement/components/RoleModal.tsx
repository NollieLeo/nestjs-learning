import { Modal, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import { createRole, updateRole, UserRole } from '@/services';
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@nestjs-learning/shared';

interface RoleModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editData?: UserRole | null;
}

export default function RoleModal({
  open,
  onCancel,
  onSuccess,
  editData,
}: RoleModalProps) {
  const [form] = Form.useForm();
  const isEdit = !!editData;

  const { runAsync: submit, loading } = useRequest(
    async (values: CreateRoleRequest & UpdateRoleRequest) => {
      if (isEdit && editData) {
        await updateRole(editData.id, values);
        message.success('更新成功');
      } else {
        await createRole(values);
        message.success('创建成功');
      }
    },
    { manual: true },
  );

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          name: editData.name,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await submit(values);
      onSuccess();
    } catch {
      // Validation error or API error
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑角色' : '新建角色'}
      open={open}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="角色标识"
          rules={[
            { required: true, message: '请输入角色名称标识，例如 admin' },
          ]}
        >
          <Input placeholder="请输入角色名称标识" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
