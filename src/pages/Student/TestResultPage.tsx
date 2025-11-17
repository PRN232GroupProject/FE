import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { Home as HomeIcon, Replay as ReplayIcon } from '@mui/icons-material';
import type { ITestResult } from '../../types/test.types';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import ResultHeader from './components/test-result/ResultHeader';
import AnswerDetail from './components/test-result/AnswerDetail';

const TestResultPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ITestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    const fetchResult = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await testService.getTestResult(sessionId);
      //   setResult(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải kết quả", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubResult: ITestResult = {
          score: 60.0,
          totalCorrect: 3,
          sessionDetails: {
            id: parseInt(sessionId),
            testName: 'Kiểm tra ôn tập Bài 1: Axit, Bazơ và Muối',
            startTime: '2025-11-09T10:00:00Z',
            endTime: '2025-11-09T10:15:00Z',
          },
          answers: [
            {
              questionId: 1,
              content: 'Dung dịch chất nào sau đây làm quỳ tím hóa xanh?',
              options: { A: 'HCl', B: 'NaOH', C: 'NaCl', D: 'H2SO4' },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation:
                '<p><strong>Giải thích:</strong> NaOH là bazơ mạnh, tan trong nước phân li ra ion OH<sup>-</sup>, làm quỳ tím hóa xanh.</p><p>Các chất còn lại: HCl và H<sub>2</sub>SO<sub>4</sub> là axit (làm quỳ tím hóa đỏ), NaCl là muối trung hòa (không đổi màu quỳ tím).</p>',
            },
            {
              questionId: 2,
              content: 'Chất nào sau đây là chất điện li yếu?',
              options: { A: 'H2SO4', B: 'Cu(OH)2', C: 'BaCl2', D: 'HNO3' },
              selectedAnswer: 'A',
              correctAnswer: 'B',
              isCorrect: false,
              explanation:
                '<p><strong>Giải thích:</strong> Cu(OH)<sub>2</sub> là bazơ yếu, không tan, là chất điện li yếu.</p><p>Các chất còn lại đều là chất điện li mạnh: H<sub>2</sub>SO<sub>4</sub> và HNO<sub>3</sub> là axit mạnh, BaCl<sub>2</sub> là muối tan.</p>',
            },
            {
              questionId: 3,
              content: 'Dung dịch có pH < 7 làm quỳ tím chuyển sang màu gì?',
              options: { A: 'Xanh', B: 'Đỏ', C: 'Tím', D: 'Không màu' },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation:
                '<p><strong>Giải thích:</strong> Dung dịch có pH < 7 là môi trường axit, làm quỳ tím hóa đỏ.</p><p>Ngược lại, pH > 7 là môi trường bazơ (quỳ tím hóa xanh), pH = 7 là môi trường trung tính (quỳ tím giữ nguyên màu tím).</p>',
            },
            {
              questionId: 4,
              content: 'Phản ứng giữa axit và bazơ tạo thành gì?',
              options: { A: 'Muối và nước', B: 'Oxit', C: 'Khí H2', D: 'Kim loại' },
              selectedAnswer: '',
              correctAnswer: 'A',
              isCorrect: false,
              explanation:
                '<p><strong>Giải thích:</strong> Phản ứng giữa axit và bazơ là phản ứng trung hòa, tạo thành muối và nước.</p><p>Ví dụ: HCl + NaOH → NaCl + H<sub>2</sub>O</p>',
            },
            {
              questionId: 5,
              content: 'Công thức hóa học của axit clohidric là gì?',
              options: { A: 'H2SO4', B: 'HCl', C: 'HNO3', D: 'CH3COOH' },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation:
                '<p><strong>Giải thích:</strong> HCl là công thức hóa học của axit clohidric (hay còn gọi là axit clohydric).</p><p>Các axit khác: H<sub>2</sub>SO<sub>4</sub> (axit sunfuric), HNO<sub>3</sub> (axit nitric), CH<sub>3</sub>COOH (axit axetic).</p>',
            },
          ],
        };
        setResult(stubResult);
        setLoading(false);
      }, 1000);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };
    fetchResult();
  }, [sessionId]);

  if (loading) {
    return <LoadingSpinner message="Đang tải kết quả..." />;
  }

  if (!result) {
    return <EmptyState title="Không tìm thấy kết quả" />;
  }

  return (
    <Box>
      <ResultHeader
        testName={result.sessionDetails.testName}
        score={result.score}
        totalCorrect={result.totalCorrect}
        totalQuestions={result.answers.length}
        testId={result.sessionDetails.id}
      />

      {/* Section Title */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Xem lại đáp án chi tiết
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dưới đây là giải thích chi tiết cho từng câu hỏi
        </Typography>
      </Paper>

      {/* Answer Details */}
      {result.answers.map((ans, index) => (
        <AnswerDetail key={ans.questionId} answer={ans} index={index} />
      ))}

      {/* Footer Actions */}
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
            onClick={() => navigate(`/test/${result.sessionDetails.id}`)}
          >
            Làm lại bài test
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TestResultPage;