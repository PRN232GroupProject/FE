import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './components/layouts/StudentLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/Student/HomePage';
import ProfilePage from './pages/Student/ProfilePage';
import { useAuthStore } from './stores/authStore';

// Lazy load các pages khác
const LessonListPage = React.lazy(() => import('./pages/Student/LessonListPage'));
const LessonPage = React.lazy(() => import('./pages/Student/LessonPage'));
const TestListPage = React.lazy(() => import('./pages/Student/TestListPage'));
const TestSessionPage = React.lazy(() => import('./pages/Student/TestSessionPage'));
const TestResultPage = React.lazy(() => import('./pages/Student/TestResultPage'));
const ResourcesPage = React.lazy(() => import('./pages/Student/ResourcesPage'));
const StudentResultsPage = React.lazy(() => import('./pages/Student/StudentResultsPage'));

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes với StudentLayout */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonListPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/tests" element={<TestListPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Route>

        {/* Auth routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        {/* Protected student routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/results" element={<StudentResultsPage />} />
            <Route path="/test/:testId" element={<TestSessionPage />} />
            <Route path="/sessions/:sessionId/results" element={<TestResultPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;