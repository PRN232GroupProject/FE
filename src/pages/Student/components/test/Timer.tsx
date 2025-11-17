import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;
  const isLowTime = timeLeft < 60;

  return (
    <Card
      elevation={3}
      sx={{
        background: isLowTime
          ? `linear-gradient(135deg, ${alpha('#F44336', 0.9)}, ${alpha(
              '#E91E63',
              0.9,
            )})`
          : `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha(
              '#0055A5',
              0.9,
            )})`,
        color: 'white',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TimerIcon />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Thời gian còn lại
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'white',
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Timer;