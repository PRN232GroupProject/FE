import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { IUser } from '../../types/user.types';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

// Định nghĩa validation schema
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.loginToStore);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log('Đang gửi dữ liệu đăng nhập:', data);
    setLoading(true);
    setError(null);

    // PHẦN TÍCH HỢP API (SẼ MỞ COMMENT KHI BE SẴN SÀNG)
    // try {
    //   // Giả sử bạn có authService
    //   // const response = await authService.login(data.email, data.password);
    //   // const { token, user } = response.data; // Lấy từ response chuẩn
    //   loginToStore(token, user); 
    //   navigate('/'); // Chuyển hướng đến trang chủ Student
    // } catch (err: any) {
    //   console.error("Đăng nhập thất bại", err);
    //   setError(err.response?.data?.message || 'Đăng nhập thất bại');
    // } finally {
    //   setLoading(false);
    // }

    // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
    setTimeout(() => {
      // Giả lập logic: nếu email có "admin" thì là admin
      const isStudent = !data.email.includes('admin');
      
      const fakeUser: IUser = isStudent
        ? { id: 1, fullName: 'Nguyễn Văn An', email: data.email, role: 'student' }
        : { id: 99, fullName: 'Quản Trị Viên', email: data.email, role: 'admin' };
      
      const fakeToken = 'fake-jwt-token-123456';
      
      loginToStore(fakeToken, fakeUser);
      setLoading(false);
      
      // Chuyển hướng dựa trên role
      if (fakeUser.role === 'student') {
        navigate('/');
      } else {
        navigate('/admin/questions'); // (Sẽ làm route này sau)
      }
    }, 1000);
    // ---- HẾT DỮ LIỆU CỨNG ----
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Địa chỉ Email"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;