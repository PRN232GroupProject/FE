import React from 'react';
import { Box, Container, Paper, Typography, alpha } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha(
          '#0055A5',
          0.9
        )} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
        }}
      />

      <Container component="main" maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, #FF6C00, #0055A5)`,
                mb: 2,
              }}
            >
              <SchoolIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          {children}
        </Paper>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'white', opacity: 0.9 }}>
          © 2025 BinBin Corporation. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default AuthLayout;