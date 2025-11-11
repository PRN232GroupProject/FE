import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT LẠI
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Button,
  alpha,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface ITest {
  id: number;
  name: string;
  type: string;
  duration: number; // phút
  totalQuestions: number;
  chapterId: number;
  chapterName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade?: number; // Thêm grade để lọc
  lastAttempt?: {
    score: number;
    date: string;
    completed: boolean;
  };
}

const gradeFilters = [
  { value: 'all', label: 'Tất cả Khối lớp' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi ĐH' },
];

const typeFilters = [
  { value: 'all', label: 'Tất cả các loại' },
  { value: 'Sau bài học', label: 'Sau bài học' },
  { value: '15 phút', label: '15 phút' },
  { value: '1 tiết', label: '1 tiết' },
  { value: 'Học kỳ', label: 'Học kỳ' },
  { value: 'Tốt nghiệp', label: 'Tốt nghiệp' },
  { value: 'Đại học', label: 'Đại học' },
];

const TestListPage: React.FC = () => {
  const navigate = useNavigate(); // <-- 2. KHAI BÁO LẠI
  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not-completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const params = {
      //     status: statusFilter,
      //     grade: gradeFilter === 'all' ? null : gradeFilter,
      //     type: typeFilter === 'all' ? null : typeFilter,
      //     search: searchTerm
      //   }
      //   const response = await testService.getAllTests(params);
      //   setTests(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách bài kiểm tra", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: ITest[] = [
          {
            id: 1,
            name: 'Kiểm tra sau bài học - Axit, Bazơ và Muối',
            type: 'Sau bài học',
            duration: 15,
            totalQuestions: 10,
            chapterId: 1,
            chapterName: 'Chương 1: Sự điện li',
            difficulty: 'easy',
            grade: 11,
            lastAttempt: {
              score: 8.5,
              date: '2025-11-08',
              completed: true,
            },
          },
          {
            id: 2,
            name: 'Kiểm tra 15 phút - Chương 1: Sự điện li',
            type: '15 phút',
            duration: 15,
            totalQuestions: 15,
            chapterId: 1,
            chapterName: 'Chương 1: Sự điện li',
            difficulty: 'medium',
            grade: 11,
            lastAttempt: {
              score: 7.0,
              date: '2025-11-07',
              completed: true,
            },
          },
          {
            id: 3,
            name: 'Kiểm tra 1 tiết - Chương 1 và 2',
            type: '1 tiết',
            duration: 45,
            totalQuestions: 30,
            chapterId: 1,
            chapterName: 'Chương 1-2',
            difficulty: 'hard',
            grade: 11,
          },
          {
            id: 4,
            name: 'Kiểm tra sau bài học - Amoniac (NH3)',
            type: 'Sau bài học',
            duration: 15,
            totalQuestions: 10,
            chapterId: 2,
            chapterName: 'Chương 2: Nitơ - Photpho',
            difficulty: 'easy',
            grade: 11,
          },
          {
            id: 5,
            name: 'Kiểm tra học kỳ I - Lớp 11',
            type: 'Học kỳ',
            duration: 90,
            totalQuestions: 40,
            chapterId: 0,
            chapterName: 'Tổng hợp',
            difficulty: 'hard',
            grade: 11,
          },
          {
            id: 6,
            name: 'Đề thi tốt nghiệp THPT - Mẫu 1',
            type: 'Tốt nghiệp',
            duration: 50,
            totalQuestions: 40,
            chapterId: 0,
            chapterName: 'Tổng hợp',
            difficulty: 'hard',
            grade: 13,
          },
          {
            id: 7,
            name: 'Đề thi Đại học - Khối A năm 2024',
            type: 'Đại học',
            duration: 90,
            totalQuestions: 50,
            chapterId: 0,
            chapterName: 'Tổng hợp',
            difficulty: 'hard',
            grade: 13,
          },
           {
            id: 8,
            name: 'Kiểm tra Hóa 10 - Mới',
            type: '15 phút',
            duration: 15,
            totalQuestions: 10,
            chapterId: 0,
            chapterName: 'Chương 1: Hóa 10',
            difficulty: 'medium',
            grade: 10,
          },
        ];
        
        const filtered = stubData
          .filter(t => statusFilter === 'all' ? true : (statusFilter === 'completed' ? t.lastAttempt?.completed : !t.lastAttempt?.completed))
          .filter(t => gradeFilter === 'all' ? true : t.grade?.toString() === gradeFilter)
          .filter(t => typeFilter === 'all' ? true : t.type === typeFilter)
          .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
          
        setTests(filtered);
        setLoading(false);
      }, 500);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchTests();
  }, [statusFilter, searchTerm, gradeFilter, typeFilter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const completedCount = tests.filter((t) => t.lastAttempt?.completed).length;
  const averageScore =
    tests
      .filter((t) => t.lastAttempt)
      .reduce((acc, t) => acc + (t.lastAttempt?.score || 0), 0) /
    (tests.filter((t) => t.lastAttempt).length || 1);

  return (
    <Box>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha(
            '#0055A5',
            0.9,
          )} 100%)`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Bài kiểm tra
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
          Rèn luyện và nâng cao kiến thức qua các bài kiểm tra
        </Typography>

        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr 1fr',
          }}
        >
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <QuizIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {tests.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng số bài test
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {completedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã hoàn thành
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              {averageScore.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điểm trung bình
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(12, 1fr)',
          }}
          alignItems="center"
        >
          <Box sx={{ gridColumn: { sm: 'span 12' } }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant={statusFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('all')}
              >
                Tất cả ({tests.length})
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('completed')}
                color="success"
              >
                Đã hoàn thành ({completedCount})
              </Button>
              <Button
                variant={statusFilter === 'not-completed' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('not-completed')}
                color="warning"
              >
                Chưa làm ({tests.length - completedCount})
              </Button>
            </Stack>
          </Box>
          
          <Box sx={{ gridColumn: { sm: 'span 4' } }}>
            <FormControl fullWidth>
              <InputLabel>Lọc theo Lớp</InputLabel>
              <Select
                value={gradeFilter}
                label="Lọc theo Lớp"
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                {gradeFilters.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ gridColumn: { sm: 'span 4' } }}>
            <FormControl fullWidth>
              <InputLabel>Lọc theo Loại bài thi</InputLabel>
              <Select
                value={typeFilter}
                label="Lọc theo Loại bài thi"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {typeFilters.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ gridColumn: { sm: 'span 4' } }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm bài kiểm tra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Paper>

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr 1fr',
        }}
      >
        {tests.map((test) => {
          const isCompleted = test.lastAttempt?.completed || false;

          return (
            <Card
              key={test.id}
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8,
                },
              }}
            >
              {isCompleted && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Đã làm"
                  color="success"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    fontWeight: 600,
                  }}
                />
              )}

              <Box
                sx={{
                  background: `linear-gradient(135deg, ${alpha(
                    '#FF6C00',
                    0.8,
                  )}, ${alpha('#0055A5', 0.8)})`,
                  p: 2.5,
                  color: 'white',
                }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip
                    label={test.type}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={getDifficultyLabel(test.difficulty)}
                    size="small"
                    color={getDifficultyColor(test.difficulty) as any}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {test.name}
                </Typography>
                <Typography variant="caption">{test.chapterName}</Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Stack spacing={2} sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>{test.duration}</strong> phút
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuizIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>{test.totalQuestions}</strong> câu hỏi
                    </Typography>
                  </Box>

                  {test.lastAttempt && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha('#4CAF50', 0.1),
                        borderRadius: 2,
                        borderLeft: 4,
                        borderColor: 'success.main',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AssessmentIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: 'success.main' }}
                        >
                          Lần làm gần nhất
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: 'success.main', mb: 0.5 }}
                      >
                        {test.lastAttempt.score.toFixed(1)} điểm
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(test.lastAttempt.date).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ flexGrow: 1 }} />

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrowIcon />}
                    onClick={() => navigate(`/test/${test.id}`)} // <-- 3. SỬ DỤNG LẠI
                    sx={{
                      mt: 'auto',
                      borderRadius: 2,
                      py: 1.2,
                      fontWeight: 600,
                    }}
                  >
                    {isCompleted ? 'Làm lại' : 'Bắt đầu'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {tests.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy bài kiểm tra nào
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestListPage;