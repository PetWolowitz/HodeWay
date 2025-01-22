import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  // Temporaneamente disabilitato il redirect per lo sviluppo
  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

  return <>{children}</>;
}