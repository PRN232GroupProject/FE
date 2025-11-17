import React, { useState, useMemo } from 'react'; // ✨ CHANGED: Thêm useMemo
import { Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import WelcomeBanner from './components/home/WelcomeBanner';
import GradeFilterTabs from './components/home/GradeFilterTabs';
import SearchBar from './components/home/SearchBar';
import ChapterCard from './components/home/ChapterCard';
import { useChapters } from '../../hooks/useContent'; // 🚀 NEW: Import hook

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const {
    data: allChapters, // Dữ liệu gốc
    isLoading, // Trạng thái tải
    isError, // Trạng thái lỗi
  } = useChapters();

  // ⛔️ Bỏ: Toàn bộ khối useEffect fetchChapters

  // 🚀 NEW: Tối ưu hóa việc filter bằng useMemo
  // Logic này sẽ chỉ chạy lại khi 1 trong 3 giá trị dependency thay đổi
  const filteredChapters = useMemo(() => {
    // 1. Bắt đầu với dữ liệu gốc từ hook
    const baseChapters = allChapters || [];

    // 2. Lọc theo Lớp (Grade)
    const gradeFilter =
      selectedGrade === 'all' ? null : parseInt(selectedGrade);
    const filteredByGrade = gradeFilter
      ? baseChapters.filter((c) => c.grade === gradeFilter)
      : baseChapters;

    // 3. Lọc theo Tìm kiếm (Search)
    return filteredByGrade.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allChapters, selectedGrade, searchTerm]);

  // ✨ CHANGED: Xử lý trạng thái Loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 🚀 NEW: Xử lý trạng thái Lỗi
  if (isError) {
    return (
      <EmptyState
        icon={<SearchIcon sx={{ fontSize: 80 }} />}
        title="Lỗi"
        description="Không thể tải được danh sách chương học. Vui lòng thử lại sau."
      />
    );
  }

  // ✨ CHANGED: Tính tổng từ dữ liệu gốc (allChapters)
  const totalChapters = (allChapters || []).length;
  const totalLessons = (allChapters || []).reduce(
    (acc, ch) => acc + ch.lessons.length,
    0
  );

  return (
    <Box>
      <WelcomeBanner
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
        {/* ✨ CHANGED: Map qua mảng đã filter (từ useMemo) */}
        {filteredChapters.map((chapter) => {
          // Ghi chú: Logic progress/completed này vẫn là tạm thời
          // Bạn sẽ cần thay thế khi API trả về dữ liệu tiến độ
          const completedLessons = Math.floor(
            Math.random() * chapter.lessons.length
          );
          const progress = (completedLessons / chapter.lessons.length) * 100;

          return (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              completedLessons={completedLessons}
              progress={progress}
            />
          );
        })}
      </Box>

      {/* ✨ CHANGED: Kiểm tra mảng đã filter (từ useMemo) */}
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