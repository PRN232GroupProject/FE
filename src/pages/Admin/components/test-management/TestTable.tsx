import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import type { ITestResponse } from '../../../../types/test.types';

interface TestTableProps {
  tests: ITestResponse[];
  onViewDetail: (test: ITestResponse) => void;
}

const TestTable: React.FC<TestTableProps> = ({ tests, onViewDetail }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên bài thi</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell align="center">Thời gian</TableCell>
            <TableCell align="center">Số câu hỏi</TableCell>
            <TableCell align="center">Người tạo (ID)</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id} hover>
              <TableCell>#{test.id}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{test.name}</TableCell>
              <TableCell>
                <Chip label={test.type} size="small" color="secondary" variant="outlined" />
              </TableCell>
              <TableCell align="center">{test.durationMinutes} phút</TableCell>
              <TableCell align="center">{test.totalQuestions}</TableCell>
              <TableCell align="center">{test.createdBy}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onViewDetail(test)}>
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default TestTable;