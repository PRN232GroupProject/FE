import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button, Stack, alpha } from '@mui/material';
import {
  Timer as TimerIcon,
  PlayArrow as PlayArrowIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

export interface ITest {
  id: number;
  name: string;
  type: string;
  duration: number;
  totalQuestions: number;
  chapterName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastAttempt?: {
    score: number;
    date: string;
    completed: boolean;
  };
}

interface TestCardProps {
  test: ITest;
  onStart: (testId: number) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onStart }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  const isCompleted = test.lastAttempt?.completed || false;

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8,
        },
      }}
    >
      {isCompleted && (
        <Chip
          icon={<CheckCircleIcon />}
          label="Đã làm"
          color="success"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            fontWeight: 600,
          }}
        />
      )}

      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.8)}, ${alpha(
            '#0055A5',
            0.8
          )})`,
          p: 2.5,
          color: 'white',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip
            label={test.type}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip
            label={getDifficultyLabel(test.difficulty)}
            size="small"
            color={getDifficultyColor(test.difficulty) as any}
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {test.name}
        </Typography>
        <Typography variant="caption">{test.chapterName}</Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2">
              <strong>{test.duration}</strong> phút
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2">
              <strong>{test.totalQuestions}</strong> câu hỏi
            </Typography>
          </Box>

          {test.lastAttempt && (
            <Box
              sx={{
                p: 2,
                bgcolor: alpha('#4CAF50', 0.1),
                borderRadius: 2,
                borderLeft: 4,
                borderColor: 'success.main',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AssessmentIcon sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  Lần làm gần nhất
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mb: 0.5 }}>
                {test.lastAttempt.score.toFixed(1)} điểm
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(test.lastAttempt.date).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayArrowIcon />}
            onClick={() => onStart(test.id)}
            sx={{
              mt: 'auto',
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
            }}
          >
            {isCompleted ? 'Làm lại' : 'Bắt đầu'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TestCard;