import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import TestCard, { type ITest } from './components/test/TestCard';
import TestFilters from './components/test/TestFilters';
import TestStatsCards from './components/test/TestStatsCards';

const TestListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not-completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const params = {
      //     status: statusFilter,
      //     grade: gradeFilter === 'all' ? null : gradeFilter,
      //     type: typeFilter === 'all' ? null : typeFilter,
      //     search: searchTerm
      //   }
      //   const response = await testService.getAllTests(params);
      //   setTests(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách bài kiểm tra", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: (ITest & { grade?: number })[] = [
          {
            id: 1,
            name: 'Kiểm tra sau bài học - Axit, Bazơ và Muối',
            type: 'Sau bài học',
            duration: 15,
            totalQuestions: 10,
            chapterName: 'Chương 1: Sự điện li',
            difficulty: 'easy',
            grade: 11,
            lastAttempt: {
              score: 8.5,
              date: '2025-11-08',
              completed: true,
            },
          },
          {
            id: 2,
            name: 'Kiểm tra 15 phút - Chương 1: Sự điện li',
            type: '15 phút',
            duration: 15,
            totalQuestions: 15,
            chapterName: 'Chương 1: Sự điện li',
            difficulty: 'medium',
            grade: 11,
            lastAttempt: {
              score: 7.0,
              date: '2025-11-07',
              completed: true,
            },
          },
          {
            id: 3,
            name: 'Kiểm tra 1 tiết - Chương 1 và 2',
            type: '1 tiết',
            duration: 45,
            totalQuestions: 30,
            chapterName: 'Chương 1-2',
            difficulty: 'hard',
            grade: 11,
          },
          {
            id: 4,
            name: 'Kiểm tra sau bài học - Amoniac (NH3)',
            type: 'Sau bài học',
            duration: 15,
            totalQuestions: 10,
            chapterName: 'Chương 2: Nitơ - Photpho',
            difficulty: 'easy',
            grade: 11,
          },
          {
            id: 5,
            name: 'Kiểm tra học kỳ I - Lớp 11',
            type: 'Học kỳ',
            duration: 90,
            totalQuestions: 40,
            chapterName: 'Tổng hợp',
            difficulty: 'hard',
            grade: 11,
          },
          {
            id: 6,
            name: 'Đề thi tốt nghiệp THPT - Mẫu 1',
            type: 'Tốt nghiệp',
            duration: 50,
            totalQuestions: 40,
            chapterName: 'Tổng hợp',
            difficulty: 'hard',
            grade: 13,
          },
          {
            id: 7,
            name: 'Đề thi Đại học - Khối A năm 2024',
            type: 'Đại học',
            duration: 90,
            totalQuestions: 50,
            chapterName: 'Tổng hợp',
            difficulty: 'hard',
            grade: 13,
          },
          {
            id: 8,
            name: 'Kiểm tra Hóa 10 - Mới',
            type: '15 phút',
            duration: 15,
            totalQuestions: 10,
            chapterName: 'Chương 1: Hóa 10',
            difficulty: 'medium',
            grade: 10,
          },
        ];

        const filtered = stubData
          .filter((t) =>
            statusFilter === 'all'
              ? true
              : statusFilter === 'completed'
              ? t.lastAttempt?.completed
              : !t.lastAttempt?.completed
          )
          .filter((t) => (gradeFilter === 'all' ? true : t.grade?.toString() === gradeFilter))
          .filter((t) => (typeFilter === 'all' ? true : t.type === typeFilter))
          .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

        setTests(filtered);
        setLoading(false);
      }, 500);
    };

    fetchTests();
  }, [statusFilter, searchTerm, gradeFilter, typeFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const completedCount = tests.filter((t) => t.lastAttempt?.completed).length;
  const completedTests = tests.filter((t) => t.lastAttempt?.completed);
  const averageScore =
    completedTests.length > 0
      ? completedTests.reduce((acc, t) => acc + (t.lastAttempt?.score || 0), 0) /
        completedTests.length
      : 0;
  const highestScore =
    completedTests.length > 0
      ? Math.max(...completedTests.map((t) => t.lastAttempt?.score || 0))
      : 0;

  return (
    <Box>
      <PageHeader title="Danh sách Bài kiểm tra" subtitle="Tất cả bài kiểm tra và đề thi" />

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <TestStatsCards
          completedCount={completedCount}
          averageScore={averageScore}
          highestScore={highestScore}
        />
      </Box>

      {/* Filters */}
      <TestFilters
        statusFilter={statusFilter}
        gradeFilter={gradeFilter}
        typeFilter={typeFilter}
        searchTerm={searchTerm}
        totalTests={tests.length}
        completedCount={completedCount}
        onStatusChange={setStatusFilter}
        onGradeChange={setGradeFilter}
        onTypeChange={setTypeFilter}
        onSearchChange={setSearchTerm}
      />

      {/* Test Cards Grid */}
      {tests.length > 0 ? (
        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          }}
        >
          {tests.map((test) => (
            <TestCard key={test.id} test={test} onStart={(id) => navigate(`/test/${id}`)} />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={8}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy bài kiểm tra nào
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestListPage;