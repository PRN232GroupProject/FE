import React from 'react';
import { Card, CardContent, Typography, alpha } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface ProfileStatsCardProps {
  icon: SvgIconComponent;
  value: number;
  label: string;
  color: string;
  iconColor: string;
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
  iconColor,
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.2)})`,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Icon sx={{ fontSize: 40, color: iconColor, mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: iconColor }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCard;