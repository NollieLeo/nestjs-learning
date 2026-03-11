import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores';

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
