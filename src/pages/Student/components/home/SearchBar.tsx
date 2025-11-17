import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
        Danh sách Chương học
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Tìm kiếm chương học..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: { sm: 300 } }}
      />
    </Box>
  );
};

export default SearchBar;