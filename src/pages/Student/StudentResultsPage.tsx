import React, { useEffect, useState } from 'react';
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

interface ITestAttempt {
  sessionId: number;
  testId: number;
  testName: string;
  date: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
}

const StudentResultsPage: React.FC = () => {
  const [results, setResults] = useState<ITestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await resultService.getAllMyResults();
      //   setResults(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải kết quả", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: ITestAttempt[] = [
          {
            sessionId: 101,
            testId: 1,
            testName: 'Kiểm tra sau bài học - Axit, Bazơ và Muối',
            date: '2025-11-08',
            score: 8.5,
            totalCorrect: 17,
            totalQuestions: 20,
          },
          {
            sessionId: 102,
            testId: 2,
            testName: 'Kiểm tra 15 phút - Chương 1: Sự điện li',
            date: '2025-11-07',
            score: 7.0,
            totalCorrect: 14,
            totalQuestions: 20,
          },
          {
            sessionId: 103,
            testId: 4,
            testName: 'Kiểm tra sau bài học - Amoniac (NH3)',
            date: '2025-11-06',
            score: 5.0,
            totalCorrect: 10,
            totalQuestions: 20,
          },
          {
            sessionId: 104,
            testId: 1,
            testName: 'Kiểm tra sau bài học - Axit, Bazơ và Muối (Làm lại)',
            date: '2025-11-10',
            score: 9.5,
            totalCorrect: 19,
            totalQuestions: 20,
          },
        ];
        setResults(stubData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
      }, 800);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchResults();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const completedCount = results.length;
  const averageScore = results.reduce((acc, r) => acc + r.score, 0) / (completedCount || 1);
  const highestScore = Math.max(...results.map((r) => r.score));

  const statsData = [
    {
      icon: CheckCircleIcon,
      value: completedCount,
      label: 'Lượt làm bài',
      color: 'success.main',
    },
    {
      icon: AssessmentIcon,
      value: averageScore.toFixed(1),
      label: 'Điểm trung bình',
      color: 'primary.main',
    },
    {
      icon: TrophyIcon,
      value: highestScore.toFixed(1),
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
      <ResultsTable results={results} />
    </Box>
  );
};

export default StudentResultsPage;