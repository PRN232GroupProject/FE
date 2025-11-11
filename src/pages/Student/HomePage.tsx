import React, { useEffect, useState } from 'react';
import type { IChapter } from '../../types/content.types';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Button,
  alpha,
  LinearProgress,
  Stack,
  TextField,
  InputAdornment,
  ListItemButton,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
  MenuBook as BookIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const gradeTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi ĐH' },
];

const HomePage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user } = useAuthStore();
  
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      
      const gradeFilter = selectedGrade === 'all' ? null : parseInt(selectedGrade);
      
      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   let gradeToFetch = gradeFilter;
      //   if (isAuthenticated && user && !gradeFilter) {
      //     gradeToFetch = user.grade; 
      //     setSelectedGrade(user.grade.toString());
      //   }
      //
      //   const response = await contentService.getChapters({ grade: gradeToFetch });
      //   setChapters(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách chương", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: IChapter[] = [
          {
            id: 1,
            name: 'Chương 1: Sự điện li',
            grade: 11,
            description:
              'Nội dung về chất điện li, axit, bazơ, muối, pH và các phản ứng trao đổi ion.',
            lessons: [
              { id: 1, title: 'Bài 1: Axit, Bazơ và Muối' },
              { id: 2, title: 'Bài 2: pH và Chất chỉ thị' },
              { id: 3, title: 'Bài 3: Phản ứng trao đổi ion' },
            ],
          },
          {
            id: 2,
            name: 'Chương 2: Nitơ - Photpho',
            grade: 11,
            description:
              'Các hợp chất của Nitơ, Photpho và các bài toán liên quan đến chu trình Nitơ.',
            lessons: [
              { id: 4, title: 'Bài 4: Amoniac (NH3)' },
              { id: 5, title: 'Bài 5: Axit Nitric (HNO3)' },
            ],
          },
          {
            id: 3,
            name: 'Chương 3: Carbon - Silic',
            grade: 11,
            description:
              'Nghiên cứu về Carbon, Silic, các hợp chất vô cơ và ứng dụng trong đời sống.',
            lessons: [
              { id: 6, title: 'Bài 6: Carbon và hợp chất' },
              { id: 7, title: 'Bài 7: Silic và Silicat' },
              { id: 8, title: 'Bài 8: Công nghiệp Silicate' },
            ],
          },
          {
            id: 4,
            name: 'Chương 4: Đại cương kim loại',
            grade: 12,
            description:
              'Tính chất chung của kim loại, dãy điện hóa và các phản ứng oxi hóa - khử.',
            lessons: [
              { id: 9, title: 'Bài 9: Tính chất chung của kim loại' },
              { id: 10, title: 'Bài 10: Dãy điện hóa kim loại' },
            ],
          },
          {
            id: 5,
            name: 'Chương 5: Polyme',
            grade: 12,
            description:
              'Khái niệm, cấu trúc, và ứng dụng của vật liệu polyme.',
            lessons: [
              { id: 11, title: 'Bài 11: Đại cương về Polyme' },
              { id: 12, title: 'Bài 12: Vật liệu Polyme' },
            ],
          },
          {
            id: 6,
            name: 'Chương 1: Bảng tuần hoàn (Lớp 10)',
            grade: 10,
            description:
              'Cấu trúc bảng tuần hoàn, định luật tuần hoàn, và xu hướng biến đổi.',
            lessons: [
              { id: 13, title: 'Bài 13: Bảng tuần hoàn' },
              { id: 14, title: 'Bài 14: Xu hướng biến đổi' },
            ],
          },
        ];
        
        let filteredData = stubData;
        if (gradeFilter) {
          filteredData = stubData.filter(c => c.grade === gradeFilter);
        }
        
        setChapters(filteredData);
        setLoading(false);
      }, 500);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchChapters();
  }, [selectedGrade, isAuthenticated, user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const filteredChaptersBySearch = chapters.filter((chapter) =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Chào mừng đến với khóa học Hóa học!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
            Khám phá thế giới hóa học thông qua các bài giảng video và tài liệu chuyên sâu
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip
              icon={<SchoolIcon />}
              label={`${chapters.length} Chương học`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip
              icon={<BookIcon />}
              label={`${chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)} Bài học`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
          </Stack>
        </Box>

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
            position: 'absolute',
            bottom: -30,
            right: 100,
            width: 150,
            height: 150,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
          Danh sách Chương học
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm chương học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { sm: 300 } }}
        />
      </Box>

      <Paper elevation={2} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={selectedGrade}
          onChange={(_, newValue) => setSelectedGrade(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '0.9rem',
              fontWeight: 600,
            },
          }}
        >
          {gradeTabs.map((tab) => (
            <Tab
              key={tab.value}
              icon={<SchoolIcon fontSize="small" />}
              iconPosition="start"
              label={tab.label}
              value={tab.value.toString()}
            />
          ))}
        </Tabs>
      </Paper>

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr',
          lg: '1fr 1fr 1fr',
        }}
      >
        {filteredChaptersBySearch.map((chapter) => {
          const completedLessons = Math.floor(Math.random() * chapter.lessons.length);
          const progress = (completedLessons / chapter.lessons.length) * 100;

          return (
            <Card
              key={chapter.id}
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8,
                },
              }}
            >
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={`Lớp ${chapter.grade === 13 ? 'ĐH' : chapter.grade}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={`${chapter.lessons.length} bài`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {chapter.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <Typography variant="caption">
                  {completedLessons}/{chapter.lessons.length} bài hoàn thành
                </Typography>
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: 40 }}
                >
                  {chapter.description}
                </Typography>

                <Box sx={{ mb: 2, flexGrow: 1 }}>
                  {chapter.lessons.map((lesson, idx) => (
                    <ListItemButton
                      key={lesson.id}
                      component={RouterLink}
                      to={`/lesson/${lesson.id}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1,
                        px: 1,
                        borderRadius: 2,
                        borderBottom: idx < chapter.lessons.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: alpha('#FF6C00', 0.05),
                        },
                      }}
                    >
                      {idx < completedLessons ? (
                        <CheckIcon
                          sx={{ mr: 1.5, color: 'success.main', fontSize: 20 }}
                        />
                      ) : (
                        <PlayIcon
                          sx={{ mr: 1.5, color: 'text.secondary', fontSize: 20 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          fontWeight: idx < completedLessons ? 600 : 400,
                          color:
                            idx < completedLessons ? 'text.primary' : 'text.secondary',
                        }}
                      >
                        {lesson.title}
                      </Typography>
                    </ListItemButton>
                  ))}
                </Box>

                <Button
                  component={RouterLink}
                  to={`/lesson/${chapter.lessons[0].id}`}
                  variant="contained"
                  fullWidth
                  startIcon={<PlayIcon />}
                  sx={{
                    mt: 'auto',
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 600,
                  }}
                >
                  Bắt đầu học
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {filteredChaptersBySearch.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy chương học nào
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;