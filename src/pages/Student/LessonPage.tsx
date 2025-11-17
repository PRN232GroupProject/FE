import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Card, CardContent, Typography, Stack, Chip, Button, alpha } from '@mui/material';
import {
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import type { ILessonDetail, IResource } from '../../types/content.types';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import ResourcePlayer from './components/lesson/ResourcePlayer';
import ResourceSidebar from './components/lesson/ResourceSideBar';

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<ILessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);
  const [completedResources, setCompletedResources] = useState<number[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchLesson = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await contentService.getLessonDetail(id);
      //   setLesson(response.data);
      //   if (response.data.resources.length > 0) {
      //     setSelectedResource(response.data.resources[0]);
      //   }
      // } catch (error) {
      //   console.error("Lỗi khi tải bài học", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: ILessonDetail = {
          id: parseInt(id),
          title: `Bài ${id}: Axit, Bazơ và Muối`,
          objectives:
            'Hiểu rõ khái niệm axit, bazơ theo thuyết Arrhenius và Bronsted. Nắm vững cách tính pH và các phản ứng đặc trưng của axit, bazơ trong dung dịch.',
          resources: [
            {
              id: 1,
              title: 'Video bài giảng: Giới thiệu Axit-Bazơ',
              type: 'video',
              url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
              id: 2,
              title: 'Video: Phản ứng trung hòa',
              type: 'video',
              url: 'https://www.youtube.com/watch?v=L-2Of9aznxg',
            },
            {
              id: 3,
              title: 'Tài liệu PDF: Lý thuyết Axit-Bazơ',
              type: 'pdf',
              url: '/docs/axit_bazo.pdf',
            },
            {
              id: 4,
              title: 'Tài liệu PDF: Bài tập vận dụng',
              type: 'pdf',
              url: '/docs/bai_tap.pdf',
            },
          ],
        };
        setLesson(stubData);
        if (stubData.resources.length > 0) {
          setSelectedResource(stubData.resources[0]);
        }
        setCompletedResources([1]);
        setLoading(false);
      }, 800);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };
    fetchLesson();
  }, [id]);

  const handleResourceComplete = (resourceId: number) => {
    if (!completedResources.includes(resourceId)) {
      setCompletedResources([...completedResources, resourceId]);
      // API call để lưu tiến độ
      // await contentService.markResourceComplete(resourceId);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!lesson) {
    return <EmptyState title="Không tìm thấy bài học" />;
  }

  const progress = (completedResources.length / lesson.resources.length) * 100;

  return (
    <Box>
      {/* Header */}
      <Card
        elevation={3}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha(
            '#0055A5',
            0.9
          )})`,
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {lesson.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.95 }}>
            <strong>Mục tiêu:</strong> {lesson.objectives}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<DescriptionIcon />}
              label={`${lesson.resources.length} tài liệu`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={`${completedResources.length}/${lesson.resources.length} hoàn thành`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${progress}%`,
                      height: '100%',
                      bgcolor: 'white',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 45 }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Main Content */}
        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <ResourcePlayer
              resource={selectedResource}
              isCompleted={
                selectedResource ? completedResources.includes(selectedResource.id) : false
              }
              onComplete={handleResourceComplete}
            />
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <ResourceSidebar
            resources={lesson.resources}
            selectedResource={selectedResource}
            completedResources={completedResources}
            onSelectResource={setSelectedResource}
          />

          {/* Quick Action */}
          <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Đã hoàn thành bài học?
            </Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PlayArrowIcon />}
              sx={{ mt: 1, borderRadius: 2, py: 1.2 }}
            >
              Làm bài kiểm tra
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonPage;