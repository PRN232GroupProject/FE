import React, { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import WelcomeBanner from './components/home/WelcomeBanner';
import GradeFilterTabs from './components/home/GradeFilterTabs';
import SearchBar from './components/home/SearchBar';
import ChapterCard from './components/home/ChapterCard';
import { useChapters } from '../../hooks/useContent';
import { userService } from '../../services/features/user.service';
import type { IUser } from '../../types/user.types';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const {
    data: allChapters,
    isLoading,
    isError,
  } = useChapters();

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

  // 🚀 Tối ưu hóa việc filter bằng useMemo
  const filteredChapters = useMemo(() => {
    const baseChapters = allChapters || [];

    // Lọc theo Lớp (Grade)
    const gradeFilter =
      selectedGrade === 'all' ? null : parseInt(selectedGrade);
    const filteredByGrade = gradeFilter
      ? baseChapters.filter((c) => c.grade === gradeFilter)
      : baseChapters;

    // Lọc theo Tìm kiếm (Search)
    return filteredByGrade.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allChapters, selectedGrade, searchTerm]);

  // ✅ FIX: Tính progress từ dữ liệu thật
  const chaptersWithProgress = useMemo(() => {
    return filteredChapters.map((chapter) => {
      let totalLessons = chapter.lessons.length;
      let completedCount = 0;

      // ✅ Tính từ resources đã completed trong lessons
      chapter.lessons.forEach((lesson) => {
        if (lesson.resources && lesson.resources.length > 0) {
          const allCompleted = lesson.resources.every((r) => r.isCompleted);
          if (allCompleted) completedCount++;
        }
      });

      const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

      return {
        ...chapter,
        completedLessons: completedCount,
        progress: Math.round(progress),
      };
    });
  }, [filteredChapters]);

  if (isLoading || userLoading) {
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
        {/* ✅ Map qua chapters với progress thật */}
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