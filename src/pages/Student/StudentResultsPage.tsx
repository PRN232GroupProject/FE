import React, { useState, useMemo } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import ResultStatsCard from './components/results/ResultStatsCard';
import ResultsTable from './components/results/ResultsTable';
import { useCurrentUser } from '../../hooks/useUser';
import { useTestHistory, useTestList } from '../../hooks/useTestData'; // 🚀 Thêm useTestList
import EmptyState from '../../components/shared/EmptyState';

const StudentResultsPage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const [typeFilter, setTypeFilter] = useState('all'); // State lọc loại bài thi

  // 1. Lấy lịch sử (đã lọc latest trong utils)
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
  } = useTestHistory(user?.id || 0);

  // 2. Lấy danh sách đề thi (để lấy Tên và Loại)
  const {
    data: allTests,
    isLoading: isLoadingTests
  } = useTestList();

  // 3. Logic Merge và Filter
  const processedData = useMemo(() => {
    if (!historyData || !allTests) return historyData;

    // Map: TestId -> TestInfo
    const testMap = new Map(allTests.map(t => [t.id, t]));

    // Điền thông tin (Tên, Loại) vào lịch sử
    const enrichedTests = historyData.completedTests.map(attempt => {
      const testInfo = testMap.get(attempt.testId);
      return {
        ...attempt,
        testName: testInfo?.name || `Bài kiểm tra #${attempt.testId}`,
        type: testInfo?.type || 'Khác', // Thêm field type để lọc
        grade: testInfo?.grade
      };
    });

    // Lọc theo Dropdown Type
    const filteredTests = enrichedTests.filter(t => 
      typeFilter === 'all' ? true : t.type === typeFilter
    );

    return {
      ...historyData,
      completedTests: filteredTests
    };
  }, [historyData, allTests, typeFilter]);


  if (isLoadingHistory || isLoadingTests) {
    return <LoadingSpinner />;
  }

  if (isErrorHistory || !historyData) {
    return (
      <EmptyState
        title="Lỗi tải kết quả"
        description="Không thể tải được lịch sử làm bài của bạn."
      />
    );
  }

  // Dữ liệu cho dropdown filter
  const testTypes = ['all', ...new Set(allTests?.map(t => t.type) || [])];

  const statsData = [
    {
      icon: CheckCircleIcon,
      value: historyData.totalTests, // Giữ nguyên thống kê tổng
      label: 'Bài đã hoàn thành',
      color: 'success.main',
    },
    {
      icon: AssessmentIcon,
      value: historyData.averageScore.toFixed(1), 
      label: 'Điểm trung bình',
      color: 'primary.main',
    },
    {
      icon: TrophyIcon,
      value: historyData.highestScore.toFixed(1), 
      label: 'Điểm cao nhất',
      color: 'secondary.main',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Kết quả học tập"
        subtitle="Kết quả bài làm gần nhất của từng đề thi"
      />

      <Box
        display="grid"
        gap={2}
        sx={{ mb: 4 }}
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr 1fr',
        }}
      >
        {statsData.map((stat, index) => (
          <ResultStatsCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            color={stat.color}
          />
        ))}
      </Box>

      {/* Bộ lọc Loại bài thi */}
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Lọc theo loại bài thi</InputLabel>
          <Select
            value={typeFilter}
            label="Lọc theo loại bài thi"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            {testTypes.filter(t => t !== 'all').map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bảng kết quả */}
      <ResultsTable results={processedData?.completedTests || []} />
    </Box>
  );
};

export default StudentResultsPage;