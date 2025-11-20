import React from 'react';
import { Box, TextField, InputAdornment, Select, MenuItem, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

interface TestFilterProps {
  search: string;
  setSearch: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
}

const TestFilter: React.FC<TestFilterProps> = ({ search, setSearch, typeFilter, setTypeFilter }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" gap={2}>
        <TextField
          label="Tìm tên bài kiểm tra..."
          size="small" 
          fullWidth
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          // Sửa: Dùng InputProps chuẩn, ignore warning nếu IDE báo sai version
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Select
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          size="small" 
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Tất cả loại bài thi</MenuItem>
          <MenuItem value="15_MINUTES">15 Phút</MenuItem>
          <MenuItem value="45_MINUTES">1 Tiết</MenuItem>
          <MenuItem value="SEMESTER">Học kỳ</MenuItem>
        </Select>
      </Box>
    </Paper>
  );
};

export default TestFilter;