import React, { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import WelcomeBanner from './components/home/WelcomeBanner';
import GradeFilterTabs from './components/home/GradeFilterTabs';
import SearchBar from './components/home/SearchBar';
import ChapterCard from './components/home/ChapterCard';
import { useChapters, useAllResources } from '../../hooks/useContent';
import { userService } from '../../services/features/user.service';
import type { IUser } from '../../types/user.types';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const {
    data: allChapters,
    isLoading: isLoadingChapters,
    isError,
  } = useChapters();

  const {
    data: allResources,
    isLoading: isLoadingResources,
  } = useAllResources();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userService.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const filteredChapters = useMemo(() => {
    const baseChapters = allChapters || [];

    const gradeFilter =
      selectedGrade === 'all' ? null : parseInt(selectedGrade);
    const filteredByGrade = gradeFilter
      ? baseChapters.filter((c) => c.grade === gradeFilter)
      : baseChapters;

    return filteredByGrade.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allChapters, selectedGrade, searchTerm]);

  const chaptersWithProgress = useMemo(() => {
    if (!currentUser || !currentUser.id || currentUser.id <= 0) {
      return filteredChapters.map(ch => ({ 
        ...ch, 
        completedLessons: 0, 
        progress: 0 
      }));
    }

    if (!allResources) {
      return filteredChapters.map(ch => ({ 
        ...ch, 
        completedLessons: 0, 
        progress: 0 
      }));
    }

    const lessonProgressMap = new Map<number, { total: number; completed: number }>();
    
    allResources.forEach((resource) => {
      const existing = lessonProgressMap.get(resource.lessonId) || { total: 0, completed: 0 };
      existing.total++;
      if (resource.isCompleted) {
        existing.completed++;
      }
      lessonProgressMap.set(resource.lessonId, existing);
    });

    return filteredChapters.map((chapter) => {
      let totalLessons = chapter.lessons.length;
      let completedCount = 0;

      // Đếm lessons đã hoàn thành
      chapter.lessons.forEach((lesson) => {
        const lessonProgress = lessonProgressMap.get(lesson.id);
        
        if (lessonProgress && lessonProgress.total > 0) {
          // Lesson hoàn thành khi TẤT CẢ resources đều completed
          if (lessonProgress.completed === lessonProgress.total) {
            completedCount++;
          }
        }
      });

      const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

      return {
        ...chapter,
        completedLessons: completedCount,
        progress: Math.round(progress),
      };
    });
  }, [filteredChapters, allResources, currentUser]);

  const isLoading = isLoadingChapters || isLoadingResources || userLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={<SearchIcon sx={{ fontSize: 80 }} />}
        title="Lỗi"
        description="Không thể tải được danh sách chương học. Vui lòng thử lại sau."
      />
    );
  }

  const totalChapters = (allChapters || []).length;
  const totalLessons = (allChapters || []).reduce(
    (acc, ch) => acc + ch.lessons.length,
    0
  );

  return (
    <Box>
      <WelcomeBanner
        userName={currentUser?.fullName || 'Bạn'}
        totalChapters={totalChapters}
        totalLessons={totalLessons}
      />

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <GradeFilterTabs
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
      />

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr',
          lg: '1fr 1fr 1fr',
        }}
      >
        {chaptersWithProgress.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            completedLessons={chapter.completedLessons}
            progress={chapter.progress}
          />
        ))}
      </Box>

      {filteredChapters.length === 0 && !isLoading && (
        <EmptyState
          icon={<SearchIcon sx={{ fontSize: 80 }} />}
          title="Không tìm thấy chương học nào"
          description="Hãy thử thay đổi bộ lọc lớp hoặc từ khóa tìm kiếm của bạn."
        />
      )}
    </Box>
  );
};

export default HomePage;