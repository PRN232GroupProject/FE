import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PageHeader from '../../components/shared/PageHeader';
import ResultStatsCard from './components/results/ResultStatsCard';
import ResultsTable from './components/results/ResultsTable';
import { useTestHistory } from '../../hooks/useTestData'; 
import { userService } from '../../services/features/user.service';
import EmptyState from '../../components/shared/EmptyState';

const StudentResultsPage: React.FC = () => {
  const [userId, setUserId] = useState<number>(0);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUserId(response.data.id);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);
  
  const {
    data: historyData,
    isLoading,
    isError,
  } = useTestHistory(userId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !historyData) {
    return (
      <EmptyState
        icon={<AssessmentIcon sx={{ fontSize: 80 }} />}
        title="Lỗi tải kết quả"
        description="Không thể tải được lịch sử làm bài của bạn. Vui lòng thử lại sau."
      />
    );
  }

  const statsData = [
    {
      icon: CheckCircleIcon,
      value: historyData.totalTests,
      label: 'Bài đã làm',
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
        subtitle="Tổng quan về các bài kiểm tra bạn đã hoàn thành"
      />

      {/* Stats Cards */}
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

      {/* Results Table */}
      <ResultsTable results={historyData.completedTests} />
    </Box>
  );
};

export default StudentResultsPage;