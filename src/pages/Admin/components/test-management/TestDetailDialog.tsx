import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, IconButton, Typography, Box, Paper, Chip
} from '@mui/material';
import { Close, Assignment, Timer, Category } from '@mui/icons-material';
import type { ITestResponse } from '../../../../types/test.types';

interface TestDetailDialogProps {
  test: ITestResponse | null;
  onClose: () => void;
}

const TestDetailDialog: React.FC<TestDetailDialogProps> = ({ test, onClose }) => {
  if (!test) return null;
  
  return (
    <Dialog open={!!test} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f7fa' }}>
         <Typography variant="h6" fontWeight="bold">Chi tiết Đề thi</Typography>
         <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box mb={3} p={2} bgcolor="#e3f2fd" borderRadius={2}>
           <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>{test.name}</Typography>
           <Typography variant="body2" color="text.secondary" mb={2}>{test.description || 'Không có mô tả'}</Typography>
           
           <Box display="flex" gap={3}>
              <Chip icon={<Timer />} label={`${test.durationMinutes} phút`} color="primary" variant="outlined" />
              <Chip icon={<Category />} label={test.type} color="secondary" variant="outlined" />
              <Chip label={`Tổng: ${test.totalQuestions} câu`} variant="outlined" />
           </Box>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#0055A5' }}>
          <Assignment /> Danh sách câu hỏi
        </Typography>
        
        {test.questions && test.questions.length > 0 ? (
          test.questions.map((q, index: number) => (
            <Paper key={q.id} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fff', '&:hover': { borderColor: 'primary.main' } }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                 Câu {index + 1}: <span dangerouslySetInnerHTML={{ __html: q.content }} />
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography align="center" color="text.secondary" py={4} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
            Chưa có câu hỏi nào trong đề thi này.
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestDetailDialog;