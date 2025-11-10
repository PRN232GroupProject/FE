import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StudentLayout from './layouts/StudentLayout';

// Auth
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';

// Student Pages
import HomePage from './pages/Student/HomePage';
import LessonPage from './pages/Student/LessonPage';
import TestSessionPage from './pages/Student/TestSessionPage';
import TestResultPage from './pages/Student/TestResultPage';
import ProfilePage from './pages/Student/ProfilePage';
import TestListPage from './pages/Student/TestListPage';
import ResourcesPage from './pages/Student/ResourcesPage';

// Import auth store
import { useAuthStore } from './store/authStore';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/tests" element={<TestListPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/test/:testId" element={<TestSessionPage />} />
              <Route path="/sessions/:sessionId/results" element={<TestResultPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            {/* Admin routes sẽ được thêm sau */}
            <Route path="/admin/*" element={<div>Admin Dashboard (Coming Soon)</div>} />
          </Route>

          {/* Catch all - redirect to home or login */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? '/' : '/login'} replace />
            }
          />
        </Routes>
  );
};

export default App;