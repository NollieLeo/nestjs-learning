import { Modal, Form, Input, Select, message, Radio, Divider } from 'antd';
import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import { createUser, updateUser, User, UserRole } from '@/services';
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from '@nestjs-learning/shared';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from '@nestjs-learning/shared';
import { RegionCascader, RegionValue } from '@/components/RegionCascader';
import { useRoleOptions } from '@/hooks/useRoleOptions';
import { buildAddressInfoPayload, extractRegionValue } from '@/utils/address';

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

  const { roleOptions, fetchRoles } = useRoleOptions();

  const { runAsync: submit, loading } = useRequest(
    async (
      values: CreateUserRequest &
        UpdateUserRequest & {
          roles?: number[];
          region?: RegionValue;
          profile?: Record<string, unknown>;
        },
    ) => {
      const payload = {
        username: values.username as string,
        password: values.password,
        roles: values.roles ? values.roles.map((id: number) => ({ id })) : [],
        profile: {
          avatar: (values.profile?.avatar as string) || '',
          gender: (values.profile?.gender as number) ?? 0,
          addressInfo: buildAddressInfoPayload(
            values.region,
            values.profile?.detailAddress as string | undefined,
          ),
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
        const addr = editData.profile?.addressInfo;
        form.setFieldsValue({
          username: editData.username,
          roles: editData.roles?.map((r: UserRole) => r.id),
          profile: {
            avatar: editData.profile?.avatar,
            gender: editData.profile?.gender ?? 0,
            detailAddress: addr?.detailAddress,
          },
          region: extractRegionValue(addr),
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
          rules={[
            { required: true, message: '请输入用户名' },
            {
              min: USERNAME_MIN_LENGTH,
              max: USERNAME_MAX_LENGTH,
              message: `用户名长度必须在 ${USERNAME_MIN_LENGTH} 到 ${USERNAME_MAX_LENGTH} 个字符之间`,
            },
          ]}
        >
          <Input
            placeholder={`请输入${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH}位用户名`}
            maxLength={USERNAME_MAX_LENGTH}
          />
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

        <Form.Item name="region" label="省市区">
          <RegionCascader placeholder="请选择省市区" />
        </Form.Item>

        <Form.Item name={['profile', 'detailAddress']} label="详细地址">
          <Input.TextArea placeholder="请输入详细门牌号等" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
