import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Stack, Box, Typography, Chip } from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import type { IUser } from '../../../../types/user.types';

interface StudentDetailDialogProps {
  user: IUser | null;
  onClose: () => void;
}

const StudentDetailDialog: React.FC<StudentDetailDialogProps> = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <Dialog open={!!user} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        Thông tin Học sinh
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Person sx={{ fontSize: 40, color: 'text.secondary' }} />
            <Box>
              <Typography variant="h6">{user.fullName}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Ngày tham gia:</Typography>
            <Typography>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Trạng thái:</Typography>
            <Chip label={user.isActive ? "Hoạt động" : "Đã khóa"} color={user.isActive ? "success" : "error"} size="small" />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
export default StudentDetailDialog;