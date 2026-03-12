import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import AuthGuard from '@/components/AuthGuard';
import GuestGuard from '@/components/GuestGuard';
import RoleGuard from '@/components/RoleGuard';
import { RoleEnum } from '@nestjs-learning/shared';
import AdminLayout from '@/layouts/AdminLayout';
import styles from './router.module.scss';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Home = lazy(() => import('@/pages/Home'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const RoleManagement = lazy(() => import('@/pages/RoleManagement'));
const Profile = lazy(() => import('@/pages/Profile'));

// 全局的懒加载 Loading 过渡组件
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className={styles.suspenseContainer}>
        <Spin size="large" />
      </div>
    }
  >
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <RoleGuard requireRoles={[RoleEnum.ADMIN]}>
            <SuspenseWrapper>
              <UserManagement />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: 'roles',
        element: (
          <RoleGuard requireRoles={[RoleEnum.ADMIN]}>
            <SuspenseWrapper>
              <RoleManagement />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <Profile />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestGuard>
        <SuspenseWrapper>
          <Login />
        </SuspenseWrapper>
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <SuspenseWrapper>
          <Register />
        </SuspenseWrapper>
      </GuestGuard>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
