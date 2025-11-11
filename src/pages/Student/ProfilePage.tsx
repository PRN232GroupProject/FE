import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../store/authStore';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.email('Email không hợp lệ'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
    .optional()
    .or(z.literal('')),
  grade: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Dùng chung list này với RegisterPage
const gradeLevels = [
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi Đại học' },
];

// Interface này mô phỏng dữ liệu trả về từ API /api/profile/me
interface IUserProfile extends ProfileFormData {
  id: number;
  role: string;
  joinedDate: string;
  totalTests: number;
  completedTests: number;
  averageScore: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data mẫu
  const [profileData, setProfileData] = useState<IUserProfile>({
    id: user?.id || 1,
    fullName: user?.fullName || 'Nguyễn Văn An',
    email: user?.email || 'student@example.com',
    phone: '0123456789',
    grade: '11', // Sửa thành string để khớp với <Select>
    role: user?.role || 'student',
    joinedDate: '2024-09-01',
    totalTests: 15,
    completedTests: 12,
    averageScore: 8.5,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      grade: profileData.grade,
    },
  });

  // Đồng bộ form khi data API thay đổi
  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        grade: profileData.grade,
      });
    }
  }, [profileData, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
    // try {
    //   const response = await userService.updateProfile(profileData.id, {
    //      ...data,
    //      grade: parseInt(data.grade) // Chuyển '11' về 11
    //    });
    //   setProfileData({ ...profileData, ...response.data });
    //   setSuccess(true);
    //   setIsEditing(false);
    // } catch (err: any) {
    //   setError(err.response?.data?.message || 'Cập nhật thất bại');
    // } finally {
    //   setLoading(false);
    // }

    // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
    setTimeout(() => {
      setProfileData({ ...profileData, ...data });
      setSuccess(true);
      setIsEditing(false);
      setLoading(false);
    }, 1000);
    // ---- HẾT DỮ LIỆU CỨNG ----
  };

  const handleCancel = () => {
    // Reset về giá trị đã lưu (profileData)
    reset({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      grade: profileData.grade,
    });
    setIsEditing(false);
    setError(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha(
            '#0055A5',
            0.9,
          )} 100%)`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Thông tin cá nhân
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95 }}>
          Quản lý thông tin và theo dõi tiến độ học tập của bạn
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          Cập nhật thông tin thành công!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* === SỬA LỖI GRID: Dùng <Box display="grid"> === */}
      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          md: '1fr 2fr',
        }}
      >
        {/* Thông tin cơ bản */}
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3 }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '3rem',
              fontWeight: 700,
              boxShadow: 4,
            }}
          >
            {getInitials(profileData.fullName)}
          </Avatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {profileData.fullName}
          </Typography>
          <Chip
            label={profileData.role === 'student' ? 'Học sinh' : 'Quản trị viên'}
            color="primary"
            sx={{ mb: 2, fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary">
            Tham gia từ: {new Date(profileData.joinedDate).toLocaleDateString('vi-VN')}
          </Typography>
        </Paper>

        {/* Thống kê & Form */}
        <Box>
          {/* === SỬA LỖI GRID: Thống kê === */}
          <Box
            display="grid"
            gap={2}
            sx={{ mb: 3 }}
            gridTemplateColumns={{
              xs: '1fr',
              sm: '1fr 1fr 1fr',
            }}
          >
            {/* Card 1 */}
            <Card
              elevation={3}
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  '#FF6C00',
                  0.1,
                )}, ${alpha('#FF6C00', 0.2)})`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                  {profileData.totalTests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng số bài thi
                </Typography>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card
              elevation={3}
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  '#4CAF50',
                  0.1,
                )}, ${alpha('#4CAF50', 0.2)})`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: 'success.main' }}
                >
                  {profileData.completedTests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã hoàn thành
                </Typography>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card
              elevation={3}
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  '#0055A5',
                  0.1,
                )}, ${alpha('#0055A5', 0.2)})`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: 'secondary.main' }}
                >
                  {profileData.averageScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm trung bình
                </Typography>
              </CardContent>
            </Card>
          </Box>
          {/* === HẾT PHẦN SỬA THỐNG KÊ === */}

          {/* Form chỉnh sửa */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Thông tin chi tiết
              </Typography>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* === SỬA LỖI GRID: Form === */}
              <Box
                display="grid"
                gap={3}
                gridTemplateColumns={{
                  xs: '1fr',
                  sm: '1fr 1fr',
                }}
              >
                {/* Full Name */}
                <TextField
                  label="Họ và tên"
                  fullWidth
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />

                {/* Email */}
                <TextField
                  label="Email"
                  fullWidth
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                {/* Phone */}
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />

                {/* Grade (Đã sửa thành Select) */}
                <FormControl fullWidth disabled={!isEditing} error={!!errors.grade}>
                  <InputLabel id="grade-label">Lớp</InputLabel>
                  <Select
                    labelId="grade-label"
                    label="Lớp"
                    {...register('grade')}
                    defaultValue={profileData.grade}
                    startAdornment={(
                      <InputAdornment position="start" sx={{ ml: 0.5, mr: 1 }}>
                        <SchoolIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )}
                  >
                    {gradeLevels.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Nút bấm khi chỉnh sửa */}
                {isEditing && (
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ gridColumn: { sm: 'span 2' } }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </Stack>
                )}
              </Box>
              {/* === HẾT PHẦN SỬA FORM === */}
            </form>
          </Paper>
        </Box>
      </Box>
      {/* === HẾT PHẦN SỬA LAYOUT CHÍNH === */}
    </Box>
  );
};

export default ProfilePage;