import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { useAuthStore } from '../store/authStore';

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nền tảng Học Hóa học
          </Typography>
          <Typography sx={{ mr: 2 }}>Chào, {user?.fullName}</Typography>
          <Button color="inherit" onClick={logout}>Đăng xuất</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet /> {/* Đây là nơi các trang con sẽ render */}
      </Container>
    </>
  );
};

export default StudentLayout;