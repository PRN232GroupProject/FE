import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ITestQuestion } from '../../types/test.types';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

// Giả lập 1 timer đơn giản
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

  return (
    <Typography variant="h5" color={timeLeft < 60 ? 'error' : 'primary'}>
      Thời gian: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Typography>
  );
};

const TestSessionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<ITestQuestion[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // { questionId: selectedOptionKey }
  const [openConfirm, setOpenConfirm] = useState(false);

  // 1. Lấy câu hỏi và bắt đầu session
  useEffect(() => {
    if (!testId) return;
    const startTest = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (SẼ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const sessionRes = await testService.startTest(testId);
      //   setSessionId(sessionRes.data.sessionId);
      //
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
        setSessionId(101); // Giả lập session ID
        const stubQuestions: any[] = [
          { id: 1, content: 'Dung dịch chất nào sau đây làm quỳ tím hóa xanh?', options: '{"A": "HCl", "B": "NaOH", "C": "NaCl", "D": "H2SO4"}' },
          { id: 2, content: 'Chất nào sau đây là chất điện li yếu?', options: '{"A": "H2SO4", "B": "Cu(OH)2", "C": "BaCl2", "D": "HNO3"}' },
          { id: 3, content: 'Dung dịch có pH < 7 làm quỳ tím chuyển sang màu gì?', options: '{"A": "Xanh", "B": "Đỏ", "C": "Tím", "D": "Không màu"}' },
        ];
        
        const parsed = stubQuestions.map(q => ({ ...q, options: JSON.parse(q.options) })) as ITestQuestion[];
        setQuestions(parsed);
        
        // Khởi tạo answers state
        const initialAnswers: Record<number, string> = {};
        parsed.forEach(q => { initialAnswers[q.id] = "" });
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
  
  // 2. Hàm nộp bài
  const handleSubmitTest = async () => {
    setSubmitting(true);
    setOpenConfirm(false);
    console.log('Nộp bài với các câu trả lời:', answers);

    // PHẦN TÍCH HỢP API (SẼ MỞ COMMENT KHI BE SẴN SÀNG)
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
      console.log('Đã nộp bài (giả lập) với session:', sessionId);
      navigate(`/sessions/101/results`); // Dùng ID giả lập
    }, 1000);
    // ---- HẾT GIẢ LẬP ----
  };

  if (loading) {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, position: 'sticky', top: 20, zIndex: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Bài kiểm tra {testId}</Typography>
          <Timer duration={15 * 60} onTimeUp={handleSubmitTest} />
        </Box>
      </Paper>
      
      <Box component="form" onSubmit={(e) => { e.preventDefault(); setOpenConfirm(true); }}>
        {questions.map((q, index) => (
          <Paper key={q.id} elevation={2} sx={{ p: 3, mb: 3 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ fontSize: '1.2rem', color: 'black', mb: 2 }}>
                Câu {index + 1}: {q.content}
              </FormLabel>
              <RadioGroup
                aria-label={`question-${q.id}`}
                name={`question-${q.id}`}
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              >
                {Object.entries(q.options).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={`${key}. ${value}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={submitting}
          fullWidth
        >
          {submitting ? <CircularProgress size={24} /> : 'Nộp Bài'}
        </Button>
      </Box>

      {/* Dialog xác nhận nộp bài */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <DialogTitle>Xác nhận nộp bài</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn nộp bài không? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary" disabled={submitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmitTest} color="primary" autoFocus disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Nộp bài'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestSessionPage;