import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Button,
  alpha,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Replay as ReplayIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// Dữ liệu mẫu (Giả lập interface)
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
  const navigate = useNavigate();
  const [results, setResults] = useState<ITestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (Sẽ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await resultService.getAllMyResults();
      //   setResults(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tải kết quả", error);
      // } finally {
      //   setLoading(false);
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
        // Sắp xếp theo ngày mới nhất
        setResults(stubData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
      }, 800);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const completedCount = results.length;
  const averageScore =
    results.reduce((acc, r) => acc + r.score, 0) / (completedCount || 1);
  const highestScore = Math.max(...results.map((r) => r.score));

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha(
            '#0055A5',
            0.9,
          )} 100%)`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Kết quả học tập
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
          Tổng quan về các bài kiểm tra bạn đã hoàn thành
        </Typography>

        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr 1fr',
          }}
        >
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {completedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lượt làm bài
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {averageScore.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điểm trung bình
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              {highestScore.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điểm cao nhất
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Bảng kết quả chi tiết */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: alpha('#0055A5', 0.1) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Tên bài kiểm tra</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">Ngày làm</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">Điểm số</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">Kết quả</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row) => (
                <TableRow
                  key={row.sessionId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    {row.testName}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.date).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${row.score.toFixed(1)} / 10`}
                      color={row.score >= 5 ? 'success' : 'error'}
                      sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {row.totalCorrect}/{row.totalQuestions}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/sessions/${row.sessionId}/results`)}
                      >
                        Xem
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        startIcon={<ReplayIcon />}
                        onClick={() => navigate(`/test/${row.testId}`)}
                      >
                        Làm lại
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StudentResultsPage;