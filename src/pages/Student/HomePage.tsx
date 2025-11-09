import React, { useEffect, useState } from 'react';
import type { IChapter } from '../../types/content.types';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  alpha,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await contentService.getChapters();
      //   setChapters(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách chương", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: IChapter[] = [
          {
            id: 1,
            name: 'Chương 1: Sự điện li',
            grade: 11,
            description: 'Nội dung về chất điện li, axit, bazơ, muối, pH và các phản ứng trao đổi ion.',
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
            description: 'Các hợp chất của Nitơ, Photpho và các bài toán liên quan đến chu trình Nitơ.',
            lessons: [
              { id: 4, title: 'Bài 4: Amoniac (NH3)' },
              { id: 5, title: 'Bài 5: Axit Nitric (HNO3)' },
            ],
          },
          {
            id: 3,
            name: 'Chương 3: Carbon - Silic',
            grade: 11,
            description: 'Nghiên cứu về Carbon, Silic, các hợp chất vô cơ và ứng dụng trong đời sống.',
            lessons: [
              { id: 6, title: 'Bài 6: Carbon và hợp chất' },
              { id: 7, title: 'Bài 7: Silic và Silicat' },
              { id: 8, title: 'Bài 8: Công nghiệp Silicate' },
            ],
          },
          {
            id: 4,
            name: 'Chương 4: Đại cương kim loại',
            grade: 11,
            description: 'Tính chất chung của kim loại, dãy điện hóa và các phản ứng oxi hóa - khử.',
            lessons: [
              { id: 9, title: 'Bài 9: Tính chất chung của kim loại' },
              { id: 10, title: 'Bài 10: Dãy điện hóa kim loại' },
            ],
          },
        ];
        setChapters(stubData);
        setLoading(false);
      }, 800);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchChapters();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha('#0055A5', 0.9)} 100%)`,
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
        
        {/* Decorative elements */}
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

      {/* Chapters Grid */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Danh sách Chương học
      </Typography>
      
      <Grid container spacing={3}>
        {chapters.map((chapter) => {
          const completedLessons = Math.floor(Math.random() * chapter.lessons.length);
          const progress = (completedLessons / chapter.lessons.length) * 100;
          
          return (
            <Grid item xs={12} sm={6} lg={4} key={chapter.id}>
              <Card
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
                    background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.8)}, ${alpha('#0055A5', 0.8)})`,
                    p: 2.5,
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      icon={<SchoolIcon />}
                      label={`Lớp ${chapter.grade}`}
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

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {chapter.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {chapter.lessons.map((lesson, idx) => (
                      <Box
                        key={lesson.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 1,
                          borderBottom: idx < chapter.lessons.length - 1 ? 1 : 0,
                          borderColor: 'divider',
                        }}
                      >
                        {idx < completedLessons ? (
                          <CheckIcon sx={{ mr: 1.5, color: 'success.main', fontSize: 20 }} />
                        ) : (
                          <PlayIcon sx={{ mr: 1.5, color: 'text.secondary', fontSize: 20 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            flexGrow: 1,
                            fontWeight: idx < completedLessons ? 600 : 400,
                            color: idx < completedLessons ? 'text.primary' : 'text.secondary',
                          }}
                        >
                          {lesson.title}
                        </Typography>
                      </Box>
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
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default HomePage;