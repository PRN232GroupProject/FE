import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import HomePage from './pages/Student/HomePage';
import LessonPage from './pages/Student/LessonPage';
import TestSessionPage from './pages/Student/TestSessionPage';
import TestResultPage from './pages/Student/TestResultPage';
import ProtectedRoute from './routes/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';

// (Chúng ta sẽ thêm Admin routes sau)

function App() {
  return (
    <Routes>
      {/* Trang Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- Luồng STUDENT --- */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/test/:testId" element={<TestSessionPage />} />
        <Route path="/sessions/:sessionId/results" element={<TestResultPage />} />
      </Route>

      {/* --- Luồng ADMIN (Sẽ thêm sau) --- */}
      {/* <Route path="/admin" ... /> */}

    </Routes>
  );
}

export default App;