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
  Collapse,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { contentService } from '../../services/features/content.service';
import type { IChapter, ILessonInfo } from '../../types/content.types';

const gradeOptions = [
  { value: 8, label: 'Lớp 8' },
  { value: 9, label: 'Lớp 9' },
  { value: 10, label: 'Lớp 10' },
  { value: 11, label: 'Lớp 11' },
  { value: 12, label: 'Lớp 12' },
  { value: 13, label: 'Ôn thi ĐH' },
];

interface ChapterFormData {
  chapterName: string;
  grade: number;
  description: string;
}

interface LessonFormData {
  title: string;
  objectives: string;
  content: string;
  chapterId: number;
}

const ChapterManagementPage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  
  // Chapter dialog states
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<IChapter | null>(null);
  const [chapterFormData, setChapterFormData] = useState<ChapterFormData>({
    chapterName: '',
    grade: 10,
    description: '',
  });

  // Lesson dialog states
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILessonInfo | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [lessonFormData, setLessonFormData] = useState<LessonFormData>({
    title: '',
    objectives: '',
    content: '',
    chapterId: 0,
  });

  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const response = await contentService.getChapters();
      setChapters(response.data);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải danh sách chương', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // === CHAPTER HANDLERS ===
  const handleOpenChapterDialog = (chapter?: IChapter) => {
    if (chapter) {
      setEditingChapter(chapter);
      setChapterFormData({
        chapterName: chapter.chapterName,
        grade: chapter.grade,
        description: chapter.description,
      });
    } else {
      setEditingChapter(null);
      setChapterFormData({
        chapterName: '',
        grade: 10,
        description: '',
      });
    }
    setChapterDialogOpen(true);
  };

  const handleCloseChapterDialog = () => {
    setChapterDialogOpen(false);
    setEditingChapter(null);
  };

  const handleSaveChapter = async () => {
    try {
      if (editingChapter) {
        await contentService.updateChapter(editingChapter.chapterId, chapterFormData);
        showSnackbar('Cập nhật chương thành công!', 'success');
      } else {
        await contentService.createChapter(chapterFormData);
        showSnackbar('Tạo chương mới thành công!', 'success');
      }
      handleCloseChapterDialog();
      fetchChapters();
    } catch (error: any) {
      showSnackbar(error.message || 'Lưu chương thất bại', 'error');
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa chương này? Tất cả bài học trong chương cũng sẽ bị xóa.')) {
      return;
    }
    try {
      await contentService.deleteChapter(chapterId);
      showSnackbar('Xóa chương thành công!', 'success');
      fetchChapters();
    } catch (error: any) {
      showSnackbar(error.message || 'Xóa chương thất bại', 'error');
    }
  };

  // === LESSON HANDLERS ===
  const handleOpenLessonDialog = (chapterId: number, lesson?: ILessonInfo) => {
    setSelectedChapterId(chapterId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonFormData({
        title: lesson.title,
        objectives: lesson.objectives,
        content: lesson.content,
        chapterId: chapterId,
      });
    } else {
      setEditingLesson(null);
      setLessonFormData({
        title: '',
        objectives: '',
        content: '',
        chapterId: chapterId,
      });
    }
    setLessonDialogOpen(true);
  };

  const handleCloseLessonDialog = () => {
    setLessonDialogOpen(false);
    setEditingLesson(null);
    setSelectedChapterId(null);
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson) {
        await contentService.updateLesson(editingLesson.lessonId, lessonFormData);
        showSnackbar('Cập nhật bài học thành công!', 'success');
      } else {
        await contentService.createLesson(lessonFormData);
        showSnackbar('Tạo bài học mới thành công!', 'success');
      }
      handleCloseLessonDialog();
      fetchChapters();
    } catch (error: any) {
      showSnackbar(error.message || 'Lưu bài học thất bại', 'error');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài học này?')) {
      return;
    }
    try {
      await contentService.deleteLesson(lessonId);
      showSnackbar('Xóa bài học thành công!', 'success');
      fetchChapters();
    } catch (error: any) {
      showSnackbar(error.message || 'Xóa bài học thất bại', 'error');
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
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha('#0055A5', 0.9)})`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Quản lý Chương & Bài học
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              Tạo, chỉnh sửa và quản lý nội dung khóa học
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenChapterDialog()}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
          >
            Thêm Chương mới
          </Button>
        </Box>
      </Box>

      {/* Chapters List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {chapters.map((chapter) => (
          <Card key={chapter.chapterId} elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={() => setExpandedChapter(expandedChapter === chapter.chapterId ? null : chapter.chapterId)}
                  >
                    {expandedChapter === chapter.chapterId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                  <SchoolIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {chapter.chapterName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chapter.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={`Lớp ${chapter.grade === 13 ? 'ĐH' : chapter.grade}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<BookIcon />}
                    label={`${chapter.lessons?.length || 0} bài học`}
                    color="secondary"
                    variant="outlined"
                  />
                  <Tooltip title="Sửa chương">
                    <IconButton color="primary" onClick={() => handleOpenChapterDialog(chapter)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa chương">
                    <IconButton color="error" onClick={() => handleDeleteChapter(chapter.chapterId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Collapse in={expandedChapter === chapter.chapterId}>
                <Box sx={{ mt: 2, pl: 7 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Danh sách Bài học
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenLessonDialog(chapter.chapterId)}
                    >
                      Thêm Bài học
                    </Button>
                  </Box>

                  {chapter.lessons && chapter.lessons.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Tên bài học</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mục tiêu</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {chapter.lessons.map((lesson) => (
                            <TableRow key={lesson.lessonId}>
                              <TableCell>{lesson.title}</TableCell>
                              <TableCell>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 400 }}>
                                  {lesson.objectives}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenLessonDialog(chapter.chapterId, lesson)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteLesson(lesson.lessonId)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">Chương này chưa có bài học nào. Nhấn "Thêm Bài học" để bắt đầu.</Alert>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Chapter Dialog */}
      <Dialog open={chapterDialogOpen} onClose={handleCloseChapterDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingChapter ? 'Chỉnh sửa Chương' : 'Tạo Chương mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên chương"
              fullWidth
              required
              value={chapterFormData.chapterName}
              onChange={(e) => setChapterFormData({ ...chapterFormData, chapterName: e.target.value })}
            />
            <TextField
              select
              label="Khối lớp"
              fullWidth
              required
              value={chapterFormData.grade}
              onChange={(e) => setChapterFormData({ ...chapterFormData, grade: Number(e.target.value) })}
            >
              {gradeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Mô tả"
              fullWidth
              required
              multiline
              rows={4}
              value={chapterFormData.description}
              onChange={(e) => setChapterFormData({ ...chapterFormData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChapterDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSaveChapter}
            disabled={!chapterFormData.chapterName || !chapterFormData.description}
          >
            {editingChapter ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onClose={handleCloseLessonDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLesson ? 'Chỉnh sửa Bài học' : 'Tạo Bài học mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tiêu đề bài học"
              fullWidth
              required
              value={lessonFormData.title}
              onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
            />
            <TextField
              label="Mục tiêu bài học"
              fullWidth
              required
              multiline
              rows={3}
              value={lessonFormData.objectives}
              onChange={(e) => setLessonFormData({ ...lessonFormData, objectives: e.target.value })}
            />
            <TextField
              label="Nội dung bài học"
              fullWidth
              required
              multiline
              rows={6}
              value={lessonFormData.content}
              onChange={(e) => setLessonFormData({ ...lessonFormData, content: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLessonDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSaveLesson}
            disabled={!lessonFormData.title || !lessonFormData.objectives || !lessonFormData.content}
          >
            {editingLesson ? 'Cập nhật' : 'Tạo mới'}
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

export default ChapterManagementPage;
