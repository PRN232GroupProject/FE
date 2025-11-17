import React from 'react';
import { Paper, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface ResultStatsCardProps {
  icon: SvgIconComponent;
  value: string | number;
  label: string;
  color: string;
}

const ResultStatsCard: React.FC<ResultStatsCardProps> = ({ icon: Icon, value, label, color }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
      <Icon sx={{ fontSize: 32, color, mb: 1 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, color }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
};

export default ResultStatsCard;