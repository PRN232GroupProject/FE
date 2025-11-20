import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const userRole = user.role.toLowerCase();
    
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;