import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // <-- Thêm 'Link'
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/features/auth.service';
import { userService } from '../../services/features/user.service';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  alpha,
  Stack,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import AuthLayout from '../../components/layouts/AuthLayout';

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

    try {
      // Login and get token and role
      const response = await authService.login(data);
      const { token, role } = response.data;
      
      // Store token and role in auth service
      authService.setToken(token);
      localStorage.setItem('role', typeof role === 'string' ? role : String(role));
      
      // Fetch complete user data from the API
      const userResponse = await userService.getCurrentUser();
      const user = userResponse.data;
      
      // Store user data in zustand store
      loginToStore(token, user);
      
      // Navigate to homepage
      navigate('/');
    } catch (err: any) {
      console.error("Đăng nhập thất bại", err);
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng đến với Nền tảng Học Hóa học BinBin"
    >
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              px: 0.5,
            }}
          >
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Bạn chưa có tài khoản?
            </Link>

            <Link
              component={RouterLink}
              to="#"
              variant="body2"
              sx={{
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': {
                  textDecoration: 'underline',
                },
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
              {/* === SỬA BỐ CỤC LINK === */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  px: 0.5,
                }}
              >
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Bạn chưa có tài khoản?
                </Link>
                
                <Link
                  component={RouterLink}
                  to="#" // Đổi '#' thành '/forgot-password' nếu bạn có trang đó
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </Box>
              {/* === HẾT PHẦN SỬA === */}

              {/* <Box
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
              </Box> */}
            </Stack>
          </Box>

          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              bgcolor: alpha('#0055A5', 0.05),
              borderRadius: 2,
            }}
          >
            <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
              Tài khoản demo
            </Box>
            <Box component="span" sx={{ display: 'block', fontWeight: 600, fontSize: '0.875rem' }}>
              student@example.com | admin@example.com
            </Box>
            <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}>
              Mật khẩu: 123456
            </Box>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;