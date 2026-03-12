import { Form, Input, Button, message, Radio } from 'antd';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import { getProfile, updateMyProfile } from '@/services';
import { useAuthStore } from '@/stores';
import type { User } from '@nestjs-learning/shared';
import { RegionCascader, RegionValue } from '@/components/RegionCascader';
import { buildAddressInfoPayload, extractRegionValue } from '@/utils/address';

export default function ProfileForm() {
  const [form] = Form.useForm();
  const { userInfo, setUserInfo } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  const { loading: initLoading } = useRequest(
    async () => {
      const res = await getProfile();
      return res.data;
    },
    {
      onSuccess: (data) => {
        setUser(data);
        form.setFieldsValue({
          username: data.username,
          profile: {
            avatar: data.profile?.avatar,
            gender: data.profile?.gender ?? 0,
            detailAddress: data.profile?.addressInfo?.detailAddress,
          },
          region: extractRegionValue(data.profile?.addressInfo),
        });
      },
    },
  );

  const { runAsync: onFinish, loading: submitLoading } = useRequest(
    async (values: {
      username: string;
      region?: RegionValue;
      profile?: Record<string, unknown>;
    }) => {
      if (!user) return;

      const updateData = {
        username: values.username,
        profile: {
          avatar: (values.profile?.avatar as string) || '',
          gender: (values.profile?.gender as number) || 0,
          addressInfo: buildAddressInfoPayload(
            values.region,
            values.profile?.detailAddress as string | undefined,
          ),
        },
      };

      await updateMyProfile(updateData);
      message.success('个人信息更新成功');

      setUserInfo({
        ...userInfo!,
        username: values.username,
        avatar: (values.profile?.avatar as string) || '',
        gender: (values.profile?.gender as number) || 0,
      });
    },
    { manual: true },
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ profile: { gender: 0 } }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input disabled />
      </Form.Item>

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

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitLoading}
          disabled={initLoading}
        >
          保存更改
        </Button>
      </Form.Item>
    </Form>
  );
}
