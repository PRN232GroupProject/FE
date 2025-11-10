import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IChapter } from '../../types/content.types'; // Sử dụng lại type IChapter
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  alpha,
  LinearProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const LessonListPage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await contentService.getChaptersWithProgress();
      //   setChapters(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách chương", error);
      // } finally {
      //   setLoading(false);
      // }
      // Dữ liệu cứng
      setTimeout(() => {
        const stubData: IChapter[] = [
          {
            id: 1,
            name: 'Chương 1: Sự điện li',
            grade: 11,
            description: 'Nội dung về chất điện li, axit, bazơ, muối...',
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
            description: 'Các hợp chất của Nitơ, Photpho...',
            lessons: [
              { id: 4, title: 'Bài 4: Amoniac (NH3)' },
              { id: 5, title: 'Bài 5: Axit Nitric (HNO3)' },
            ],
          },
          {
            id: 3,
            name: 'Chương 3: Carbon - Silic',
            grade: 11,
            description: 'Nghiên cứu về Carbon, Silic...',
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
            description: 'Tính chất chung của kim loại...',
            lessons: [
              { id: 9, title: 'Bài 9: Tính chất chung của kim loại' },
              { id: 10, title: 'Bài 10: Dãy điện hóa kim loại' },
            ],
          },
        ];
        setChapters(stubData);
        setLoading(false);
      }, 800);
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
      {/* Header */}
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
          Danh sách Bài học
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95 }}>
          Toàn bộ chương trình Hóa học lớp 11
        </Typography>
      </Box>

      {/* Danh sách chương (dạng Accordion) */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
          Nội dung khóa học
        </Typography>

        {chapters.map((chapter, index) => {
          // Dữ liệu giả về tiến độ
          const completedLessons = Math.floor(Math.random() * chapter.lessons.length);
          const progress = (completedLessons / chapter.lessons.length) * 100;

          return (
            <Accordion
              key={chapter.id}
              defaultExpanded={index === 0} // Mở chương đầu tiên
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: 2,
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: '16px 0',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 3,
                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Chip
                      icon={<SchoolIcon />}
                      label={`Lớp ${chapter.grade}`}
                      size="small"
                      color="primary"
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {chapter.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha('#FF6C00', 0.1),
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 120 }}>
                      {completedLessons}/{chapter.lessons.length} bài hoàn thành
                    </Typography>
                  </Stack>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {chapter.lessons.map((lesson, idx) => (
                    <ListItem key={lesson.id} disablePadding>
                      <ListItemButton
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        sx={{
                          py: 2,
                          px: 3,
                          borderTop: 1,
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: alpha('#FF6C00', 0.05),
                          },
                        }}
                      >
                        <ListItemIcon>
                          {idx < completedLessons ? (
                            <CheckIcon sx={{ color: 'success.main' }} />
                          ) : (
                            <PlayIcon sx={{ color: 'text.secondary' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.title}
                          primaryTypographyProps={{
                            fontWeight: idx < completedLessons ? 600 : 400,
                            color: idx < completedLessons ? 'text.primary' : 'text.secondary',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Paper>
    </Box>
  );
};

export default LessonListPage;