import React from 'react'; 
import { Box, Paper, Typography } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import ChapterAccordion from './components/lesson-list/ChapterAccordion';
import { useChapters } from '../../hooks/useContent'; 
import EmptyState from '../../components/shared/EmptyState'; 
import { School as SchoolIcon } from '@mui/icons-material'; 

const LessonListPage: React.FC = () => {
  const {
    data: chapters, 
    isLoading, 
    isError, 
  } = useChapters();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={<SchoolIcon sx={{ fontSize: 80 }} />}
        title="Lỗi tải bài học"
        description="Không thể tải được danh sách chương học. Vui lòng thử lại sau."
      />
    );
  }

  if (!chapters || chapters.length === 0) {
    return (
      <EmptyState
        icon={<SchoolIcon sx={{ fontSize: 80 }} />}
        title="Chưa có bài học"
        description="Hiện tại chưa có chương học nào được cập nhật. Vui lòng quay lại sau."
      />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Danh sách Bài học"
        subtitle="Toàn bộ chương trình Hóa học"
      />

      <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 3 }, borderRadius: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}
        >
          Nội dung khóa học
        </Typography>

        {chapters.map((chapter, index) => {
          const completedLessons = Math.floor(
            Math.random() * chapter.lessons.length
          );
          const progress = (completedLessons / chapter.lessons.length) * 100;

          return (
            <ChapterAccordion
              key={chapter.id}
              chapter={chapter}
              completedLessons={completedLessons}
              progress={progress}
              defaultExpanded={index === 0} 
            />
          );
        })}
      </Paper>
    </Box>
  );
};

export default LessonListPage;