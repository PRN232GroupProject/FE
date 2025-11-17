import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  minHeight?: string;
  message?: string; 
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 60, 
  minHeight = '60vh',
  message
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight={minHeight}
    >
      <CircularProgress size={size} thickness={4} />
      
      {message && (
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mt: 3, fontWeight: 600 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;