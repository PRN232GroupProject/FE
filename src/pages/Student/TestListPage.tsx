import React, { useState, useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import TestCard from './components/test/TestCard';
import TestFilters from './components/test/TestFilters';
import TestStatsCards from './components/test/TestStatsCards';
import { useTestList } from '../../hooks/useTestData'; 
import EmptyState from '../../components/shared/EmptyState'; 

const TestListPage: React.FC = () => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not-completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');


  const {
    data: allTests, 
    isLoading,
    isError,
  } = useTestList();

  const stats = useMemo(() => {
    const completedTests = (allTests || []).filter((t) => t.lastAttempt?.completed);
    const completedCount = completedTests.length;
    const averageScore =
      completedCount > 0
        ? completedTests.reduce((acc, t) => acc + (t.lastAttempt?.score || 0), 0) /
          completedCount
        : 0;
    const highestScore =
      completedCount > 0
        ? Math.max(...completedTests.map((t) => t.lastAttempt?.score || 0))
        : 0;

    return { completedCount, averageScore, highestScore };
  }, [allTests]);

  const filteredTests = useMemo(() => {
    const baseTests = allTests || [];

    return baseTests
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
  }, [allTests, statusFilter, searchTerm, gradeFilter, typeFilter]);


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={<SearchIcon sx={{ fontSize: 80 }} />}
        title="Lỗi"
        description="Không thể tải danh sách bài kiểm tra. Vui lòng thử lại sau."
      />
    );
  }

  return (
    <Box>
      <PageHeader title="Danh sách Bài kiểm tra" subtitle="Tất cả bài kiểm tra và đề thi" />

      <Box sx={{ mb: 4 }}>
        <TestStatsCards
          completedCount={stats.completedCount}
          averageScore={stats.averageScore}
          highestScore={stats.highestScore}
        />
      </Box>

      <TestFilters
        statusFilter={statusFilter}
        gradeFilter={gradeFilter}
        typeFilter={typeFilter}
        searchTerm={searchTerm}
        totalTests={(allTests || []).length} 
        completedCount={stats.completedCount} 
        onStatusChange={setStatusFilter}
        onGradeChange={setGradeFilter}
        onTypeChange={setTypeFilter}
        onSearchChange={setSearchTerm}
      />

      {filteredTests.length > 0 ? (
        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          }}
        >
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} onStart={(id) => navigate(`/test/${id}`)} />
          ))}
        </Box>
      ) : (
        <EmptyState
          icon={<SearchIcon sx={{ fontSize: 80 }} />}
          title="Không tìm thấy bài kiểm tra"
          description="Hãy thử thay đổi bộ lọc của bạn."
        />
      )}
    </Box>
  );
};

export default TestListPage;