import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  alpha,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Folder as FolderIcon,
  VideoLibrary as VideoIcon,
  PictureAsPdf as PdfIcon,
  Description as DocumentIcon,
  Link as LinkIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { chapterService } from '../../services/features/chapter.service';
import { lessonService } from '../../services/features/lesson.service';
import { resourceService } from '../../services/features/resource.service';
import type { IChapterResponse, ILessonResponse, IResourceResponse } from '../../types/content.types';

interface DashboardStats {
  totalChapters: number;
  totalLessons: number;
  totalResources: number;
  resourcesByType: {
    video: number;
    pdf: number;
    document: number;
    link: number;
  };
  chaptersByGrade: {
    grade: number;
    count: number;
  }[];
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [chaptersRes, lessonsRes, resourcesRes] = await Promise.all([
        chapterService.getAllChapters(),
        lessonService.getAllLessons(),
        resourceService.getAllResources(),
      ]);

      const chapters: IChapterResponse[] = chaptersRes.data;
      const lessons: ILessonResponse[] = lessonsRes.data;
      const resources: IResourceResponse[] = resourcesRes.data;

      // Calculate stats
      const resourcesByType = {
        video: resources.filter((r) => r.resourceType === 'video').length,
        pdf: resources.filter((r) => r.resourceType === 'pdf').length,
        document: resources.filter((r) => r.resourceType === 'document').length,
        link: resources.filter((r) => r.resourceType === 'link').length,
      };

      // Group chapters by grade
      const gradeMap = new Map<number, number>();
      chapters.forEach((chapter) => {
        gradeMap.set(chapter.grade, (gradeMap.get(chapter.grade) || 0) + 1);
      });

      const chaptersByGrade = Array.from(gradeMap.entries())
        .map(([grade, count]) => ({ grade, count }))
        .sort((a, b) => a.grade - b.grade);

      setStats({
        totalChapters: chapters.length,
        totalLessons: lessons.length,
        totalResources: resources.length,
        resourcesByType,
        chaptersByGrade,
      });
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Tổng số Chương',
      value: stats.totalChapters,
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      color: '#FF6C00',
      bgColor: alpha('#FF6C00', 0.1),
    },
    {
      title: 'Tổng số Bài học',
      value: stats.totalLessons,
      icon: <MenuBookIcon sx={{ fontSize: 48 }} />,
      color: '#0055A5',
      bgColor: alpha('#0055A5', 0.1),
    },
    {
      title: 'Tổng số Tài nguyên',
      value: stats.totalResources,
      icon: <FolderIcon sx={{ fontSize: 48 }} />,
      color: '#388E3C',
      bgColor: alpha('#388E3C', 0.1),
    },
  ];

  const resourceTypeCards = [
    {
      title: 'Video',
      value: stats.resourcesByType.video,
      icon: <VideoIcon />,
      color: '#FF6C00',
    },
    {
      title: 'PDF',
      value: stats.resourcesByType.pdf,
      icon: <PdfIcon />,
      color: '#D32F2F',
    },
    {
      title: 'Document',
      value: stats.resourcesByType.document,
      icon: <DocumentIcon />,
      color: '#1976D2',
    },
    {
      title: 'Link',
      value: stats.resourcesByType.link,
      icon: <LinkIcon />,
      color: '#388E3C',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha(
            '#0055A5',
            0.9
          )})`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
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
            right: 150,
            width: 150,
            height: 150,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            📊 Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Tổng quan thống kê hệ thống
          </Typography>
        </Box>
      </Box>

      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={2}
              sx={{
                bgcolor: 'white',
                border: 2,
                borderColor: card.color,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  borderColor: card.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: card.bgColor,
                      borderRadius: 3,
                      p: 2,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Resource Types Breakdown */}
      <Card
        elevation={2}
        sx={{
          bgcolor: 'white',
          border: 2,
          borderColor: '#FF6C00',
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUpIcon sx={{ color: '#FF6C00', mr: 1, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Phân loại Tài nguyên
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {resourceTypeCards.map((card, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(card.color, 0.05),
                    border: 1,
                    borderColor: alpha(card.color, 0.2),
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha(card.color, 0.1),
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: card.color, mb: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Chapters by Grade */}
      <Card
        elevation={2}
        sx={{
          bgcolor: 'white',
          border: 2,
          borderColor: '#0055A5',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ color: '#0055A5', mr: 1, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Chương theo Khối lớp
            </Typography>
          </Box>

          <Stack spacing={2}>
            {stats.chaptersByGrade.map((item) => (
              <Box key={item.grade}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.grade === 13 ? 'Ôn thi ĐH' : `Lớp ${item.grade}`}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0055A5' }}>
                    {item.count}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    bgcolor: alpha('#0055A5', 0.1),
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      bgcolor: '#0055A5',
                      width: `${(item.count / stats.totalChapters) * 100}%`,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </Box>
                {item.grade !== stats.chaptersByGrade[stats.chaptersByGrade.length - 1].grade && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
