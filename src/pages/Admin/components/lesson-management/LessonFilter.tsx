import React from 'react';
import { Box, TextField, InputAdornment, Select, MenuItem, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

interface LessonFilterProps {
  search: string;
  setSearch: (val: string) => void;
  gradeFilter: number | 'all';
  setGradeFilter: (val: any) => void;
}

const LessonFilter: React.FC<LessonFilterProps> = ({ search, setSearch, gradeFilter, setGradeFilter }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" gap={2}>
        <TextField
          label="Tìm kiếm bài học..."
          size="small" fullWidth
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
        <Select
          value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}
          size="small" sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Tất cả khối</MenuItem>
          <MenuItem value={10}>Lớp 10</MenuItem>
          <MenuItem value={11}>Lớp 11</MenuItem>
          <MenuItem value={12}>Lớp 12</MenuItem>
        </Select>
      </Box>
    </Paper>
  );
};
export default LessonFilter;