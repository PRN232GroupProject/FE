import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { IUser } from '../../../../types/user.types';

interface StaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingStaff: IUser | null;
}

const StaffDialog: React.FC<StaffDialogProps> = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, control } = useForm();

  useEffect(() => {
    if (open) {
      reset({
        fullName: '',
        email: '',
        password: '',
        role: 1 
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: any) => {
    const payload = {
        ...data,
        role: Number(data.role)
    };
    onSubmit(payload);
  };

  // Style để xóa nền xám/xanh của trình duyệt khi autofill
  const noAutofillStyle = {
    '& .MuiInputBase-input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px white inset', // Đè màu nền trắng lên
      WebkitTextFillColor: 'inherit',
      transition: 'background-color 5000s ease-in-out 0s', // Trì hoãn việc đổi màu nền
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Thêm autoComplete="off" vào form để giảm thiểu gợi ý */}
      <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
        <DialogTitle>Tạo tài khoản mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
                label="Họ và tên" 
                fullWidth 
                required 
                {...register('fullName')} 
                placeholder="Nhập họ và tên"
            />

            <TextField 
                label="Email" 
                type="email" 
                fullWidth 
                required 
                {...register('email')} 
                placeholder="example@gmail.com"
                // Chặn autofill email
                autoComplete="off"
                // Áp dụng style xóa nền
                sx={noAutofillStyle}
            />
            
            <TextField 
                label="Mật khẩu" 
                type="password" 
                fullWidth 
                required 
                {...register('password')} 
                placeholder="Nhập mật khẩu"
                // Quan trọng: new-password ngăn trình duyệt điền pass cũ
                autoComplete="new-password"
                sx={noAutofillStyle}
            />

            <Controller
              name="role"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <TextField 
                    {...field}
                    select 
                    label="Vai trò" 
                    fullWidth 
                    required
                >
                    <MenuItem value={2}>Admin</MenuItem>
                    <MenuItem value={1}>Staff</MenuItem>
                    <MenuItem value={3}>Student</MenuItem>
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained">Lưu</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default StaffDialog;