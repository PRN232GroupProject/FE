import React, { useEffect, useState } from 'react';
import type { IChapter } from '../../types/content.types';
import { contentService } from '../../services/features/content.service';
import { userService } from '../../services/features/user.service';
import { authService } from '../../services/features/auth.service';
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, loginToStore } = useAuthStore();
  
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Get user role on mount
  useEffect(() => {
    const role = authService.getRole();
    setUserRole(role);
    console.log('User role:', role);
  }, []);

  // Fetch user data on mount if not already loaded
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const userResponse = await userService.getCurrentUser();
            loginToStore(token, userResponse.data);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user, loginToStore]);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      
      try {
        const response = await contentService.getChapters();
        let allChapters = response.data;

        console.log('Fetched chapters:', allChapters);

        // Filter by selected grade if not 'all'
        if (selectedGrade !== 'all') {
          allChapters = allChapters.filter(
            (chapter) => chapter.grade.toString() === selectedGrade
          );
        }

        setChapters(allChapters);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [selectedGrade]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const filteredChaptersBySearch = chapters.filter((chapter) =>
    chapter.chapterName.toLowerCase().includes(searchTerm.toLowerCase())
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
              label={`${chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)} Bài học`}
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
          const lessonsCount = chapter.lessons?.length || 0;
          const completedLessons = Math.floor(Math.random() * lessonsCount);
          const progress = lessonsCount > 0 ? (completedLessons / lessonsCount) * 100 : 0;

          return (
            <Card
              key={chapter.chapterId}
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
                    label={`${lessonsCount} bài`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {chapter.chapterName}
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
                  {completedLessons}/{lessonsCount} bài hoàn thành
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
                  {chapter.lessons?.map((lesson, idx) => (
                    <ListItemButton
                      key={lesson.lessonId}
                      component={RouterLink}
                      to={`/lesson/${lesson.lessonId}`}
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

                {lessonsCount > 0 && (
                  <Button
                    component={RouterLink}
                    to={`/lesson/${chapter.lessons[0].lessonId}`}
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
                )}
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