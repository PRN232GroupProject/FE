import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import TestHeader from '../Student/components/test/TestHeader';
import QuestionCard from '../Student/components/test/QuestionCard';
import SubmitFooter from '../Student/components/test/SubmitFooter';
import ConfirmSubmitDialog from '../Student/components/test/ConfirmSubmitDialog';
import { userService } from '../../services/features/user.service';
import {
  useStartTestSession,
  useSubmitAnswer,
  useSubmitTest,
} from '../../hooks/useTestSession';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const TestSessionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUserId(response.data.id);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openConfirm, setOpenConfirm] = useState(false);

  const {
    mutate: startTest,
    isPending: isLoading,
    data: sessionData,
    isError: isErrorStarting,
  } = useStartTestSession();

  const { mutate: saveAnswer } = useSubmitAnswer();

  const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest();

  useEffect(() => {
    if (testId && userId) {
      startTest({
        userId: userId,
        testId: Number(testId),
        startTime: new Date().toISOString(),
        status: 'in_progress',
      });
    }
  }, [testId, userId, startTest]);

  useEffect(() => {
    if (sessionData?.data.questions) {
      const initialAnswers: Record<number, string> = {};
      sessionData.data.questions.forEach((q) => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [sessionData]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (sessionData?.data.sessionId) {
      saveAnswer({
        sessionId: sessionData.data.sessionId,
        questionId: questionId,
        selectedAnswer: value,
      });
    }
  };

  const handleSubmitTest = () => {
    if (!sessionData?.data.sessionId) return;

    setOpenConfirm(false);

    submitTest({
      sessionId: sessionData.data.sessionId,
      request: {
        endTime: new Date().toISOString(),
        status: 'completed',
        // Backend sẽ tự tính điểm khi nhận được request này
      },
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Đang tải bài kiểm tra...
        </Typography>
      </Box>
    );
  }

  if (isErrorStarting || !sessionData) {
    return <LoadingSpinner message="Lỗi khi bắt đầu bài thi." />;
  }

  const { questions, sessionId, duration } = sessionData.data;
  const answeredCount = Object.values(answers).filter((a) => a !== '').length;

  return (
    <Box>
      <TestHeader
        testId={testId}
        sessionId={sessionId}
        duration={duration * 60} // API trả về phút, Timer cần giây
        onTimeUp={handleSubmitTest}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          setOpenConfirm(true);
        }}
      >
        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            index={index}
            question={q}
            currentAnswer={answers[q.id] || ''}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <SubmitFooter
          answeredCount={answeredCount}
          totalQuestions={questions.length}
          isSubmitting={isSubmitting}
        />
      </Box>

      <ConfirmSubmitDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleSubmitTest}
        isSubmitting={isSubmitting}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />
    </Box>
  );
};

export default TestSessionPage;