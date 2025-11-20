import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import type { ILessonResponse } from '../../../../types/content.types';

interface LessonTableProps {
  lessons: (ILessonResponse & { chapterName: string; grade: number })[];
  onViewDetail: (lesson: ILessonResponse) => void;
}

const LessonTable: React.FC<LessonTableProps> = ({ lessons, onViewDetail }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên bài học</TableCell>
            <TableCell>Chương</TableCell>
            <TableCell align="center">Khối</TableCell>
            <TableCell align="center">Người tạo (ID)</TableCell>
            <TableCell align="center">Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.lessonId} hover>
              <TableCell>#{lesson.lessonId}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{lesson.title}</TableCell>
              <TableCell>{lesson.chapterName}</TableCell>
              <TableCell align="center">
                <Chip label={`Lớp ${lesson.grade}`} size="small" color="info" variant="outlined"/>
              </TableCell>
              <TableCell align="center">{lesson.createdById || 'N/A'}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onViewDetail(lesson)}>
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
export default LessonTable;