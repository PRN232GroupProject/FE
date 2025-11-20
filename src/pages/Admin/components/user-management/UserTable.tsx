import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Box, Avatar, Typography } from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import type { IUser } from '../../../../types/user.types';

interface UserTableProps {
  users: IUser[];
  onViewUser: (user: IUser) => void; // Hàm xem chi tiết chung cho mọi role
  onDeleteUser: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onViewUser, onDeleteUser }) => {
  
  const getRoleConfig = (role: string) => {
    const r = role.toLowerCase();
    // Admin: Xanh dương nhạt (info)
    if (r === 'admin') return { color: 'info', label: 'Admin' };
    // Student: Cam (secondary)
    if (r === 'student') return { color: 'secondary', label: 'Student' };
    // Staff: Xanh lá (success)
    if (r === 'staff') return { color: 'success', label: 'Staff' };
    
    return { color: 'default', label: role };
  };

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #E0E0E0' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Họ tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Vai trò</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            return (
              <TableRow key={user.id} hover>
                <TableCell sx={{ color: 'text.secondary' }}>#{user.id}</TableCell>
                <TableCell>
                   <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: `${roleConfig.color}.main` }}>
                        {user.fullName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="600">{user.fullName}</Typography>
                   </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={roleConfig.label} 
                    color={roleConfig.color as any}
                    size="small" 
                    sx={{ color: 'white' }} 
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell align="center">
                   {/* Nút xem chi tiết (Mắt xanh) - Áp dụng cho mọi role */}
                   <IconButton size="small" onClick={() => onViewUser(user)} sx={{ color: '#0055A5' }}>
                      <Visibility fontSize="small" />
                   </IconButton>
                   
                   {/* Nút xóa - Chỉ hiện nếu không phải là chính mình (logic này nên handle ở FE hoặc BE) */}
                   <IconButton size="small" color="error" onClick={() => onDeleteUser(user.id)}>
                      <Delete fontSize="small" />
                   </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 && (
            <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Không tìm thấy người dùng nào</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default UserTable;