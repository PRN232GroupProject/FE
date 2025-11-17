import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ITestQuestion } from '../../types/test.types';
import { Box, Typography, CircularProgress } from '@mui/material';

// Import các component con vừa tạo
import TestHeader from '../Student/components/test/TestHeader';
import QuestionCard from '../Student/components/test/QuestionCard';
import SubmitFooter from '../Student/components/test/SubmitFooter';
import ConfirmSubmitDialog from '../Student/components/test/ConfirmSubmitDialog';

const TestSessionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<ITestQuestion[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openConfirm, setOpenConfirm] = useState(false);

  // === PHẦN LOGIC VÀ DATA FETCHING GIỮ NGUYÊN ===
  useEffect(() => {
    if (!testId) return;
    const startTest = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const sessionRes = await testService.startTest(testId);
      //   setSessionId(sessionRes.data.sessionId);
      //   const questionsRes = await testService.getTestQuestions(testId);
      //   const parsedQuestions = questionsRes.data.map(q => ({
      //     ...q,
      //     options: JSON.parse(q.options)
      //   }));
      //   setQuestions(parsedQuestions);
      // } catch (error) { console.error(error) }
      // finally { setLoading(false); }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        setSessionId(101);
        const stubQuestions: any[] = [
          {
            id: 1,
            content: 'Dung dịch chất nào sau đây làm quỳ tím hóa xanh?',
            options: '{"A": "HCl", "B": "NaOH", "C": "NaCl", "D": "H2SO4"}',
          },
          {
            id: 2,
            content: 'Chất nào sau đây là chất điện li yếu?',
            options: '{"A": "H2SO4", "B": "Cu(OH)2", "C": "BaCl2", "D": "HNO3"}',
          },
          {
            id: 3,
            content: 'Dung dịch có pH < 7 làm quỳ tím chuyển sang màu gì?',
            options: '{"A": "Xanh", "B": "Đỏ", "C": "Tím", "D": "Không màu"}',
          },
          {
            id: 4,
            content: 'Phản ứng giữa axit và bazơ tạo thành gì?',
            options:
              '{"A": "Muối và nước", "B": "Oxit", "C": "Khí H2", "D": "Kim loại"}',
          },
          {
            id: 5,
            content: 'Công thức hóa học của axit clohidric là gì?',
            options: '{"A": "H2SO4", "B": "HCl", "C": "HNO3", "D": "CH3COOH"}',
          },
        ];

        const parsed = stubQuestions.map((q) => ({
          ...q,
          options: JSON.parse(q.options),
        })) as ITestQuestion[];
        setQuestions(parsed);

        const initialAnswers: Record<number, string> = {};
        parsed.forEach((q) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);

        setLoading(false);
      }, 1000);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };
    startTest();
  }, [testId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    setOpenConfirm(false);
    console.log('Nộp bài với các câu trả lời:', answers);

    // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
    // try {
    //   await testService.submitTest(sessionId, answers);
    //   navigate(`/sessions/${sessionId}/results`);
    // } catch (error) {
    //   console.error("Lỗi nộp bài", error);
    //   setSubmitting(false);
    // }

    // ---- GIẢ LẬP NỘP BÀI (ĐỂ PHÁT TRIỂN UI) ----
    setTimeout(() => {
      setSubmitting(false);
      navigate(`/sessions/101/results`);
    }, 1500);
    // ---- HẾT GIẢ LẬP ----
  };

  if (loading) {
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

  const answeredCount = Object.values(answers).filter((a) => a !== '').length;

  // === PHẦN RENDER UI ĐÃ ĐƯỢC THAY THẾ ===
  return (
    <Box>
      <TestHeader
        testId={testId}
        sessionId={sessionId}
        duration={15 * 60} // 15 phút
        onTimeUp={handleSubmitTest}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />

      {/* Questions Form */}
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
          isSubmitting={submitting}
        />
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmSubmitDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleSubmitTest}
        isSubmitting={submitting}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />
    </Box>
  );
};

export default TestSessionPage;