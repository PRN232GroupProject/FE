import React from 'react';
import { Box, Typography, Chip, Stack, alpha } from '@mui/material';
import { School as SchoolIcon, MenuBook as BookIcon } from '@mui/icons-material';

interface WelcomeBannerProps {
  userName: string;
  totalChapters: number;
  totalLessons: number;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName, totalChapters, totalLessons }) => {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha(
          '#0055A5',
          0.9
        )} 100%)`,
        borderRadius: 4,
        p: 4,
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Chào {userName}, chào mừng đến với khóa học Hóa học!
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
          Khám phá thế giới hóa học thông qua các bài giảng video và tài liệu chuyên sâu
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            icon={<SchoolIcon />}
            label={`${totalChapters} Chương học`}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
          />
          <Chip
            icon={<BookIcon />}
            label={`${totalLessons} Bài học`}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
          />
        </Stack>
      </Box>

      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          right: 100,
          width: 150,
          height: 150,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
        }}
      />
    </Box>
  );
};

export default WelcomeBanner;