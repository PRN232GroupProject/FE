import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/features/auth.service';
import { userService } from '../services/features/user.service';
import LoadingSpinner from '../components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'admin' | 'staff')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await userService.getCurrentUser();
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && userRole) {
    const role = userRole.toLowerCase() as 'student' | 'admin' | 'staff';
    
    console.log('🔐 ProtectedRoute - User role:', role);
    console.log('🔐 ProtectedRoute - Allowed roles:', allowedRoles);
    
    if (!allowedRoles.includes(role)) {
      console.log('❌ Access denied - redirecting...');
      // Redirect based on user's actual role
      if (role === 'admin') {
        return <Navigate to="/admin/questions" replace />;
      } else if (role === 'staff') {
        return <Navigate to="/staff/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;