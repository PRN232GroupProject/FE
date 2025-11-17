import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { IChapter } from '../../types/content.types';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import ChapterAccordion from './components/lesson-list/ChapterAccordion';

const LessonListPage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await contentService.getChaptersWithProgress();
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
            description: 'Nội dung về chất điện li, axit, bazơ, muối...',
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
            description: 'Các hợp chất của Nitơ, Photpho...',
            lessons: [
              { id: 4, title: 'Bài 4: Amoniac (NH3)' },
              { id: 5, title: 'Bài 5: Axit Nitric (HNO3)' },
            ],
          },
          {
            id: 3,
            name: 'Chương 3: Carbon - Silic',
            grade: 11,
            description: 'Nghiên cứu về Carbon, Silic...',
            lessons: [
              { id: 6, title: 'Bài 6: Carbon và hợp chất' },
              { id: 7, title: 'Bài 7: Silic và Silicat' },
              { id: 8, title: 'Bài 8: Công nghiệp Silicate' },
            ],
          },
          {
            id: 4,
            name: 'Chương 4: Đại cương kim loại',
            grade: 11,
            description: 'Tính chất chung của kim loại...',
            lessons: [
              { id: 9, title: 'Bài 9: Tính chất chung của kim loại' },
              { id: 10, title: 'Bài 10: Dãy điện hóa kim loại' },
            ],
          },
        ];
        setChapters(stubData);
        setLoading(false);
      }, 800);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchChapters();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title="Danh sách Bài học"
        subtitle="Toàn bộ chương trình Hóa học lớp 11"
      />

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
          Nội dung khóa học
        </Typography>

        {chapters.map((chapter, index) => {
          const completedLessons = Math.floor(Math.random() * chapter.lessons.length);
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