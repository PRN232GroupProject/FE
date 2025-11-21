import React, { useState, useEffect, useMemo } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Card, CardContent, Typography, Stack, Chip, Button, alpha } from '@mui/material';
import {
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import type { IResource } from '../../types/content.types'; 
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import ResourcePlayer from './components/lesson/ResourcePlayer';
import ResourceSidebar from './components/lesson/ResourceSideBar';
import { useLessonDetail, useMarkResourceCompleted } from '../../hooks/useContent'; 

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // ✅ Thêm dòng này
  const lessonId = Number(id); 

  const {
    data: lesson,
    isLoading,
    isError,
  } = useLessonDetail(lessonId);

  const { mutate: markAsComplete, isPending: isMarkingComplete } =
    useMarkResourceCompleted();

  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);

  // ✅ FIX: Tính completed resources từ dữ liệu THẬT (không fake nữa)
  const completedResourcesList = useMemo(
    () => (lesson?.resources || []).filter((r) => r.isCompleted).map((r) => r.id),
    [lesson]
  );

  const totalResources = lesson?.resources?.length || 0;

  // ✅ FIX: Progress tính từ dữ liệu thật, sẽ tự update khi mark complete
  const progress =
    totalResources > 0
      ? Math.round((completedResourcesList.length / totalResources) * 100)
      : 0;

  // Auto-select first resource khi load lesson
  useEffect(() => {
    if (lesson && lesson.resources.length > 0) {
      if (!selectedResource) {
        setSelectedResource(lesson.resources[0]);
      }
    }
  }, [lesson, selectedResource]); 

  // ✅ FIX: Handle mark complete với callback
  const handleResourceComplete = (resourceId: number) => {
    markAsComplete(resourceId, {
      onSuccess: () => {
        console.log('✅ Resource marked complete, UI will auto-update via invalidateQueries');
        // Không cần setState gì thêm, useQuery sẽ tự refetch
      },
      onError: (error) => {
        console.error('❌ Failed to mark complete:', error);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !lesson) {
    return <EmptyState title="Không tìm thấy bài học" />;
  }

  return (
    <Box>
      {/* Banner Header */}
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
            {/* ✅ HIỂN THỊ REAL-TIME PROGRESS */}
            <Chip
              icon={<CheckCircleIcon />}
              label={`${completedResourcesList.length}/${lesson.resources.length} hoàn thành`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            {/* ✅ PROGRESS BAR REAL-TIME */}
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
                      transition: 'width 0.5s ease', // Smooth animation
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 45 }}>
                  {progress}%
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
        {/* Main Content - Video/PDF Player */}
        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 3 }, borderRadius: 3 }}>
            <ResourcePlayer
              resource={selectedResource}
              isCompleted={
                selectedResource ? completedResourcesList.includes(selectedResource.id) : false
              }
              onComplete={handleResourceComplete}
              isMarkingComplete={isMarkingComplete} 
            />
          </Paper>
        </Box>

        {/* Sidebar - Resource List */}
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <ResourceSidebar
            resources={lesson.resources}
            selectedResource={selectedResource}
            completedResources={completedResourcesList} 
            onSelectResource={setSelectedResource}
          />

          {/* ✅ FIX: 2 nút navigation */}
          <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
              Hoàn thành bài học?
            </Typography>
            
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {/* Nút 1: Về trang chủ */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
                sx={{ borderRadius: 2, py: 1.2 }}
              >
                Về trang chủ
              </Button>

              {/* Nút 2: Làm bài kiểm tra */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate('/tests')}
                sx={{ borderRadius: 2, py: 1.2 }}
                disabled={progress < 100}
              >
                Làm bài kiểm tra
              </Button>
            </Stack>

            {progress < 100 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', textAlign: 'center' }}>
                Hoàn thành tất cả tài liệu để mở khóa bài kiểm tra
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonPage;