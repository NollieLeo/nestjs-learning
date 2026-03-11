import { Outlet } from 'react-router';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useAuthStore } from '@/stores';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import styles from './AdminLayout.module.scss';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <Layout className={styles.layoutContainer}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className={styles.logo}>{collapsed ? 'Logo' : 'Admin System'}</div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: '工作台',
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: '用户管理',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className={styles.header}
          style={{ background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseButton}
          />
          <div>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
        </Header>
        <Content
          className={styles.content}
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <GlobalErrorBoundary>
            {/* 子路由占位符 */}
            <Outlet />
          </GlobalErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}
