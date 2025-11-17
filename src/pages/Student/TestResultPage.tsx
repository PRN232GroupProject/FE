import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { Home as HomeIcon, Replay as ReplayIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import ResultHeader from './components/test-result/ResultHeader';
import AnswerDetail from './components/test-result/AnswerDetail';
import { useTestResult } from '../../hooks/useTestData';

const TestResultPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const {
    data: result,
    isLoading,
    isError,
  } = useTestResult(Number(sessionId));

  if (isLoading) {
    return <LoadingSpinner message="Đang tải kết quả..." />;
  }

  if (isError || !result) {
    return <EmptyState title="Không tìm thấy kết quả" />;
  }

  return (
    <Box>
      <ResultHeader
        testName={result.sessionDetails.testName}
        score={result.score}
        totalCorrect={result.totalCorrect}
        totalQuestions={result.answers.length}
        testId={result.testId}
      />

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Xem lại đáp án chi tiết
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dưới đây là giải thích chi tiết cho từng câu hỏi
        </Typography>
      </Paper>

      {result.answers.map((ans, index) => (
        <AnswerDetail key={ans.questionId} answer={ans} index={index} />
      ))}

      <Paper elevation={4} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Bạn đã hoàn thành bài kiểm tra!
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ReplayIcon />}
            onClick={() => navigate(`/test/${result.testId}`)}
          >
            Làm lại bài test
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TestResultPage;