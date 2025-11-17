import React from 'react';
import { Box, Typography, alpha } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
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
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader;