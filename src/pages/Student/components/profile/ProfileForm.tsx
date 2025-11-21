import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  InputAdornment,
  Stack,
  CircularProgress,
  IconButton,
} from '@mui/material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

export interface ProfileFormData {
  fullName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ProfileFormProps {
  isEditing: boolean;
  loading: boolean;
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isChangingPassword: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  isEditing,
  loading,
  register,
  errors,
  onEdit,
  onCancel,
  onSubmit,
  isChangingPassword,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
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
          <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
            Chỉnh sửa
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={onSubmit}>
        <Box display="grid" gap={3}>
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

          {/* Email - Read Only */}
          <TextField
            label="Email"
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            {...register('email')}
            helperText="Email không thể thay đổi"
          />

          {/* ✅ Password Section - Only show when editing */}
          {isEditing && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Đổi mật khẩu (tùy chọn)
              </Typography>

              {/* Current Password */}
              <TextField
                label="Mật khẩu hiện tại"
                fullWidth
                type={showCurrentPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('currentPassword')}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
              />

              {/* New Password */}
              <TextField
                label="Mật khẩu mới"
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('newPassword')}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message || 'Tối thiểu 6 ký tự'}
              />

              {/* Confirm Password */}
              <TextField
                label="Xác nhận mật khẩu mới"
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                }
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </Stack>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default ProfileForm;