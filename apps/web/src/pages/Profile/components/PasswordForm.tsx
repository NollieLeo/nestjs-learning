import { Form, Input, Button, message } from 'antd';
import { useRequest } from 'ahooks';
import { updateMyPassword } from '@/services';
import type { UpdatePasswordRequest } from '@nestjs-learning/shared';
import { useAuthStore } from '@/stores';

export default function PasswordForm() {
  const [pwdForm] = Form.useForm();
  const { logout } = useAuthStore();

  const { runAsync: onUpdatePassword, loading: pwdLoading } = useRequest(
    async (values: UpdatePasswordRequest) => {
      await updateMyPassword(values);
      message.success('密码修改成功，请重新登录');
      pwdForm.resetFields();
      logout();
    },
    { manual: true },
  );

  return (
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
        <Button type="primary" danger htmlType="submit" loading={pwdLoading}>
          确认修改密码
        </Button>
      </Form.Item>
    </Form>
  );
}
