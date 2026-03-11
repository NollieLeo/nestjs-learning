import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
import styles from './GlobalErrorBoundary.module.scss';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className={styles.errorFallbackContainer}>
      <Result
        status="500"
        title="系统开小差了"
        subTitle={errorMessage || '抱歉，页面渲染时发生了一些错误。'}
        extra={[
          <Button type="primary" key="retry" onClick={resetErrorBoundary}>
            重试
          </Button>,
          <Button
            key="home"
            onClick={() => {
              resetErrorBoundary();
              navigate('/');
            }}
          >
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
}

export default function GlobalErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}
