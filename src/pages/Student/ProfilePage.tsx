import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { Box, Alert } from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/shared/PageHeader';
import ProfileAvatar from './components/profile/ProfileAvatar';
import ProfileStatsCard from './components/profile/ProfileStateCard';
import ProfileForm, { type ProfileFormData } from './components/profile/ProfileForm';

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
    .optional()
    .or(z.literal('')),
  grade: z.string().optional(),
});

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

  const [profileData, setProfileData] = useState<IUserProfile>({
    id: user?.id || 1,
    fullName: user?.fullName || 'Nguyễn Văn An',
    email: user?.email || 'student@example.com',
    phone: '0123456789',
    grade: '11',
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
    //   const response = await userService.updateProfile(profileData.id, {
    //      ...data,
    //      grade: parseInt(data.grade) // Chuyển '11' về 11
    //    });
    //   setProfileData({ ...profileData, ...response.data });
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

  const statsData = [
    {
      icon: SchoolIcon,
      value: profileData.totalTests,
      label: 'Tổng số bài thi',
      color: '#FF6C00',
      iconColor: 'primary.main',
    },
    {
      icon: CheckCircleIcon,
      value: profileData.completedTests,
      label: 'Đã hoàn thành',
      color: '#4CAF50',
      iconColor: 'success.main',
    },
    {
      icon: AssessmentIcon,
      value: profileData.averageScore,
      label: 'Điểm trung bình',
      color: '#0055A5',
      iconColor: 'secondary.main',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Thông tin cá nhân"
        subtitle="Quản lý thông tin và theo dõi tiến độ học tập của bạn"
      />

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

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          md: '1fr 2fr',
        }}
      >
        {/* Avatar Card */}
        <ProfileAvatar
          fullName={profileData.fullName}
          role={profileData.role}
          joinedDate={profileData.joinedDate}
        />

        {/* Stats & Form */}
        <Box>
          {/* Stats Cards */}
          <Box
            display="grid"
            gap={2}
            sx={{ mb: 3 }}
            gridTemplateColumns={{
              xs: '1fr',
              sm: '1fr 1fr 1fr',
            }}
          >
            {statsData.map((stat, index) => (
              <ProfileStatsCard
                key={index}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                color={stat.color}
                iconColor={stat.iconColor}
              />
            ))}
          </Box>

          {/* Profile Form */}
          <ProfileForm
            isEditing={isEditing}
            loading={loading}
            grade={profileData.grade}
            register={register}
            errors={errors}
            onEdit={() => setIsEditing(true)}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;