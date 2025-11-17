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
import { useCurrentUser, useUpdateProfile } from '../../hooks/useUser';
import { useTestHistory } from '../../hooks/useTestData';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';

// Validation schema (Không có phone, không có grade)
const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
});

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hook lấy thông tin user hiện tại
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useCurrentUser();

  // Hook lấy lịch sử (để hiển thị stats)
  // ⚠️ Endpoint này là GIẢ ĐỊNH, nhưng hook đã sẵn sàng
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
  } = useTestHistory(user?.id || 0);

  // Hook cập nhật thông tin
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateProfile();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Effect: Tải dữ liệu từ API vào form khi có
  useEffect(() => {
    if (currentUser) {
      reset({
        fullName: currentUser.fullName,
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  // Hàm xử lý khi submit form
  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setError(null);
    setSuccess(null);
    if (!currentUser) return;

    try {
      await updateUser(data);
      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại');
    }
  };

  // Hàm xử lý khi bấm Hủy
  const handleCancel = () => {
    if (currentUser) {
      reset({
        fullName: currentUser.fullName,
        email: currentUser.email,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  // Xử lý trạng thái Loading
  if (isLoadingUser || isLoadingHistory) {
    return <LoadingSpinner />;
  }

  // Xử lý trạng thái Error
  if (isErrorUser || isErrorHistory || !currentUser) {
    return (
      <EmptyState
        title="Lỗi"
        description="Không thể tải được thông tin cá nhân. Vui lòng thử lại sau."
      />
    );
  }

  // Chuẩn bị dữ liệu cho thẻ Stats
  const statsData = [
    {
      icon: SchoolIcon,
      value: historyData?.totalTests || 0,
      label: 'Tổng số bài thi',
      color: '#FF6C00',
      iconColor: 'primary.main',
    },
    {
      icon: CheckCircleIcon,
      value: historyData?.completedTests.length || 0,
      label: 'Đã hoàn thành',
      color: '#4CAF50',
      iconColor: 'success.main',
    },
    {
      icon: AssessmentIcon,
      value: historyData?.averageScore || 0,
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
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
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
        {/* Cột trái: Avatar */}
        <ProfileAvatar
          fullName={currentUser.fullName}
          role={currentUser.role}
          joinedDate={currentUser.createdAt}
        />

        {/* Cột phải: Stats & Form */}
        <Box>
          {/* Thẻ Stats */}
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

          {/* Form thông tin cá nhân */}
          <ProfileForm
            isEditing={isEditing}
            loading={isUpdating}
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