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
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  Visibility as VisibilityIcon,
  PlaylistAdd as PlaylistAddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { testService } from '../../services/features/test.service';
import { questionService } from '../../services/features/question.service';
import type { ITestResponse, ICreateTestRequest, IUpdateTestRequest } from '../../types/test.types';
import type { IQuestion } from '../../types/question.types';

const testTypeOptions = [
  { value: 'Trắc nghiệm', label: 'Trắc nghiệm' },
  { value: 'Kiểm tra 15 phút', label: 'Kiểm tra 15 phút' },
  { value: 'Kiểm tra 45 phút', label: 'Kiểm tra 45 phút' },
  { value: 'Thi học kỳ', label: 'Thi học kỳ' },
];

const TestManagementPage: React.FC = () => {
  const [tests, setTests] = useState<ITestResponse[]>([]);
  const [allQuestions, setAllQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<ITestResponse | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingTest, setViewingTest] = useState<ITestResponse | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ITestResponse | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Trắc nghiệm',
    durationMinutes: 45,
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

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTests(), fetchQuestions()]);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await testService.getAllTests();
      setTests(response.data);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải danh sách bài test', 'error');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await questionService.getQuestions();
      setAllQuestions(response.data);
    } catch (error: any) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (test?: ITestResponse) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        name: test.name,
        description: test.description || '',
        type: test.type,
        durationMinutes: test.durationMinutes,
      });
    } else {
      setEditingTest(null);
      setFormData({
        name: '',
        description: '',
        type: 'Trắc nghiệm',
        durationMinutes: 45,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTest(null);
  };

  const handleSaveTest = async () => {
    try {
      if (editingTest) {
        await testService.updateTest(editingTest.id, {
          ...formData,
          id: editingTest.id,
        });
        showSnackbar('Cập nhật bài test thành công!', 'success');
      } else {
        await testService.createTest(formData);
        showSnackbar('Tạo bài test mới thành công!', 'success');
      }
      handleCloseDialog();
      fetchTests();
    } catch (error: any) {
      showSnackbar(error.message || 'Lưu bài test thất bại', 'error');
    }
  };

  const handleDeleteTest = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài test này?')) {
      return;
    }
    try {
      await testService.deleteTest(id);
      showSnackbar('Xóa bài test thành công!', 'success');
      fetchTests();
    } catch (error: any) {
      showSnackbar(error.message || 'Xóa bài test thất bại', 'error');
    }
  };

  const handleViewTest = async (test: ITestResponse) => {
    try {
      // Fetch full test details with questions
      const response = await testService.getTestById(test.id);
      setViewingTest(response.data);
      setViewDialogOpen(true);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải chi tiết bài test', 'error');
    }
  };

  const handleOpenQuestionDialog = (test: ITestResponse) => {
    setSelectedTest(test);
    setSelectedQuestionIds(test.questions?.map(q => q.id) || []);
    setQuestionDialogOpen(true);
  };

  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setSelectedTest(null);
    setSelectedQuestionIds([]);
  };

  const handleToggleQuestion = (questionId: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSaveQuestions = async () => {
    if (!selectedTest) return;

    try {
      await testService.addQuestionsToTest(selectedTest.id, {
        questionIds: selectedQuestionIds,
      });
      showSnackbar('Cập nhật câu hỏi thành công!', 'success');
      handleCloseQuestionDialog();
      fetchTests();
    } catch (error: any) {
      showSnackbar(error.message || 'Cập nhật câu hỏi thất bại', 'error');
    }
  };

  const handleRemoveQuestion = async (testId: number, questionId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này khỏi bài test?')) {
      return;
    }
    try {
      await testService.removeQuestionFromTest(testId, questionId);
      showSnackbar('Xóa câu hỏi thành công!', 'success');
      
      // Reload the test details to get updated questions list
      if (viewingTest?.id === testId) {
        const response = await testService.getTestById(testId);
        setViewingTest(response.data);
      }
      
      fetchTests();
    } catch (error: any) {
      showSnackbar(error.message || 'Xóa câu hỏi thất bại', 'error');
    }
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
              📝 Quản lý Bài Test
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              Tạo và quản lý các bài kiểm tra
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                icon={<QuizIcon />}
                label={`${tests.length} Bài test`}
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
            Thêm Bài Test mới
          </Button>
        </Box>
      </Box>

      {/* Tests Table */}
      <TableContainer
        component={Paper}
        sx={{ border: 2, borderColor: '#FF6C00', borderRadius: 2 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha('#FF6C00', 0.1) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Tên bài test</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Thời gian</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Số câu hỏi</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Chưa có bài test nào. Nhấn "Thêm Bài Test mới" để bắt đầu.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => (
                <TableRow key={test.id} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {test.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={test.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${test.durationMinutes} phút`}
                      size="small"
                      sx={{
                        bgcolor: alpha('#0055A5', 0.1),
                        color: '#0055A5',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${test.totalQuestions || 0} câu`}
                      size="small"
                      sx={{
                        bgcolor: alpha('#4CAF50', 0.1),
                        color: '#4CAF50',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Thêm câu hỏi">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleOpenQuestionDialog(test)}
                      >
                        <PlaylistAddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleViewTest(test)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sửa bài test">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(test)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa bài test">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTest(test.id)}
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
        maxWidth="sm"
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
          {editingTest ? '✏️ Chỉnh sửa Bài Test' : '➕ Tạo Bài Test mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên bài test"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <FormControl fullWidth required>
              <InputLabel>Loại bài test</InputLabel>
              <Select
                value={formData.type}
                label="Loại bài test"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {testTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Thời gian (phút)"
              fullWidth
              required
              type="number"
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({ ...formData, durationMinutes: Number(e.target.value) })
              }
              inputProps={{ min: 1 }}
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
            onClick={handleSaveTest}
            disabled={!formData.name || !formData.type}
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
            {editingTest ? 'Cập nhật' : 'Tạo mới'}
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
        <DialogTitle
          sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem', borderBottom: '2px solid #FF6C00' }}
        >
          📝 Chi tiết Bài Test
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewingTest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Tên bài test
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 600, color: '#FF6C00' }}>
                  {viewingTest.name}
                </Typography>
              </Box>

              {viewingTest.description && (
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Mô tả
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
                    <Typography variant="body1">{viewingTest.description}</Typography>
                  </Paper>
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <Box flex={1}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Loại
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewingTest.type}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Thời gian
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewingTest.durationMinutes} phút
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1, display: 'block' }}
                >
                  Câu hỏi ({viewingTest.questions?.length})
                </Typography>
                {viewingTest.questions && viewingTest.questions.length > 0 ? (
                  <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                    <Stack spacing={2}>
                      {viewingTest.questions.map((question, index) => (
                        <Paper
                          key={question.id}
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            borderColor: alpha('#FF6C00', 0.3),
                            bgcolor: '#FAFAFA',
                            position: 'relative',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF6C00' }}>
                              Câu {index + 1}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={question.difficulty}
                                size="small"
                                sx={{
                                  bgcolor:
                                    question.difficulty === 'Dễ'
                                      ? alpha('#4CAF50', 0.1)
                                      : question.difficulty === 'Trung bình'
                                      ? alpha('#FF9800', 0.1)
                                      : alpha('#F44336', 0.1),
                                  color:
                                    question.difficulty === 'Dễ'
                                      ? '#4CAF50'
                                      : question.difficulty === 'Trung bình'
                                      ? '#FF9800'
                                      : '#F44336',
                                  fontWeight: 600,
                                }}
                              />
                              <Tooltip title="Xóa câu hỏi">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveQuestion(viewingTest.id, question.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                            {question.content}
                          </Typography>

                          <Divider sx={{ mb: 2 }} />

                          <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontWeight: 600, display: 'block', mb: 1 }}
                          >
                            Các đáp án:
                          </Typography>

                          <Stack spacing={1}>
                            {Object.entries(question.options || {}).map(([key, value]) => {
                              const isCorrect = question.correctAnswer === key;
                              return (
                                <Box
                                  key={key}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: isCorrect ? alpha('#4CAF50', 0.1) : 'white',
                                    border: 1,
                                    borderColor: isCorrect ? '#4CAF50' : alpha('#000', 0.12),
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      mr: 2,
                                      minWidth: 30,
                                      color: isCorrect ? '#4CAF50' : 'text.primary',
                                    }}
                                  >
                                    {key}.
                                  </Typography>
                                  <Typography
                                    sx={{
                                      flex: 1,
                                      color: isCorrect ? '#4CAF50' : 'text.primary',
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                  {isCorrect && (
                                    <CheckCircleIcon sx={{ color: '#4CAF50', ml: 1 }} />
                                  )}
                                </Box>
                              );
                            })}
                          </Stack>

                          {question.explanation && (
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                variant="overline"
                                color="text.secondary"
                                sx={{ fontWeight: 600, display: 'block', mb: 1 }}
                              >
                                Giải thích:
                              </Typography>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 1.5,
                                  bgcolor: alpha('#2196F3', 0.05),
                                  borderColor: alpha('#2196F3', 0.2),
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  {question.explanation}
                                </Typography>
                              </Paper>
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Alert severity="info">Chưa có câu hỏi nào trong bài test này.</Alert>
                )}
              </Box>
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

      {/* Add Questions Dialog */}
      <Dialog
        open={questionDialogOpen}
        onClose={handleCloseQuestionDialog}
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
          ➕ Thêm Câu hỏi vào Bài Test
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn câu hỏi từ ngân hàng để thêm vào bài test
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 500, overflow: 'auto' }}>
            <List>
              {allQuestions.map((question) => (
                <ListItem
                  key={question.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: alpha('#FF6C00', 0.05) },
                  }}
                  onClick={() => handleToggleQuestion(question.id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedQuestionIds.includes(question.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={question.content}
                    secondary={`Độ khó: ${question.difficulty}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>
            Đã chọn: {selectedQuestionIds.length} câu hỏi
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseQuestionDialog}
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
            onClick={handleSaveQuestions}
            disabled={selectedQuestionIds.length === 0}
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
            Lưu ({selectedQuestionIds.length} câu)
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

export default TestManagementPage;
