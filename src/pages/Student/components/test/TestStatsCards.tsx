import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface TestStatsCardsProps {
  completedCount: number;
  averageScore: number;
  highestScore: number;
}

const TestStatsCards: React.FC<TestStatsCardsProps> = ({
  completedCount,
  averageScore,
  highestScore,
}) => {
  const stats = [
    {
      icon: CheckCircleIcon,
      value: completedCount,
      label: 'Bài đã làm',
      color: 'success.main',
    },
    {
      icon: AssessmentIcon,
      value: averageScore.toFixed(1),
      label: 'Điểm trung bình',
      color: 'primary.main',
    },
    {
      icon: TrophyIcon,
      value: highestScore > 0 ? highestScore.toFixed(1) : '--',
      label: 'Điểm cao nhất',
      color: 'secondary.main',
    },
  ];

  return (
    <Box
      display="grid"
      gap={2}
      gridTemplateColumns={{
        xs: '1fr',
        sm: '1fr 1fr 1fr',
      }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Paper key={index} elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Icon sx={{ fontSize: 32, color: stat.color, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default TestStatsCards;