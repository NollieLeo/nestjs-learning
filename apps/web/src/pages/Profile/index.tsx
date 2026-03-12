import styles from './Profile.module.scss';
import { Form, Input, Button, message, Radio, Divider } from 'antd';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import { getProfile, updateMyProfile, updateMyPassword } from '@/services';
import { useAuthStore } from '@/stores';
import type { User, UpdatePasswordRequest } from '@nestjs-learning/shared';

export default function Profile() {
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();
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
            address: data.profile?.address,
          },
        });
      },
    },
  );

  const { runAsync: onFinish, loading: submitLoading } = useRequest(
    async (values: { username: string; profile?: Record<string, unknown> }) => {
      if (!user) return;

      const updateData = {
        username: values.username,
        profile: {
          avatar: (values.profile?.avatar as string) || '',
          gender: (values.profile?.gender as number) || 0,
          address: (values.profile?.address as string) || '',
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

  const { runAsync: onUpdatePassword, loading: pwdLoading } = useRequest(
    async (values: UpdatePasswordRequest) => {
      await updateMyPassword(values);
      message.success('密码修改成功，请重新登录');
      pwdForm.resetFields();
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    },
    { manual: true },
  );

  return (
    <div className={styles.container}>
      <h2>个人设置</h2>
      <div className={styles.formContainer}>
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

          <Form.Item name={['profile', 'address']} label="联系地址">
            <Input.TextArea placeholder="请输入详细地址" rows={3} />
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

        <Divider style={{ margin: '40px 0' }} />

        <h3>修改密码</h3>
        <Form form={pwdForm} layout="vertical" onFinish={onUpdatePassword}>
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={pwdLoading}
            >
              确认修改密码
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
