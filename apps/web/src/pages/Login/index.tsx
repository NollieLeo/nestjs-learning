import { useNavigate, Link, useLocation } from 'react-router';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { login } from '@/services';
import type { LoginRequest } from '@nestjs-learning/shared';
import { useAuthStore } from '@/stores';
import styles from './Login.module.scss';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useAuthStore((state) => state.setToken);

  // 获取原本想访问的页面，如果没有则默认跳转到首页
  const from = location.state?.from?.pathname || '/';

  // 使用 ahooks 封装请求，自动管理 loading 和防抖
  const { run: handleLogin, loading } = useRequest(
    async (values: LoginRequest) => {
      const { data } = await login(values);
      return data;
    },
    {
      manual: true,
      onSuccess: (data) => {
        setToken(data.access_token);
        message.success('登录成功');
        navigate(from, { replace: true });
      },
    },
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>欢迎回来</h1>
        <p className={styles.subtitle}>登录你的账号</p>
        <Form onFinish={handleLogin} size="large">
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          还没有账号？<Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
}
