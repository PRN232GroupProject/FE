import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { IUser } from '../../types/user.types';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  alpha,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// Định nghĩa validation schema
const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

    // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
    // try {
    //   const response = await authService.login(data.email, data.password);
    //   const { token, user } = response.data;
    //   loginToStore(token, user); 
    //   navigate(user.role === 'student' ? '/' : '/admin/questions');
    // } catch (err: any) {
    //   console.error("Đăng nhập thất bại", err);
    //   setError(err.response?.data?.message || 'Đăng nhập thất bại');
    // } finally {
    //   setLoading(false);
    // }

    // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
    setTimeout(() => {
      const isStudent = !data.email.includes('admin');
      
      const fakeUser: IUser = isStudent
        ? { id: 1, fullName: 'Nguyễn Văn An', email: data.email, role: 'student' }
        : { id: 99, fullName: 'Quản Trị Viên', email: data.email, role: 'admin' };
      
      const fakeToken = 'fake-jwt-token-123456';
      
      loginToStore(fakeToken, fakeUser);
      setLoading(false);
      
      if (fakeUser.role === 'student') {
        navigate('/');
      } else {
        navigate('/admin/questions');
      }
    }, 1500);
    // ---- HẾT DỮ LIỆU CỨNG ----
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha('#0055A5', 0.9)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
        }}
      />

      <Container component="main" maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, #FF6C00, #0055A5)`,
                mb: 2,
              }}
            >
              <SchoolIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              Đăng nhập
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Chào mừng đến với Nền tảng Học Hóa học FPT
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={loading ? null : <ChevronRightIcon />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 3,
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={24} color="inherit" />
                  <span>Đang đăng nhập...</span>
                </Box>
              ) : (
                'Đăng nhập'
              )}
            </Button>

            <Stack spacing={2} sx={{ mt: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  size="small"
                  sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                  Quên mật khẩu?
                </Button>
              </Box>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  bgcolor: alpha('#0055A5', 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Tài khoản demo
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  student@example.com | admin@example.com
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mật khẩu: 123456
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: 'white', opacity: 0.9 }}
        >
          © 2025 EHEHE Corporation. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;