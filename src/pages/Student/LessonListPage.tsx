import React, { useMemo } from 'react'; 
import { Box, Paper, Typography } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import ChapterAccordion from './components/lesson-list/ChapterAccordion';
import { useChapters, useAllResources } from '../../hooks/useContent'; 
import EmptyState from '../../components/shared/EmptyState'; 
import { School as SchoolIcon } from '@mui/icons-material'; 

const LessonListPage: React.FC = () => {
  const {
    data: chapters, 
    isLoading: isLoadingChapters, 
    isError, 
  } = useChapters();

  // ✅ FIX: Lấy tất cả resources để tính progress
  const {
    data: allResources,
    isLoading: isLoadingResources,
  } = useAllResources();

  // ✅ FIX: Tính progress từ allResources  
  const chaptersWithProgress = useMemo(() => {
    if (!chapters || !allResources) return [];

    // Tạo map: lessonId -> {total, completed}
    const lessonProgressMap = new Map<number, { total: number; completed: number }>();
    
    allResources.forEach((resource) => {
      const existing = lessonProgressMap.get(resource.lessonId) || { total: 0, completed: 0 };
      existing.total++;
      if (resource.isCompleted) {
        existing.completed++;
      }
      lessonProgressMap.set(resource.lessonId, existing);
    });

    return chapters.map((chapter) => {
      let totalLessons = chapter.lessons.length;
      let completedCount = 0;

      // Đếm lessons hoàn thành
      chapter.lessons.forEach((lesson) => {
        const lessonProgress = lessonProgressMap.get(lesson.id);
        
        if (lessonProgress && lessonProgress.total > 0) {
          // Lesson hoàn thành = tất cả resources completed
          if (lessonProgress.completed === lessonProgress.total) {
            completedCount++;
          }
        }
      });

      const progress = totalLessons > 0 
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;

      return {
        chapter,
        completedCount,
        progress,
      };
    });
  }, [chapters, allResources]);

  const isLoading = isLoadingChapters || isLoadingResources;

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

        {chaptersWithProgress.map(({ chapter, completedCount, progress }, index) => (
          <ChapterAccordion
            key={chapter.id}
            chapter={chapter}
            completedLessons={completedCount}
            progress={progress}
            defaultExpanded={index === 0} 
          />
        ))}
      </Paper>
    </Box>
  );
};

export default LessonListPage;