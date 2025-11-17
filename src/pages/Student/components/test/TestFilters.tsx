import React from 'react';
import {
  Paper,
  Box,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface TestFiltersProps {
  statusFilter: 'all' | 'completed' | 'not-completed';
  gradeFilter: string;
  typeFilter: string;
  searchTerm: string;
  totalTests: number;
  completedCount: number;
  onStatusChange: (status: 'all' | 'completed' | 'not-completed') => void;
  onGradeChange: (grade: string) => void;
  onTypeChange: (type: string) => void;
  onSearchChange: (term: string) => void;
}

const gradeFilters = [
  { value: 'all', label: 'Tất cả Khối lớp' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi ĐH' },
];

const typeFilters = [
  { value: 'all', label: 'Tất cả các loại' },
  { value: 'Sau bài học', label: 'Sau bài học' },
  { value: '15 phút', label: '15 phút' },
  { value: '1 tiết', label: '1 tiết' },
  { value: 'Học kỳ', label: 'Học kỳ' },
  { value: 'Tốt nghiệp', label: 'Tốt nghiệp' },
  { value: 'Đại học', label: 'Đại học' },
];

const TestFilters: React.FC<TestFiltersProps> = ({
  statusFilter,
  gradeFilter,
  typeFilter,
  searchTerm,
  totalTests,
  completedCount,
  onStatusChange,
  onGradeChange,
  onTypeChange,
  onSearchChange,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(12, 1fr)',
        }}
        alignItems="center"
      >
        {/* Status Buttons */}
        <Box sx={{ gridColumn: { sm: 'span 12' } }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant={statusFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => onStatusChange('all')}
            >
              Tất cả ({totalTests})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'contained' : 'outlined'}
              onClick={() => onStatusChange('completed')}
              color="success"
            >
              Đã hoàn thành ({completedCount})
            </Button>
            <Button
              variant={statusFilter === 'not-completed' ? 'contained' : 'outlined'}
              onClick={() => onStatusChange('not-completed')}
              color="warning"
            >
              Chưa làm ({totalTests - completedCount})
            </Button>
          </Stack>
        </Box>

        {/* Grade Filter */}
        <Box sx={{ gridColumn: { sm: 'span 4' } }}>
          <FormControl fullWidth>
            <InputLabel>Lọc theo Lớp</InputLabel>
            <Select
              value={gradeFilter}
              label="Lọc theo Lớp"
              onChange={(e) => onGradeChange(e.target.value)}
            >
              {gradeFilters.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Type Filter */}
        <Box sx={{ gridColumn: { sm: 'span 4' } }}>
          <FormControl fullWidth>
            <InputLabel>Lọc theo Loại bài thi</InputLabel>
            <Select
              value={typeFilter}
              label="Lọc theo Loại bài thi"
              onChange={(e) => onTypeChange(e.target.value)}
            >
              {typeFilters.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Search */}
        <Box sx={{ gridColumn: { sm: 'span 4' } }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm bài kiểm tra..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default TestFilters;