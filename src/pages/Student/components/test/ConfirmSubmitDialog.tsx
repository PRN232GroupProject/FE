import React from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  alpha,
} from '@mui/material';

interface ConfirmSubmitDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  answeredCount: number;
  totalQuestions: number;
}

const ConfirmSubmitDialog: React.FC<ConfirmSubmitDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  answeredCount,
  totalQuestions,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
        Xác nhận nộp bài
      </DialogTitle>
      <DialogContent>
        {/* 🚀 SỬA: Thêm component="div" để tránh lỗi <p> lồng <p> */}
        <DialogContentText component="div" sx={{ fontSize: '1rem' }}>
          Bạn đã trả lời{' '}
          <strong>
            {answeredCount}/{totalQuestions}
          </strong>{' '}
          câu hỏi.
          {answeredCount < totalQuestions && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha('#FF9800', 0.1),
                borderRadius: 2,
              }}
            >
              <Typography color="warning.main" sx={{ fontWeight: 600 }}>
                ⚠️ Còn {totalQuestions - answeredCount} câu chưa trả lời!
              </Typography>
            </Box>
          )}
          <Typography sx={{ mt: 2 }}>
            Bạn có chắc chắn muốn nộp bài không? Bạn sẽ không thể thay đổi câu
            trả lời sau khi nộp.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={20} /> : 'Xác nhận nộp bài'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmSubmitDialog;