import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ITestResult, ITestAnswerDetail } from '../../types/test.types';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Card,
  CardContent,
  Button,
  alpha,
  // Grid, // Không cần Grid ở đây nữa
  Stack,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as TrophyIcon,
  Home as HomeIcon,
  Replay as ReplayIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import DOMPurify from 'dompurify';

// Component con để render chi tiết 1 câu trả lời
const AnswerDetail: React.FC<{ answer: ITestAnswerDetail; index: number }> = ({ answer, index }) => {
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderLeft: 5,
        borderColor: answer.isCorrect ? 'success.main' : 'error.main',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={`Câu ${index + 1}`}
            color="primary"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={answer.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
            label={answer.isCorrect ? 'Đúng' : 'Sai'}
            color={answer.isCorrect ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {answer.content}
        </Typography>
        
        {/* === SỬA LỖI GRID (LỖI TRONG HÌNH): Thay <Grid container> bằng <Box display="grid"> === */}
        <Box 
          display="grid"
          gap={2} // Tương đương spacing={2}
          sx={{ my: 2 }}
          gridTemplateColumns={{
            xs: '1fr', // 1 cột
            sm: '1fr 1fr', // 2 cột (tương đương sm={6})
          }}
        >
          {Object.entries(answer.options).map(([key, value]) => {
            const isSelected = answer.selectedAnswer === key;
            const isCorrect = answer.correctAnswer === key;
            
            let bgcolor = 'background.paper';
            let borderColor = 'divider';
            let color = 'text.primary';
            
            if (isCorrect) {
              bgcolor = alpha('#4CAF50', 0.1);
              borderColor = 'success.main';
              color = 'success.main';
            }
            if (isSelected && !isCorrect) {
              bgcolor = alpha('#F44336', 0.1);
              borderColor = 'error.main';
              color = 'error.main';
            }

            return (
              // <Grid item ...> ĐÃ BỊ XÓA
              <Paper
                key={key} // key được chuyển vào đây
                elevation={isSelected || isCorrect ? 3 : 1}
                sx={{
                  p: 2,
                  border: 2,
                  borderColor,
                  bgcolor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {isCorrect && <CheckCircleIcon sx={{ color: 'success.main' }} />}
                {isSelected && !isCorrect && <CancelIcon sx={{ color: 'error.main' }} />}
                <Typography sx={{ fontWeight: isSelected || isCorrect ? 600 : 400, color }}>
                  {key}. {value}
                </Typography>
              </Paper>
              // </Grid>
            );
          })}
        </Box>
        {/* === HẾT PHẦN SỬA LỖI === */}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={`Bạn chọn: ${answer.selectedAnswer || 'Không chọn'}`}
            color={answer.isCorrect ? 'success' : 'error'}
            variant="outlined"
          />
          <Chip
            label={`Đáp án đúng: ${answer.correctAnswer}`}
            color="success"
            variant="filled"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            bgcolor: alpha('#2196F3', 0.05),
            p: 2,
            borderRadius: 2,
            borderLeft: 4,
            borderColor: 'info.main',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
            💡 Giải thích chi tiết:
          </Typography>
          <Box 
            dangerouslySetInnerHTML={createMarkup(answer.explanation)} 
            sx={{ 
              '& p': { margin: '8px 0' },
              '& sub': { fontSize: '0.75em', bottom: '-0.25em' },
              '& strong': { color: 'primary.main' },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

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
              options: { "A": "HCl", "B": "NaOH", "C": "NaCl", "D": "H2SO4" },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation: '<p><strong>Giải thích:</strong> NaOH là bazơ mạnh, tan trong nước phân li ra ion OH<sup>-</sup>, làm quỳ tím hóa xanh.</p><p>Các chất còn lại: HCl và H<sub>2</sub>SO<sub>4</sub> là axit (làm quỳ tím hóa đỏ), NaCl là muối trung hòa (không đổi màu quỳ tím).</p>',
            },
            {
              questionId: 2,
              content: 'Chất nào sau đây là chất điện li yếu?',
              options: { "A": "H2SO4", "B": "Cu(OH)2", "C": "BaCl2", "D": "HNO3" },
              selectedAnswer: 'A',
              correctAnswer: 'B',
              isCorrect: false,
              explanation: '<p><strong>Giải thích:</strong> Cu(OH)<sub>2</sub> là bazơ yếu, không tan, là chất điện li yếu.</p><p>Các chất còn lại đều là chất điện li mạnh: H<sub>2</sub>SO<sub>4</sub> và HNO<sub>3</sub> là axit mạnh, BaCl<sub>2</sub> là muối tan.</p>',
            },
            {
              questionId: 3,
              content: 'Dung dịch có pH < 7 làm quỳ tím chuyển sang màu gì?',
              options: { "A": "Xanh", "B": "Đỏ", "C": "Tím", "D": "Không màu" },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation: '<p><strong>Giải thích:</strong> Dung dịch có pH < 7 là môi trường axit, làm quỳ tím hóa đỏ.</p><p>Ngược lại, pH > 7 là môi trường bazơ (quỳ tím hóa xanh), pH = 7 là môi trường trung tính (quỳ tím giữ nguyên màu tím).</p>',
            },
            {
              questionId: 4,
              content: 'Phản ứng giữa axit và bazơ tạo thành gì?',
              options: { "A": "Muối và nước", "B": "Oxit", "C": "Khí H2", "D": "Kim loại" },
              selectedAnswer: '',
              correctAnswer: 'A',
              isCorrect: false,
              explanation: '<p><strong>Giải thích:</strong> Phản ứng giữa axit và bazơ là phản ứng trung hòa, tạo thành muối và nước.</p><p>Ví dụ: HCl + NaOH → NaCl + H<sub>2</sub>O</p>',
            },
            {
              questionId: 5,
              content: 'Công thức hóa học của axit clohidric là gì?',
              options: { "A": "H2SO4", "B": "HCl", "C": "HNO3", "D": "CH3COOH" },
              selectedAnswer: 'B',
              correctAnswer: 'B',
              isCorrect: true,
              explanation: '<p><strong>Giải thích:</strong> HCl là công thức hóa học của axit clohidric (hay còn gọi là axit clohydric).</p><p>Các axit khác: H<sub>2</sub>SO<sub>4</sub> (axit sunfuric), HNO<sub>3</sub> (axit nitric), CH<sub>3</sub>COOH (axit axetic).</p>',
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
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Đang tải kết quả...
        </Typography>
      </Box>
    );
  }

  if (!result) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary">
          Không tìm thấy kết quả.
        </Typography>
      </Box>
    );
  }
  
  const totalQuestions = result.answers.length;
  const isPassed = result.score >= 50;
  const percentCorrect = (result.totalCorrect / totalQuestions) * 100;

  return (
    <Box>
      {/* Header Card */}
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
            {result.sessionDetails.testName}
          </Typography>
          
          {/* 3 Thẻ điểm (Đã sửa ở lần trước) */}
          <Box
            display="grid"
            gap={3}
            gridTemplateColumns={{
              xs: '1fr',
              sm: '1fr 1fr 1fr',
            }}
            sx={{ mt: 2 }}
          >
            {/* Thẻ 1 */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {result.score.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm số
              </Typography>
            </Paper>
            
            {/* Thẻ 2 */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                {result.totalCorrect}/{totalQuestions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Số câu đúng
              </Typography>
            </Paper>
            
            {/* Thẻ 3 */}
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
              onClick={() => navigate('/')}
              sx={{
                bgcolor: 'white',
                color: isPassed ? 'success.main' : 'error.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Về trang chủ
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ReplayIcon />}
              onClick={() => navigate(`/test/${result.sessionDetails.id}`)}
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
      
      {/* Detailed Answers */}
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