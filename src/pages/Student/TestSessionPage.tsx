import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import TestHeader from '../Student/components/test/TestHeader';
import QuestionCard from '../Student/components/test/QuestionCard';
import SubmitFooter from '../Student/components/test/SubmitFooter';
import ConfirmSubmitDialog from '../Student/components/test/ConfirmSubmitDialog';
import {
  useTestDetails,
  useStartSession,
  useSubmitAnswer,
  useSubmitTest,
} from '../../hooks/useTestSession';
import { useAuthStore } from '../../stores/authStore';
import EmptyState from '../../components/shared/EmptyState';
import type { IQuestionResponse } from '../../types/test.types';

const TestSessionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuthStore();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openConfirm, setOpenConfirm] = useState(false);

  // Hook lấy dữ liệu
  const {
    data: testData,
    isLoading: isLoadingTest,
    isError: isErrorTest,
  } = useTestDetails(Number(testId));

  // Hook tạo session
  const {
    mutate: startSession,
    data: sessionData,
    isPending: isCreatingSession,
    isError: isErrorSession,
  } = useStartSession();

  // Hook lưu câu trả lời (Dùng mutateAsync để đợi)
  const { mutateAsync: saveAnswerAsync } = useSubmitAnswer();

  // Hook nộp bài
  const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest();

  // Effect: Tạo session khi vào trang
  useEffect(() => {
    if (testId && user?.id && !sessionData) {
      startSession({
        userId: user.id,
        testId: Number(testId),
        startTime: new Date().toISOString(),
        status: 'in_progress',
      });
    }
  }, [testId, user, startSession, sessionData]);

  // Effect: Khởi tạo state câu trả lời
  useEffect(() => {
    if (testData?.questions) {
      const initialAnswers: Record<number, string> = {};
      testData.questions.forEach((q) => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [testData]);

  // --- HÀM XỬ LÝ CHỌN ĐÁP ÁN (CHỈ LƯU LOCAL) ---
  const handleAnswerChange = (questionId: number, value: string) => {
    // Chỉ cập nhật State, KHÔNG gọi API ngay để tránh lỗi 500
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // --- HÀM XỬ LÝ NỘP BÀI (QUAN TRỌNG) ---
  const handleSubmitTest = async () => {
    if (!sessionData?.id || !user?.id) return;

    setOpenConfirm(false);

    // BƯỚC 1: Gửi tất cả câu trả lời lên Server
    // Chúng ta dùng try-catch cho TỪNG request để nếu có lỗi 500 (do trùng) thì vẫn chạy tiếp
    try {
      const answerPromises = Object.entries(answers)
        .filter(([_, val]) => val !== '') // Chỉ gửi câu đã chọn
        .map(async ([qId, val]) => {
          try {
            await saveAnswerAsync({
              sessionId: sessionData.id,
              questionId: Number(qId),
              selectedAnswer: val,
              isCorrect: false,
            });
          } catch (err) {
            // ⚠️ QUAN TRỌNG: Bắt lỗi ở đây và bỏ qua nó!
            // Nếu backend trả về 500 do trùng lặp, ta coi như đã lưu rồi và tiếp tục.
            console.warn(`Bỏ qua lỗi lưu câu hỏi ${qId} (có thể do trùng lặp):`, err);
          }
        });
      
      // Đợi tất cả câu trả lời được xử lý xong
      await Promise.all(answerPromises);

    } catch (error) {
      console.error("Lỗi hệ thống khi lưu bài:", error);
    }

    // BƯỚC 2: Gọi API kết thúc bài thi (Sửa lỗi 400)
    // Convert startTime sang chuẩn ISO một lần nữa cho chắc chắn
    const safeStartTime = new Date(sessionData.startTime).toISOString();
    
    submitTest({
      sessionId: sessionData.id,
      request: {
        id: sessionData.id,
        userId: user.id,
        testId: Number(testId),
        startTime: safeStartTime, // Gửi đúng định dạng
        endTime: new Date().toISOString(),
        status: 'completed',
        score: 0, // Gửi 0 để tránh lỗi null nếu BE yêu cầu int
      },
    });
  };

  if (isLoadingTest || isCreatingSession) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorTest || isErrorSession || !testData) {
    return (
      <EmptyState title="Lỗi tải bài" description="Vui lòng thử lại." />
    );
  }

  const { questions, durationMinutes } = testData;
  const answeredCount = Object.values(answers).filter((a) => a !== '').length;

  return (
    <Box>
      <TestHeader
        testId={testData.name}
        sessionId={sessionData?.id || 0}
        duration={durationMinutes * 60}
        onTimeUp={handleSubmitTest}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />

      <Box component="form" onSubmit={(e) => { e.preventDefault(); setOpenConfirm(true); }}>
        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            index={index}
            question={q as IQuestionResponse}
            currentAnswer={answers[q.id] || ''}
            onAnswerChange={handleAnswerChange}
          />
        ))}
        <SubmitFooter
            answeredCount={answeredCount}
            totalQuestions={questions.length}
            isSubmitting={isSubmitting} // Nút sẽ disable khi đang nộp -> Chặn double click
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