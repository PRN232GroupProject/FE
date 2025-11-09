import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ILessonDetail, IResource } from '../../types/content.types';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  alpha,
  Button,
  Stack,
} from '@mui/material';
import ReactPlayer from 'react-player';
import {
  Videocam as VideocamIcon,
  PictureAsPdf as PictureAsPdfIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

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
          objectives: 'Hiểu rõ khái niệm axit, bazơ theo thuyết Arrhenius và Bronsted. Nắm vững cách tính pH và các phản ứng đặc trưng của axit, bazơ trong dung dịch.',
          resources: [
            { id: 1, title: 'Video bài giảng: Giới thiệu Axit-Bazơ', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { id: 2, title: 'Video: Phản ứng trung hòa', type: 'video', url: 'https://www.youtube.com/watch?v=L-2Of9aznxg' },
            { id: 3, title: 'Tài liệu PDF: Lý thuyết Axit-Bazơ', type: 'pdf', url: '/docs/axit_bazo.pdf' },
            { id: 4, title: 'Tài liệu PDF: Bài tập vận dụng', type: 'pdf', url: '/docs/bai_tap.pdf' },
          ],
        };
        setLesson(stubData);
        if (stubData.resources.length > 0) {
          setSelectedResource(stubData.resources[0]);
        }
        // Giả lập đã hoàn thành resource đầu tiên
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

  const renderResourceContent = () => {
    if (!selectedResource) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            color: 'text.secondary',
          }}
        >
          <DescriptionIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6">Chọn một tài liệu để xem</Typography>
        </Box>
      );
    }
    
    if (selectedResource.type === 'video') {
      return (
        <Box>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%',
              bgcolor: 'black',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ReactPlayer
              url={selectedResource.url}
              controls
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              onEnded={() => handleResourceComplete(selectedResource.id)}
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedResource.title}
            </Typography>
            {completedResources.includes(selectedResource.id) && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Đã hoàn thành"
                color="success"
                size="small"
              />
            )}
          </Box>
        </Box>
      );
    }
    
    if (selectedResource.type === 'pdf') {
      return (
        <Box>
          <Box
            sx={{
              height: '70vh',
              borderRadius: 2,
              overflow: 'hidden',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <iframe
              src={selectedResource.url}
              width="100%"
              height="100%"
              title={selectedResource.title}
              style={{ border: 'none' }}
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedResource.title}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleResourceComplete(selectedResource.id)}
              disabled={completedResources.includes(selectedResource.id)}
            >
              {completedResources.includes(selectedResource.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
            </Button>
          </Box>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary">
          Không tìm thấy bài học.
        </Typography>
      </Box>
    );
  }

  const progress = (completedResources.length / lesson.resources.length) * 100;

  return (
    <Box>
      {/* Header */}
      <Card
        elevation={3}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha('#0055A5', 0.9)})`,
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
            {renderResourceContent()}
          </Paper>
        </Box>

        {/* Sidebar - Resources List */}
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Tài liệu bài giảng
              </Typography>
              <Typography variant="caption">
                Hoàn thành {completedResources.length}/{lesson.resources.length}
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {lesson.resources.map((res, index) => {
                const isSelected = selectedResource?.id === res.id;
                const isCompleted = completedResources.includes(res.id);
                
                return (
                  <React.Fragment key={res.id}>
                    {index > 0 && <Box sx={{ borderTop: 1, borderColor: 'divider' }} />}
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSelectedResource(res)}
                        sx={{
                          py: 2,
                          px: 2,
                          bgcolor: isSelected ? alpha('#FF6C00', 0.1) : 'transparent',
                          '&:hover': {
                            bgcolor: isSelected ? alpha('#FF6C00', 0.15) : alpha('#0055A5', 0.05),
                          },
                        }}
                      >
                        <ListItemIcon>
                          {res.type === 'video' ? (
                            <VideocamIcon
                              sx={{
                                color: isSelected ? 'primary.main' : 'text.secondary',
                                fontSize: 28,
                              }}
                            />
                          ) : (
                            <PictureAsPdfIcon
                              sx={{
                                color: isSelected ? 'primary.main' : 'text.secondary',
                                fontSize: 28,
                              }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={res.title}
                          primaryTypographyProps={{
                            fontWeight: isSelected ? 600 : 400,
                            fontSize: '0.95rem',
                            color: isSelected ? 'primary.main' : 'text.primary',
                          }}
                        />
                        {isCompleted ? (
                          <CheckCircleIcon sx={{ color: 'success.main', ml: 1 }} />
                        ) : (
                          <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', ml: 1 }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>

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