import React, { useState, useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import TestCard from './components/test/TestCard';
import TestFilters from './components/test/TestFilters';
import TestStatsCards from './components/test/TestStatsCards';
import { useTestList, useTestHistory } from '../../hooks/useTestData'; 
import { useCurrentUser } from '../../hooks/useUser';
import EmptyState from '../../components/shared/EmptyState'; 

const TestListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Lấy user từ hook đã sửa (sẽ là null nếu logout)
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not-completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 1. Lấy danh sách bài thi
  const {
    data: allTests, 
    isLoading: isLoadingTests,
    isError: isErrorTests,
  } = useTestList();

  // 2. Lấy lịch sử (Hook sẽ TỰ ĐỘNG không fetch nếu userId <= 0)
  const {
    data: historyData,
    isLoading: isLoadingHistory
  } = useTestHistory(user?.id || 0);

  // 3. Logic Loading: CHỈ đợi history khi:
  //    - User đang đăng nhập (user exists)
  //    - User có ID hợp lệ (> 0)
  //    - History đang loading
  const isGlobalLoading = isLoadingTests || (!!user && !!user.id && user.id > 0 && isLoadingHistory);

  // 4. GỘP DỮ LIỆU - Thêm status vào tests
  const testsWithStatus = useMemo(() => {
    if (!allTests) return [];
    
    // Nếu chưa đăng nhập hoặc chưa có lịch sử -> Trả về gốc (không có lastAttempt)
    if (!user || !user.id || user.id <= 0 || !historyData) {
      return allTests;
    }

    const historyMap = new Map(
      historyData.completedTests.map(h => [h.testId, h])
    );

    return allTests.map(test => {
      const attempt = historyMap.get(test.id);
      return {
        ...test,
        lastAttempt: attempt ? {
          score: attempt.score,
          date: attempt.date,
          completed: true 
        } : undefined
      };
    });
  }, [allTests, historyData, user]);

  // 5. TÍNH STATS - Luôn trả về giá trị hợp lệ
  const stats = useMemo(() => {
    // Nếu chưa đăng nhập hoặc không có lịch sử -> Stats mặc định = 0
    if (!user || !user.id || user.id <= 0 || !historyData) {
      return { 
        completedCount: 0, 
        averageScore: 0, 
        highestScore: 0 
      };
    }

    const completedTests = testsWithStatus.filter((t) => t.lastAttempt?.completed);
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
  }, [testsWithStatus, user, historyData]);

  // 6. LỌC TESTS
  const filteredTests = useMemo(() => {
    return testsWithStatus
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
  }, [testsWithStatus, statusFilter, searchTerm, gradeFilter, typeFilter]);


  // === RENDER ===
  if (isGlobalLoading) {
    return <LoadingSpinner />;
  }

  if (isErrorTests) {
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
        totalTests={testsWithStatus.length} 
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
            <TestCard 
              key={test.id} 
              test={test} 
              onStart={(id) => {
                if (!user || !user.id || user.id <= 0) {
                   navigate('/login');
                } else {
                   navigate(`/test/${id}`);
                }
              }} 
            />
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