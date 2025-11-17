import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Stack,
  CircularProgress,
} from '@mui/material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone?: string;
  grade?: string;
}

interface ProfileFormProps {
  isEditing: boolean;
  loading: boolean;
  grade: string;
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const gradeLevels = [
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi Đại học' },
];

const ProfileForm: React.FC<ProfileFormProps> = ({
  isEditing,
  loading,
  grade,
  register,
  errors,
  onEdit,
  onCancel,
  onSubmit,
}) => {
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

          {/* Grade */}
          <FormControl fullWidth disabled={!isEditing} error={!!errors.grade}>
            <InputLabel id="grade-label">Lớp</InputLabel>
            <Select
              labelId="grade-label"
              label="Lớp"
              {...register('grade')}
              defaultValue={grade}
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 0.5, mr: 1 }}>
                  <SchoolIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              }
            >
              {gradeLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Action Buttons */}
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