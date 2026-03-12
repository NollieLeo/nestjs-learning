import { Outlet, useNavigate, useLocation } from 'react-router';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { usePermissions } from '@/hooks/usePermissions';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import styles from './AdminLayout.module.scss';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, userInfo } = useAuthStore();
  const { isAdmin } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className={styles.layoutContainer}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className={styles.logo}>{collapsed ? 'Logo' : 'Admin System'}</div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: '/',
              icon: <DashboardOutlined />,
              label: '工作台',
            },
            ...(isAdmin
              ? [
                  {
                    key: '/users',
                    icon: <UserOutlined />,
                    label: '用户管理',
                  },
                  {
                    key: '/roles',
                    icon: <SafetyCertificateOutlined />,
                    label: '角色管理',
                  },
                ]
              : []),
          ]}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseButton}
          />
          <div className={styles.headerRight}>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <span className={styles.action}>
                <Space>
                  <Avatar
                    src={userInfo?.avatar}
                    icon={!userInfo?.avatar && <UserOutlined />}
                  />
                  <span>{userInfo?.username || 'User'}</span>
                </Space>
              </span>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <GlobalErrorBoundary>
            {/* 子路由占位符 */}
            <Outlet />
          </GlobalErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}
