import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack,
  alpha,
} from '@mui/material';
import { Replay as ReplayIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

interface ITestAttempt {
  sessionId: number;
  testId: number;
  testName: string;
  date: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
}

interface ResultsTableProps {
  results: ITestAttempt[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const navigate = useNavigate();

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: alpha('#0055A5', 0.1) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                Tên bài kiểm tra
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">
                Ngày làm
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">
                Điểm số
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">
                Kết quả
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }} align="center">
                Hành động
              </TableCell>
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
                      onClick={() => navigate(`/test/result/${row.sessionId}`)}
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
  );
};

export default ResultsTable;