import React from 'react';
import { Paper, Avatar, Typography, Chip } from '@mui/material';

interface ProfileAvatarProps {
  fullName: string;
  role: string;
  joinedDate: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ fullName, role, joinedDate }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ FIX: Role mapping đúng
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'student': 'Học sinh',
      'Student': 'Học sinh',
      'staff': 'Giáo viên',
      'Staff': 'Giáo viên',
      'admin': 'Quản trị viên',
      'Admin': 'Quản trị viên',
    };
    return roleMap[role] || role;
  };

  return (
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
        {getInitials(fullName)}
      </Avatar>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {fullName}
      </Typography>
      <Chip
        label={getRoleLabel(role)}
        color="primary"
        sx={{ mb: 2, fontWeight: 600 }}
      />
      <Typography variant="body2" color="text.secondary">
        Tham gia từ: {new Date(joinedDate).toLocaleDateString('vi-VN')}
      </Typography>
    </Paper>
  );
};

export default ProfileAvatar;