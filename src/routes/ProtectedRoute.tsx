import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Nếu user không có quyền, đá về trang chính của họ
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;