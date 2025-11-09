import { Routes, Route } from 'react-router-dom';

// Auth & Layouts
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';


// Student Pages
import HomePage from './pages/Student/HomePage';
import LessonPage from './pages/Student/LessonPage';
import TestSessionPage from './pages/Student/TestSessionPage';
import TestResultPage from './pages/Student/TestResultPage';



function App() {
  return (
    <Routes>
      {/* Trang Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- Luồng STUDENT --- */}
      {/* Route 1 (Cha): Kiểm tra quyền 'student'. Nếu OK, render <Outlet /> 
      */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        {/* Route 2 (Con): Hiển thị layout (thanh navbar, v.v.). 
          Bản thân nó cũng render <Outlet /> để hiển thị nội dung trang
        */}
        <Route element={<StudentLayout />}>
          {/* Route 3 (Cháu): Đây là các trang nội dung thực tế
          */}
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/test/:testId" element={<TestSessionPage />} />
          <Route path="/sessions/:sessionId/results" element={<TestResultPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;