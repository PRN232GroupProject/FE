import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { userService } from '../../services/features/user.service';
import type { IUser } from '../../types/user.types';

import UserFilter from '../Admin/components/user-management/UserFilter';
import UserTable from '../Admin/components/user-management/UserTable';
import StaffDialog from '../Admin/components/user-management/StaffDialog';
import StudentDetailDialog from '../Admin/components/user-management/StudentDetailDialog';

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: any) => userService.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenCreateModal(false);
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: number) => userService.deleteStaff(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  // SỬA TẠI ĐÂY: Clone mảng và sort theo ID giảm dần (Mới nhất lên đầu)
  const users = [...(response?.data || [])].sort((a, b) => b.id - a.id);
  
  const filteredUsers = users.filter(u => {
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreateUser = (data: any) => {
    createStaffMutation.mutate(data);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Quản lý Người dùng</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreateModal(true)}>Tạo tài khoản mới</Button>
      </Box>
      
      <UserFilter search={search} setSearch={setSearch} roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
      
      <UserTable 
        users={filteredUsers} 
        onViewUser={setViewingUser} 
        onDeleteUser={(id) => deleteStaffMutation.mutate(id)} 
      />

      <StaffDialog 
        open={openCreateModal} 
        onClose={() => setOpenCreateModal(false)} 
        onSubmit={handleCreateUser}
      />

      <StudentDetailDialog user={viewingUser} onClose={() => setViewingUser(null)} />
    </Box>
  );
};
export default UserManagementPage;