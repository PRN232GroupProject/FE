import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
  Class as ClassIcon,
} from '@mui/icons-material';

// ... (Schema và Type không đổi) ...
const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.email('Email không hợp lệ'),
  grade: z.string().min(1, 'Vui lòng chọn khối lớp'), // Dùng string cho Select
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'], // Gán lỗi này cho trường confirmPassword
});

type RegisterFormData = z.infer<typeof registerSchema>;

const gradeLevels = [
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi Đại học' }, // Dùng 13 cho "Ôn thi"
];


const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.loginToStore);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    setError(null);

    // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
    // try {
    //   const response = await authService.register({
    //     fullName: data.fullName,
    //     email: data.email,
    //     password: data.password,
    //     grade: parseInt(data.grade) // Chuyển '11' về 11
    //   });
    //   const { token, user } = response.data;
    //   loginToStore(token, user); 
    //   navigate('/'); // Đăng ký thành công thì vào trang chủ
    // } catch (err: any) {
    //   console.error("Đăng ký thất bại", err);
    //   setError(err.response?.data?.message || 'Đăng ký thất bại');
    // } finally {
    //   setLoading(false);
    // }

    // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
    console.log('Đang gửi dữ liệu đăng ký:', data);
    setTimeout(() => {
      const fakeUser: IUser = {
        id: 2,
        fullName: data.fullName,
        email: data.email,
        role: 'student',
      };
      const fakeToken = 'fake-jwt-token-987654';
      
      loginToStore(fakeToken, fakeUser);
      setLoading(false);
      navigate('/');
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
        py: 4,
      }}
    >
      <Container component="main" maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
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
              Đăng ký tài khoản
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tham gia Nền tảng Học Hóa học FPT
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* === SỬA LỖI GRID (LỖI TRONG HÌNH): Thay <Grid container> bằng <Box display="grid"> === */}
            <Box
              display="grid"
              gap={2} // Tương đương spacing={2}
              gridTemplateColumns={{
                xs: '1fr',
                sm: '1fr 1fr', // 2 cột
              }}
            >
              {/* Họ và tên (Không cần <Grid item>) */}
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
              />

              {/* Email (Không cần <Grid item>) */}
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
              />

              {/* Khối lớp (Chiếm 2 cột) */}
              <FormControl
                fullWidth
                required
                error={!!errors.grade}
                sx={{ gridColumn: { sm: 'span 2' } }} // <-- Chiếm 2 cột
              >
                <InputLabel id="grade-label">Khối lớp của bạn</InputLabel>
                <Select
                  labelId="grade-label"
                  label="Khối lớp của bạn"
                  defaultValue=""
                  disabled={loading}
                  {...register('grade')}
                  startAdornment={(
                    <InputAdornment position="start" sx={{ ml: 0.5, mr: 1 }}>
                      <ClassIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )}
                >
                  {gradeLevels.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.grade && (
                  <Typography variant="caption" color="error.main" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.grade.message}
                  </Typography>
                )}
              </FormControl>

              {/* Mật khẩu (Không cần <Grid item>) */}
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
              />
              
              {/* Xác nhận Mật khẩu (Không cần <Grid item>) */}
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
              />
            </Box>
            {/* === HẾT PHẦN SỬA LỖI GRID === */}

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
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={24} color="inherit" />
                  <span>Đang tạo tài khoản...</span>
                </Box>
              ) : (
                'Đăng ký'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Đã có tài khoản?{' '}
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="text"
                  size="small"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Đăng nhập ngay
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;