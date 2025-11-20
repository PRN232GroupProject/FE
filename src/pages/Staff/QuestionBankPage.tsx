import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  alpha,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { questionService } from '../../services/features/question.service';
import { lessonService } from '../../services/features/lesson.service';
import type { IQuestion, ICreateQuestionRequest, IUpdateQuestionRequest } from '../../types/question.types';
import type { ILessonResponse } from '../../types/content.types';

const difficultyOptions = [
  { value: 'Easy', label: 'Dễ', color: '#4CAF50' },
  { value: 'Medium', label: 'Trung bình', color: '#FF9800' },
  { value: 'Hard', label: 'Khó', color: '#F44336' },
];

const QuestionBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [lessons, setLessons] = useState<ILessonResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterLessonId, setFilterLessonId] = useState<number | string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<IQuestion | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    lessonId: 0,
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
    difficulty: 'Medium',
  });

  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filterLessonId, filterDifficulty]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchQuestions(), fetchLessons()]);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const params: any = {};
      if (filterLessonId && typeof filterLessonId === 'number') {
        params.lessonId = filterLessonId;
      }
      if (filterDifficulty) params.difficulty = filterDifficulty;

      const response = await questionService.getQuestions(params);
      setQuestions(response.data);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải danh sách câu hỏi', 'error');
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await lessonService.getAllLessons();
      setLessons(response.data);
    } catch (error: any) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (question?: IQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        lessonId: question.lessonId || 0,
        content: question.content,
        optionA: question.options['A'] || '',
        optionB: question.options['B'] || '',
        optionC: question.options['C'] || '',
        optionD: question.options['D'] || '',
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        difficulty: question.difficulty,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        lessonId: 0,
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        explanation: '',
        difficulty: 'Medium',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async () => {
    try {
      const questionData: ICreateQuestionRequest | IUpdateQuestionRequest = {
        lessonId: formData.lessonId || undefined,
        content: formData.content,
        options: {
          A: formData.optionA,
          B: formData.optionB,
          C: formData.optionC,
          D: formData.optionD,
        },
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        difficulty: formData.difficulty,
      };

      if (editingQuestion) {
        await questionService.updateQuestion(editingQuestion.id, {
          ...questionData,
          id: editingQuestion.id,
        } as IUpdateQuestionRequest);
        showSnackbar('Cập nhật câu hỏi thành công!', 'success');
      } else {
        await questionService.createQuestion(questionData);
        showSnackbar('Tạo câu hỏi mới thành công!', 'success');
      }
      handleCloseDialog();
      fetchQuestions();
    } catch (error: any) {
      showSnackbar(error.message || 'Lưu câu hỏi thất bại', 'error');
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      return;
    }
    try {
      await questionService.deleteQuestion(id);
      showSnackbar('Xóa câu hỏi thành công!', 'success');
      fetchQuestions();
    } catch (error: any) {
      showSnackbar(error.message || 'Xóa câu hỏi thất bại', 'error');
    }
  };

  const handleViewQuestion = (question: IQuestion) => {
    setViewingQuestion(question);
    setViewDialogOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    const option = difficultyOptions.find(d => d.value === difficulty);
    return option?.color || '#999';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const option = difficultyOptions.find(d => d.value === difficulty);
    return option?.label || difficulty;
  };

  const getLessonName = (lessonId: number) => {
    const lesson = lessons.find(l => l.lessonId === lessonId);
    return lesson?.title || `Bài học #${lessonId}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha('#0055A5', 0.9)})`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
              🎯 Ngân hàng Câu hỏi
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              Quản lý và tổ chức câu hỏi cho các bài kiểm tra
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                icon={<QuizIcon />}
                label={`${questions.length} Câu hỏi`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
            </Stack>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                boxShadow: 6,
              },
            }}
          >
            Thêm Câu hỏi mới
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, border: 2, borderColor: '#E0E0E0' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <FilterIcon color="action" />
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              Bộ lọc
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Bài học</InputLabel>
              <Select
                value={filterLessonId}
                label="Bài học"
                onChange={(e) => setFilterLessonId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <MenuItem value="">Tất cả bài học</MenuItem>
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Độ khó</InputLabel>
              <Select
                value={filterDifficulty}
                label="Độ khó"
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {difficultyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <TableContainer
        component={Paper}
        sx={{ border: 2, borderColor: '#FF6C00', borderRadius: 2 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha('#FF6C00', 0.1) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Câu hỏi</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Bài học</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Đáp án đúng</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Độ khó</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Chưa có câu hỏi nào. Nhấn "Thêm Câu hỏi mới" để bắt đầu.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        maxWidth: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {question.content}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={question.lessonId ? getLessonName(question.lessonId) : 'Không xác định'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={question.correctAnswer}
                      size="small"
                      sx={{
                        bgcolor: alpha('#4CAF50', 0.1),
                        color: '#4CAF50',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getDifficultyLabel(question.difficulty)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getDifficultyColor(question.difficulty), 0.1),
                        color: getDifficultyColor(question.difficulty),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleViewQuestion(question)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sửa câu hỏi">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(question)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa câu hỏi">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: 2,
            borderColor: '#FF6C00',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem' }}>
          {editingQuestion ? '✏️ Chỉnh sửa Câu hỏi' : '➕ Tạo Câu hỏi mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Bài học (tùy chọn)</InputLabel>
              <Select
                value={formData.lessonId || ''}
                label="Bài học (tùy chọn)"
                onChange={(e) => setFormData({ ...formData, lessonId: Number(e.target.value) })}
              >
                <MenuItem value={0}>Không thuộc bài học cụ thể</MenuItem>
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Nội dung câu hỏi"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />

            <Divider sx={{ my: 1 }}>
              <Chip label="Các đáp án" />
            </Divider>

            <TextField
              label="Đáp án A"
              fullWidth
              required
              value={formData.optionA}
              onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
            />

            <TextField
              label="Đáp án B"
              fullWidth
              required
              value={formData.optionB}
              onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
            />

            <TextField
              label="Đáp án C"
              fullWidth
              required
              value={formData.optionC}
              onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
            />

            <TextField
              label="Đáp án D"
              fullWidth
              required
              value={formData.optionD}
              onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
            />

            <FormControl fullWidth required>
              <InputLabel>Đáp án đúng</InputLabel>
              <Select
                value={formData.correctAnswer}
                label="Đáp án đúng"
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Độ khó</InputLabel>
              <Select
                value={formData.difficulty}
                label="Độ khó"
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                {difficultyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Giải thích (tùy chọn)"
              fullWidth
              multiline
              rows={3}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Giải thích tại sao đáp án này đúng..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveQuestion}
            disabled={
              !formData.content ||
              !formData.optionA ||
              !formData.optionB ||
              !formData.optionC ||
              !formData.optionD ||
              !formData.correctAnswer
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              bgcolor: '#FF6C00',
              '&:hover': {
                bgcolor: '#FF8C00',
              },
            }}
          >
            {editingQuestion ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: 2,
            borderColor: '#FF6C00',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem', borderBottom: '2px solid #FF6C00' }}>
          📝 Chi tiết Câu hỏi
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewingQuestion && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Nội dung câu hỏi
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: '#FFF8F0',
                    borderColor: '#FFE0C7',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {viewingQuestion.content}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Các đáp án
                </Typography>
                <Stack spacing={1.5}>
                  {Object.entries(viewingQuestion.options).map(([key, value]) => (
                    <Paper
                      key={key}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: key === viewingQuestion.correctAnswer ? alpha('#4CAF50', 0.1) : '#F5F9FF',
                        borderColor: key === viewingQuestion.correctAnswer ? '#4CAF50' : '#C7DEFF',
                        borderWidth: key === viewingQuestion.correctAnswer ? 2 : 1,
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={key}
                          sx={{
                            bgcolor: key === viewingQuestion.correctAnswer ? '#4CAF50' : '#0055A5',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                        <Typography variant="body1">{value}</Typography>
                        {key === viewingQuestion.correctAnswer && (
                          <Chip label="Đúng" color="success" size="small" />
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              {viewingQuestion.explanation && (
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Giải thích
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 1,
                      p: 2,
                      bgcolor: alpha('#4CAF50', 0.05),
                      borderColor: alpha('#4CAF50', 0.3),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {viewingQuestion.explanation}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <Box flex={1}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Bài học
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewingQuestion.lessonId ? getLessonName(viewingQuestion.lessonId) : 'Không xác định'}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Độ khó
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={getDifficultyLabel(viewingQuestion.difficulty)}
                      sx={{
                        bgcolor: alpha(getDifficultyColor(viewingQuestion.difficulty), 0.1),
                        color: getDifficultyColor(viewingQuestion.difficulty),
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #eee' }}>
          <Button
            onClick={() => setViewDialogOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              bgcolor: '#FF6C00',
              '&:hover': {
                bgcolor: '#FF8C00',
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuestionBankPage;
