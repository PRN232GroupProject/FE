import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './components/layouts/StudentLayout';
import AdminLayout from './components/layouts/AdminLayout';
import StaffLayout from './components/layouts/StaffLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/Student/HomePage';
import ProfilePage from './pages/Student/ProfilePage';
import ContentManagementPage from './pages/Staff/ContentManagementPage';
import ResourceManagementPage from './pages/Staff/ResourceManagementPage';
import DashboardPage from './pages/Staff/DashboardPage';
import { authService } from './services/features/auth.service';
import { userService } from './services/features/user.service';
import type { IUser } from './types/user.types';

const LessonListPage = React.lazy(() => import('./pages/Student/LessonListPage'));
const LessonPage = React.lazy(() => import('./pages/Student/LessonPage'));
const TestListPage = React.lazy(() => import('./pages/Student/TestListPage'));
const TestSessionPage = React.lazy(() => import('./pages/Student/TestSessionPage'));
const TestResultPage = React.lazy(() => import('./pages/Student/TestResultPage'));
const ResourcesPage = React.lazy(() => import('./pages/Student/ResourcesPage'));
const StudentResultsPage = React.lazy(() => import('./pages/Student/StudentResultsPage'));

const AdminDashboard = React.lazy(() => import('./pages/Admin/DashBoardPage'));
const AdminUserList = React.lazy(() => import('./pages/Admin/UserManagementPage'));
const AdminLessonList = React.lazy(() => import('./pages/Admin/LessonManagementPage'));
const AdminTestList = React.lazy(() => import('./pages/Admin/TestManagementPage'));

const App: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const response = await userService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<StudentLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonListPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/tests" element={<TestListPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Route>

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={user?.role.toLowerCase() === 'admin' ? '/admin' : '/'} replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/results" element={<StudentResultsPage />} />
            <Route path="/test/:testId" element={<TestSessionPage />} />
            <Route path="/sessions/:sessionId/results" element={<TestResultPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="lessons" element={<AdminLessonList />} />
            <Route path="tests" element={<AdminTestList />} />
          </Route>
        </Route>

        {/* Protected staff routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/dashboard" element={<DashboardPage />} />
            <Route path="/staff/content" element={<ContentManagementPage />} />
            <Route path="/staff/resources" element={<ResourceManagementPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;