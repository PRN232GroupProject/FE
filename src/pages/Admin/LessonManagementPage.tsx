import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { lessonService } from '../../services/features/lesson.service';
import { chapterService } from '../../services/features/chapter.service';
import type { ILessonResponse } from '../../types/content.types';

import LessonFilter from './components/lesson-management/LessonFilter';
import LessonTable from './components/lesson-management/LessonTable';
import LessonDetailDialog from './components/lesson-management/LessonDetailDialog';

const LessonManagementPage = () => {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [selectedLesson, setSelectedLesson] = useState<ILessonResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const { data: lessonRes, isLoading: loadLessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => lessonService.getAllLessons(),
  });

  const { data: chapterRes } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => chapterService.getAllChapters(),
  });

  const handleViewDetail = async (lesson: ILessonResponse) => {
    setIsLoadingDetail(true);
    try {
      const detailRes = await lessonService.getLessonById(lesson.lessonId);
      setSelectedLesson(detailRes.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết bài học", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const lessons = lessonRes?.data || [];
  const chapters = chapterRes?.data || [];

  const processedLessons = useMemo(() => {
    const mapped = lessons.map(l => {
      const chapter = chapters.find(c => c.lessons && c.lessons.some(cl => cl.lessonId === l.lessonId));
      return {
        ...l,
        chapterName: chapter?.chapterName || 'Unknown Chapter',
        grade: chapter?.grade || 0
      };
    });

    // SỬA TẠI ĐÂY: Sort theo lessonId giảm dần
    const sorted = mapped.sort((a, b) => b.lessonId - a.lessonId);

    return sorted.filter(l => {
      const matchName = l.title.toLowerCase().includes(search.toLowerCase());
      const matchGrade = gradeFilter === 'all' || l.grade === gradeFilter;
      return matchName && matchGrade;
    });
  }, [lessons, chapters, search, gradeFilter]);

  if (loadLessons) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>Quản lý Bài học</Typography>
      <LessonFilter search={search} setSearch={setSearch} gradeFilter={gradeFilter} setGradeFilter={setGradeFilter} />
      
      <LessonTable lessons={processedLessons} onViewDetail={handleViewDetail} />
      
      {isLoadingDetail && <LoadingSpinner size={30} minHeight="100px" />}
      
      <LessonDetailDialog lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
    </Box>
  );
};
export default LessonManagementPage;