import { useNavigate, Link } from 'react-router';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { register } from '@/services/auth';
import type { RegisterRequest } from '@nestjs-learning/shared';
import styles from './Register.module.scss';

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();

  const { run: handleRegister, loading } = useRequest(
    async (values: RegisterForm) => {
      const payload: RegisterRequest = {
        username: values.username,
        password: values.password,
      };
      const { data } = await register(payload);
      return data;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('注册成功，请登录');
        navigate('/login');
      },
    },
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>创建账号</h1>
        <p className={styles.subtitle}>注册一个新账号</p>
        <Form onFinish={handleRegister} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          已有账号？<Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
}
