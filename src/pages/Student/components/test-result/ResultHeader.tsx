import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography, Paper, Button, Stack, alpha } from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';

interface ResultHeaderProps {
  testName: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  testId: number;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({
  testName,
  score,
  totalCorrect,
  totalQuestions,
  testId,
}) => {
  const navigate = useNavigate();
  const isPassed = score >= 50;
  const percentCorrect = (totalCorrect / totalQuestions) * 100;

  return (
    <Card
      elevation={5}
      sx={{
        mb: 4,
        background: isPassed
          ? `linear-gradient(135deg, ${alpha('#4CAF50', 0.9)}, ${alpha('#2196F3', 0.9)})`
          : `linear-gradient(135deg, ${alpha('#F44336', 0.9)}, ${alpha('#FF9800', 0.9)})`,
        color: 'white',
      }}
    >
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <TrophyIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {isPassed ? 'Chúc mừng!' : 'Cố gắng hơn!'}
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, opacity: 0.95 }}>
          {testName}
        </Typography>

        {/* Score Cards */}
        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr 1fr',
          }}
          sx={{ mt: 2 }}
        >
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {score.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điểm số
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
              {totalCorrect}/{totalQuestions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Số câu đúng
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              {percentCorrect.toFixed(0)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tỷ lệ đúng
            </Typography>
          </Paper>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/results')}
            sx={{
              bgcolor: 'white',
              color: isPassed ? 'success.main' : 'error.main',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Về lịch sử
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ReplayIcon />}
            onClick={() => navigate(`/test/${testId}`)}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Làm lại
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResultHeader;