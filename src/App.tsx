import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StudentLayout from './layouts/StudentLayout';

// Auth
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage'; 
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import HomePage from './pages/Student/HomePage';
import LessonPage from './pages/Student/LessonPage';
import TestSessionPage from './pages/Student/TestSessionPage';
import TestResultPage from './pages/Student/TestResultPage';
import ProfilePage from './pages/Student/ProfilePage';
import TestListPage from './pages/Student/TestListPage';
import ResourcesPage from './pages/Student/ResourcesPage';
import LessonListPage from './pages/Student/LessonListPage';
import StudentResultsPage from './pages/Student/StudentResultsPage';

// Import auth store
import { useAuthStore } from './store/authStore';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
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
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        }
      />

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<StudentLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/results" element={<StudentResultsPage />} />
          <Route path="/test/:testId" element={<TestSessionPage />} />
          <Route path="/sessions/:sessionId/results" element={<TestResultPage />} />
        </Route>
      </Route>

      {/* === CÁC ROUTE CẦN BẢO VỆ (CHO ADMIN) === */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        {/* Admin routes sẽ được thêm sau */}
        <Route path="/admin/*" element={<div>Admin Dashboard (Coming Soon)</div>} />
      </Route>
      
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default App;