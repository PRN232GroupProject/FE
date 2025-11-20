import React from 'react';
import { Box, TextField, InputAdornment, Select, MenuItem, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

interface UserFilterProps {
  search: string;
  setSearch: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ search, setSearch, roleFilter, setRoleFilter }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" gap={2}>
        <TextField
          label="Tìm kiếm (Tên, Email)"
          size="small" fullWidth
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
        <Select
          value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          size="small" sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="Student">Học sinh</MenuItem>
          <MenuItem value="Staff">Nhân viên</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </Select>
      </Box>
    </Paper>
  );
};
export default UserFilter;