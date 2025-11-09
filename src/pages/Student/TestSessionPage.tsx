import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ITestQuestion } from '../../types/test.types';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  alpha,
  Stack,
  Grid,
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Send as SendIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Timer Component
const Timer: React.FC<{ duration: number; onTimeUp: () => void }> = ({ duration, onTimeUp }) => {
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
          ? `linear-gradient(135deg, ${alpha('#F44336', 0.9)}, ${alpha('#E91E63', 0.9)})`
          : `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha('#0055A5', 0.9)})`,
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

const TestSessionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<ITestQuestion[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openConfirm, setOpenConfirm] = useState(false);

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
          { id: 1, content: 'Dung dịch chất nào sau đây làm quỳ tím hóa xanh?', options: '{"A": "HCl", "B": "NaOH", "C": "NaCl", "D": "H2SO4"}' },
          { id: 2, content: 'Chất nào sau đây là chất điện li yếu?', options: '{"A": "H2SO4", "B": "Cu(OH)2", "C": "BaCl2", "D": "HNO3"}' },
          { id: 3, content: 'Dung dịch có pH < 7 làm quỳ tím chuyển sang màu gì?', options: '{"A": "Xanh", "B": "Đỏ", "C": "Tím", "D": "Không màu"}' },
          { id: 4, content: 'Phản ứng giữa axit và bazơ tạo thành gì?', options: '{"A": "Muối và nước", "B": "Oxit", "C": "Khí H2", "D": "Kim loại"}' },
          { id: 5, content: 'Công thức hóa học của axit clohidric là gì?', options: '{"A": "H2SO4", "B": "HCl", "C": "HNO3", "D": "CH3COOH"}' },
        ];
        
        const parsed = stubQuestions.map(q => ({ ...q, options: JSON.parse(q.options) })) as ITestQuestion[];
        setQuestions(parsed);
        
        const initialAnswers: Record<number, string> = {};
        parsed.forEach(q => { initialAnswers[q.id] = ""; });
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
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Đang tải bài kiểm tra...
        </Typography>
      </Box>
    );
  }

  const answeredCount = Object.values(answers).filter(a => a !== "").length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <Box>
      {/* Sticky Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          position: 'sticky',
          top: 80,
          zIndex: 10,
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Bài kiểm tra {testId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Session ID: {sessionId}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Timer duration={15 * 60} onTimeUp={handleSubmitTest} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tiến độ làm bài
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  {answeredCount}/{questions.length}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#FF6C00', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Questions */}
      <Box component="form" onSubmit={(e) => { e.preventDefault(); setOpenConfirm(true); }}>
        {questions.map((q, index) => {
          const isAnswered = answers[q.id] !== "";
          
          return (
            <Card
              key={q.id}
              elevation={3}
              sx={{
                mb: 3,
                borderLeft: 5,
                borderColor: isAnswered ? 'success.main' : 'grey.300',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Chip
                    label={`Câu ${index + 1}`}
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                  {isAnswered && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Đã trả lời"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {q.content}
                </Typography>
                
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  >
                    <Grid container spacing={2}>
                      {Object.entries(q.options).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Paper
                            elevation={answers[q.id] === key ? 3 : 1}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              border: 2,
                              borderColor: answers[q.id] === key ? 'primary.main' : 'transparent',
                              bgcolor: answers[q.id] === key ? alpha('#FF6C00', 0.05) : 'transparent',
                              '&:hover': {
                                bgcolor: alpha('#FF6C00', 0.08),
                                transform: 'translateY(-2px)',
                              },
                            }}
                            onClick={() => handleAnswerChange(q.id, key)}
                          >
                            <FormControlLabel
                              value={key}
                              control={<Radio />}
                              label={
                                <Typography sx={{ fontWeight: answers[q.id] === key ? 600 : 400 }}>
                                  {key}. {value}
                                </Typography>
                              }
                              sx={{ width: '100%', m: 0 }}
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          );
        })}
        
        <Paper elevation={4} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Bạn đã trả lời {answeredCount}/{questions.length} câu hỏi
          </Typography>
          {answeredCount < questions.length && (
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
              <WarningIcon sx={{ color: 'warning.main' }} />
              <Typography variant="body2" color="warning.main">
                Còn {questions.length - answeredCount} câu chưa trả lời
              </Typography>
            </Stack>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            endIcon={submitting ? null : <SendIcon />}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {submitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={24} color="inherit" />
                <span>Đang nộp bài...</span>
              </Box>
            ) : (
              'Nộp bài'
            )}
          </Button>
        </Paper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          Xác nhận nộp bài
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem' }}>
            Bạn đã trả lời <strong>{answeredCount}/{questions.length}</strong> câu hỏi.
            {answeredCount < questions.length && (
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#FF9800', 0.1), borderRadius: 2 }}>
                <Typography color="warning.main" sx={{ fontWeight: 600 }}>
                  ⚠️ Còn {questions.length - answeredCount} câu chưa trả lời!
                </Typography>
              </Box>
            )}
            <Typography sx={{ mt: 2 }}>
              Bạn có chắc chắn muốn nộp bài không? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            variant="outlined"
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmitTest}
            variant="contained"
            autoFocus
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'Xác nhận nộp bài'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestSessionPage;