import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // <-- Thêm 'Link'
import { authService } from '../../services/features/auth.service';
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
  Link, // <-- Thêm MUI Link
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
      
      // Store token and role
      authService.setToken(token);
      localStorage.setItem('role', typeof role === 'string' ? role : String(role));
      
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
              Chào mừng đến với Nền tảng Học Hóa học BinBin
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
        </Paper>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: 'white', opacity: 0.9 }}
        >
          © 2025 BinBin Corporation. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;