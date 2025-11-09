import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../store/authStore';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack,
  alpha,
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
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số').optional().or(z.literal('')),
  grade: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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
  
  // PHẦN TÍCH HỢP API - Data mẫu
  const [profileData, setProfileData] = useState<IUserProfile>({
    id: user?.id || 1,
    fullName: user?.fullName || 'Nguyễn Văn An',
    email: user?.email || 'student@example.com',
    phone: '0123456789',
    grade: 'Lớp 11',
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

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
    // try {
    //   const response = await userService.updateProfile(profileData.id, data);
    //   setProfileData({ ...profileData, ...data });
    //   setSuccess(true);
    //   setIsEditing(false);
    // } catch (err: any) {
    //   setError(err.response?.data?.message || 'Cập nhật thất bại');
    // } finally {
    //   setLoading(false);
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
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha('#0055A5', 0.9)} 100%)`,
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

      <Grid container spacing={3}>
        {/* Thông tin cơ bản */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3 }}>
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
        </Grid>

        {/* Thống kê */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card 
                elevation={3}
                sx={{
                  background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.1)}, ${alpha('#FF6C00', 0.2)})`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {profileData.totalTests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số bài thi
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card 
                elevation={3}
                sx={{
                  background: `linear-gradient(135deg, ${alpha('#4CAF50', 0.1)}, ${alpha('#4CAF50', 0.2)})`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {profileData.completedTests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã hoàn thành
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card 
                elevation={3}
                sx={{
                  background: `linear-gradient(135deg, ${alpha('#0055A5', 0.1)}, ${alpha('#0055A5', 0.2)})`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    {profileData.averageScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Điểm trung bình
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Form chỉnh sửa */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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

            {