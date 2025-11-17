import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Button,
  ListItemButton,
  alpha,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import type { IChapter } from '../../../../types/content.types';

interface ChapterCardProps {
  chapter: IChapter;
  completedLessons: number;
  progress: number;
}

const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  completedLessons,
  progress,
}) => {
  // 🚀 NEW: Lấy ID bài học đầu tiên một cách an toàn
  // Nếu mảng 'lessons' rỗng, 'firstLessonId' sẽ là 'undefined'
  const firstLessonId = chapter.lessons[0]?.id;

  return (
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
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.8)}, ${alpha(
            '#0055A5',
            0.8
          )})`,
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

      {/* Content */}
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

        {/* Lessons List */}
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

        {/* Action Button */}
        <Button
          component={RouterLink}
          // ✨ CHANGED: Dùng 'firstLessonId' làm link, fallback về '#' nếu không có
          to={firstLessonId ? `/lesson/${firstLessonId}` : '#'}
          variant="contained"
          fullWidth
          startIcon={<PlayIcon />}
          // ✨ CHANGED: Vô hiệu hóa nút nếu không có 'firstLessonId'
          disabled={!firstLessonId}
          sx={{
            mt: 'auto',
            borderRadius: 2,
            py: 1.2,
            fontWeight: 600,
          }}
        >
          {/* ✨ CHANGED: Đổi text nếu không có bài học */}
          {firstLessonId ? 'Bắt đầu học' : 'Chưa có bài học'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChapterCard;