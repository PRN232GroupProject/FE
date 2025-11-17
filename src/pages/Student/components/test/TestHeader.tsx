import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import Timer from './Timer'; 

interface TestHeaderProps {
  testId: string | undefined;
  sessionId: number | null;
  duration: number;
  onTimeUp: () => void;
  answeredCount: number;
  totalQuestions: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  testId,
  sessionId,
  duration,
  onTimeUp,
  answeredCount,
  totalQuestions,
}) => {
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        position: 'sticky',
        top: 80,
        zIndex: 10,
        borderRadius: 3,
      }}
    >
      <Box
        display="grid"
        gap={2}
        alignItems="center"
        gridTemplateColumns={{
          xs: '1fr',
          md: '2fr 1fr 1fr',
        }}
      >
        {/* Test Title */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Bài kiểm tra {testId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Session ID: {sessionId}
          </Typography>
        </Box>

        {/* Timer */}
        <Timer duration={duration} onTimeUp={onTimeUp} />

        {/* Progress Card */}
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tiến độ làm bài
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
            >
              {answeredCount}/{totalQuestions}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha('#FF6C00', 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};

export default TestHeader;