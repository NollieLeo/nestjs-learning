import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { RoleEnum } from '@nestjs-learning/shared';
import { Result, Button } from 'antd';

interface RoleGuardProps {
  children: ReactNode;
  requireRoles: RoleEnum[];
}

export default function RoleGuard({ children, requireRoles }: RoleGuardProps) {
  const { hasRole } = usePermissions();

  const hasPermission = requireRoles.some((role) => hasRole(role));

  if (!hasPermission) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您无权访问此页面。"
        extra={
          <Button type="primary" onClick={() => (window.location.href = '/')}>
            返回工作台
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
