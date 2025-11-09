import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css'; // (Giữ file CSS này nếu bạn có)

// Tạo theme MUI cơ bản
const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Cung cấp theme MUI cho toàn ứng dụng */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Bọc BrowserRouter bên ngoài App */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);