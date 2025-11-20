import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';

interface StaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const StaffDialog: React.FC<StaffDialogProps> = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  // Reset form mỗi khi mở dialog (chế độ tạo mới)
  useEffect(() => {
    if (open) {
      reset({
        fullName: '',
        email: '',
        password: '',
        role: 1 // Default Staff
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            />
            
            <TextField 
                label="Mật khẩu" 
                type="password" 
                fullWidth 
                required 
                {...register('password')} 
                placeholder="Nhập mật khẩu"
            />

            <TextField 
                select 
                label="Vai trò" 
                defaultValue={1} 
                fullWidth 
                required
                {...register('role')}
            >
                <MenuItem value={2}>Admin</MenuItem>
                <MenuItem value={1}>Staff</MenuItem>
                <MenuItem value={3}>Student</MenuItem>
            </TextField>
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