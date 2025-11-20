import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box, Divider, Chip, Stack } from '@mui/material';
import { Close, PictureAsPdf, PlayCircle, Description } from '@mui/icons-material';
import type { ILessonResponse } from '../../../types/content.types';

interface LessonDetailDialogProps {
  lesson: ILessonResponse | null;
  onClose: () => void;
}

const LessonDetailDialog: React.FC<LessonDetailDialogProps> = ({ lesson, onClose }) => {
  if (!lesson) return null;
  
  return (
    <Dialog open={!!lesson} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f7fa' }}>
        <Typography variant="h6" fontWeight="bold">Chi tiết Bài học: {lesson.title}</Typography>
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
           <Typography variant="subtitle1" fontWeight="bold" color="primary">1. Mục tiêu bài học</Typography>
           <Typography paragraph variant="body2" sx={{ mt: 1 }}>{lesson.objectives || 'Chưa có mục tiêu'}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
           <Typography variant="subtitle1" fontWeight="bold" color="primary">2. Nội dung lý thuyết</Typography>
           <Box 
             sx={{ mt: 1, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee', maxHeight: 300, overflowY: 'auto' }}
             dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Chưa có nội dung</p>' }} 
           />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
           <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>3. Tài liệu & Video bài giảng</Typography>
           {lesson.resources && lesson.resources.length > 0 ? (
             <Stack spacing={1}>
                {lesson.resources.map((res, index) => (
                   <Box key={res.resourceId} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      {res.resourceType?.toLowerCase().includes('video') ? (
                          <PlayCircle color="error" />
                      ) : (
                          <PictureAsPdf color="error" />
                      )}
                      <Typography variant="body2" fontWeight="500">
                         {index + 1}. {res.resourceTitle}
                      </Typography>
                      <Chip 
                         label={res.resourceType || 'Tài liệu'} 
                         size="small" 
                         color={res.resourceType?.toLowerCase().includes('video') ? 'warning' : 'default'} 
                         variant="outlined" 
                      />
                   </Box>
                ))}
             </Stack>
           ) : (
             <Typography variant="body2" color="text.secondary" fontStyle="italic">Không có tài liệu đính kèm.</Typography>
           )}
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
export default LessonDetailDialog;