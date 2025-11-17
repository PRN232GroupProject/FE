import React from 'react';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <Box textAlign="center" py={8}>
      {icon && (
        <Box sx={{ mb: 2, color: 'text.disabled' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;