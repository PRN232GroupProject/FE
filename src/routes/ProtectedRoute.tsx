import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && user) {
    const userRole = user.role.toLowerCase() as 'student' | 'admin';
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect based on user's actual role
      return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;