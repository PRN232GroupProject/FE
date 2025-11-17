import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../../services/features/auth.service';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import AuthLayout from '../../components/layouts/AuthLayout';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    console.log('Đang gửi dữ liệu đăng ký:', data);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log('Đăng ký thành công');
      setSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Đăng ký thất bại', err);
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng ký tài khoản" subtitle="Tham gia Nền tảng Học Hóa học">
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr',
          }}
        >
          <TextField
            required
            fullWidth
            label="Họ và tên"
            autoComplete="name"
            autoFocus
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              gridColumn: { sm: 'span 2' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            required
            fullWidth
            label="Địa chỉ Email"
            autoComplete="email"
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
              gridColumn: { sm: 'span 2' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            required
            fullWidth
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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

          <TextField
            required
            fullWidth
            label="Xác nhận mật khẩu"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || success}
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
              <span>Đang tạo tài khoản...</span>
            </Box>
          ) : success ? (
            'Đăng ký thành công!'
          ) : (
            'Đăng ký'
          )}
        </Button>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Đã có tài khoản?
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="text"
            size="small"
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Đăng nhập ngay
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;