import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ITestResult, ITestAnswerDetail } from '../../types/test.types';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DOMPurify from 'dompurify';

// Component con để render chi tiết 1 câu trả lời
const AnswerDetail: React.FC<{ answer: ITestAnswerDetail; index: number }> = ({ answer, index }) => {
  // Hàm render lời giải an toàn
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: 5,
        borderColor: answer.isCorrect ? 'success.main' : 'error.main',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Câu {index + 1}: {answer.content}
      </Typography>
      
      {/* Hiển thị các lựa chọn */}
      <Box sx={{ my: 2 }}>
        {Object.entries(answer.options).map(([key, value]) => {
          const isSelected = answer.selectedAnswer === key;
          const isCorrect = answer.correctAnswer === key;
          let color: "success" | "error" | "disabled" = "disabled";
          
          if (isCorrect) color = "success";
          if (isSelected && !isCorrect) color = "error";

          return (
            <Chip 
              key={key} 
              label={`${key}. ${value}`} 
              variant={isSelected || isCorrect ? "filled" : "outlined"}
              color={color === 'disabled' ? 'default' : color}
              sx={{ m: 0.5 }}
            />
          );
        })}
      </Box>

      <Typography variant="body1" sx={{ mb: 1 }}>
        Bạn chọn: <strong>{answer.selectedAnswer || '(Không chọn)'}</strong> - 
        Đáp án đúng: <strong>{answer.correctAnswer}</strong>
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" color="primary.main">Giải thích:</Typography>
      {/* Render HTML an toàn */}
      <Box 
        dangerouslySetInnerHTML={createMarkup(answer.explanation)} 
        sx={{ 
          '& p': { margin: '8px 0' },
          '& sub': { fontSize: '0.75em', bottom: '-0.25em' } 
        }}
      />
    </Paper>
  );
};


const TestResultPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [result, setResult] = useState<ITestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    const fetchResult = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (SẼ MỞ COMMENT KHI BE SẴN SÀNG)
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
          score: 50.0,
          totalCorrect: 1,
          sessionDetails: {
            id: parseInt(sessionId),
            testName: 'Kiểm tra ôn tập Bài 1',
            startTime: '2025-11-09T10:00:00Z',
            endTime: '2025-11-09T10:15:00Z',
          },
          answers: [
            {
              questionId: 1,
              content: 'Dung dịch chất nào sau đây làm quỳ tím hóa xanh?',
              options: { "A": "HCl", "B": "NaOH", "C": "NaCl", "D": "H2SO4" },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation: '<p><b>Giải thích:</b> NaOH là bazơ mạnh, tan trong nước phân li ra ion OH-, làm quỳ tím hóa xanh.</p>',
            },
            {
              questionId: 2,
              content: 'Chất nào sau đây là chất điện li yếu?',
              options: { "A": "H2SO4", "B": "Cu(OH)2", "C": "BaCl2", "D": "HNO3" },
              selectedAnswer: 'A',
              correctAnswer: 'B',
              isCorrect: false,
              explanation: '<p><b>Giải thích:</b> Cu(OH)<sub>2</sub> là bazơ yếu, không tan, là chất điện li yếu.</p><p>Các chất còn lại đều là chất điện li mạnh.</p>',
            },
            {
              questionId: 3,
              content: 'Dung dịch có pH < 7 làm quỳ tím chuyển sang màu gì?',
              options: { "A": "Xanh", "B": "Đỏ", "C": "Tím", "D": "Không màu" },
              selectedAnswer: '', // Không trả lời
              correctAnswer: 'B',
              isCorrect: false,
              explanation: '<p><b>Giải thích:</b> Dung dịch có pH < 7 là môi trường axit, làm quỳ tím hóa đỏ.</p>',
            }
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
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (!result) {
    return <Typography>Không tìm thấy kết quả.</Typography>;
  }
  
  const totalQuestions = result.answers.length;

  return (
    <Box>
      <Paper elevation={4} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Kết quả bài kiểm tra
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {result.sessionDetails.testName}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap', // Cho phép xuống hàng trên màn hình nhỏ
            gap: 2, // Khoảng cách giữa các Chip (tương đương spacing={2})
            mb: 2,
          }}
        >
          {/* Chip Điểm số */}
          <Chip 
            icon={<CheckCircleIcon />} 
            label={`Điểm số: ${result.score.toFixed(1)}`} 
            color="primary" 
            sx={{ fontSize: '1.2rem', p: 2 }} 
          />
          {/* Chip Số câu đúng */}
          <Chip 
            icon={<CancelIcon />} 
            label={`Số câu đúng: ${result.totalCorrect} / ${totalQuestions}`} 
            color={result.score >= 50 ? 'success' : 'error'} 
            sx={{ fontSize: '1.2rem', p: 2 }} 
          />
        </Box>
      </Paper>
      
      <Typography variant="h4" gutterBottom>
        Xem lại đáp án
      </Typography>
      {result.answers.map((ans, index) => (
        <AnswerDetail key={ans.questionId} answer={ans} index={index} />
      ))}
    </Box>
  );
};

export default TestResultPage;