import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './components/layouts/StudentLayout';
import AdminLayout from './components/layouts/AdminLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/Student/HomePage';
import ProfilePage from './pages/Student/ProfilePage';
import { useAuthStore } from './stores/authStore';

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
  const { isAuthenticated, user } = useAuthStore();

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;