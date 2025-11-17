import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { IChapter } from '../../types/content.types';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import WelcomeBanner from './components/home/WelcomeBanner.tsx';
import GradeFilterTabs from './components/home/GradeFilterTabs';
import SearchBar from './components/home/SearchBar';
import ChapterCard from './components/home/ChapterCard.tsx';

const HomePage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      
      const gradeFilter = selectedGrade === 'all' ? null : parseInt(selectedGrade);
      
      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   let gradeToFetch = gradeFilter;
      //   if (isAuthenticated && user && !gradeFilter) {
      //     gradeToFetch = user.grade; 
      //     setSelectedGrade(user.grade.toString());
      //   }
      //
      //   const response = await contentService.getChapters({ grade: gradeToFetch });
      //   setChapters(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách chương", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: IChapter[] = [
          {
            id: 1,
            name: 'Chương 1: Sự điện li',
            grade: 11,
            description:
              'Nội dung về chất điện li, axit, bazơ, muối, pH và các phản ứng trao đổi ion.',
            lessons: [
              { id: 1, title: 'Bài 1: Axit, Bazơ và Muối' },
              { id: 2, title: 'Bài 2: pH và Chất chỉ thị' },
              { id: 3, title: 'Bài 3: Phản ứng trao đổi ion' },
            ],
          },
          {
            id: 2,
            name: 'Chương 2: Nitơ - Photpho',
            grade: 11,
            description:
              'Các hợp chất của Nitơ, Photpho và các bài toán liên quan đến chu trình Nitơ.',
            lessons: [
              { id: 4, title: 'Bài 4: Amoniac (NH3)' },
              { id: 5, title: 'Bài 5: Axit Nitric (HNO3)' },
            ],
          },
          {
            id: 3,
            name: 'Chương 3: Carbon - Silic',
            grade: 11,
            description:
              'Nghiên cứu về Carbon, Silic, các hợp chất vô cơ và ứng dụng trong đời sống.',
            lessons: [
              { id: 6, title: 'Bài 6: Carbon và hợp chất' },
              { id: 7, title: 'Bài 7: Silic và Silicat' },
              { id: 8, title: 'Bài 8: Công nghiệp Silicate' },
            ],
          },
          {
            id: 4,
            name: 'Chương 4: Đại cương kim loại',
            grade: 12,
            description:
              'Tính chất chung của kim loại, dãy điện hóa và các phản ứng oxi hóa - khử.',
            lessons: [
              { id: 9, title: 'Bài 9: Tính chất chung của kim loại' },
              { id: 10, title: 'Bài 10: Dãy điện hóa kim loại' },
            ],
          },
          {
            id: 5,
            name: 'Chương 5: Polyme',
            grade: 12,
            description:
              'Khái niệm, cấu trúc, và ứng dụng của vật liệu polyme.',
            lessons: [
              { id: 11, title: 'Bài 11: Đại cương về Polyme' },
              { id: 12, title: 'Bài 12: Vật liệu Polyme' },
            ],
          },
          {
            id: 6,
            name: 'Chương 1: Bảng tuần hoàn (Lớp 10)',
            grade: 10,
            description:
              'Cấu trúc bảng tuần hoàn, định luật tuần hoàn, và xu hướng biến đổi.',
            lessons: [
              { id: 13, title: 'Bài 13: Bảng tuần hoàn' },
              { id: 14, title: 'Bài 14: Xu hướng biến đổi' },
            ],
          },
        ];
        
        let filteredData = stubData;
        if (gradeFilter) {
          filteredData = stubData.filter(c => c.grade === gradeFilter);
        }
        
        setChapters(filteredData);
        setLoading(false);
      }, 500);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchChapters();
  }, [selectedGrade, isAuthenticated, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredChaptersBySearch = chapters.filter((chapter) =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

  return (
    <Box>
      <WelcomeBanner totalChapters={chapters.length} totalLessons={totalLessons} />
      
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <GradeFilterTabs selectedGrade={selectedGrade} onGradeChange={setSelectedGrade} />

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr',
          lg: '1fr 1fr 1fr',
        }}
      >
        {filteredChaptersBySearch.map((chapter) => {
          const completedLessons = Math.floor(Math.random() * chapter.lessons.length);
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

      {filteredChaptersBySearch.length === 0 && (
        <EmptyState
          icon={<SearchIcon sx={{ fontSize: 80 }} />}
          title="Không tìm thấy chương học nào"
        />
      )}
    </Box>
  );
};

export default HomePage;