import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { People, School, Quiz } from '@mui/icons-material';

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Tổng quan hệ thống
      </Typography>
      
      <Box display="flex" gap={3} flexWrap="wrap" mt={2}>
        <Box flex={1} minWidth={300}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e3f2fd' }}>
            <People sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">Người dùng</Typography>
              <Typography variant="body2">Quản lý học sinh & nhân viên</Typography>
            </Box>
          </Paper>
        </Box>

        <Box flex={1} minWidth={300}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff3e0' }}>
            <School sx={{ fontSize: 40, color: 'warning.main' }} />
            <Box>
              <Typography variant="h6">Bài học</Typography>
              <Typography variant="body2">Quản lý nội dung học tập</Typography>
            </Box>
          </Paper>
        </Box>

        <Box flex={1} minWidth={300}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e8f5e9' }}>
            <Quiz sx={{ fontSize: 40, color: 'success.main' }} />
            <Box>
              <Typography variant="h6">Bài kiểm tra</Typography>
              <Typography variant="body2">Ngân hàng câu hỏi & Đề thi</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;