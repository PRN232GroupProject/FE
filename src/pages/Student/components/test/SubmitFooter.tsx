import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Send as SendIcon, Warning as WarningIcon } from '@mui/icons-material';

interface SubmitFooterProps {
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
}

const SubmitFooter: React.FC<SubmitFooterProps> = ({
  answeredCount,
  totalQuestions,
  isSubmitting,
}) => {
  return (
    <Paper elevation={4} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Bạn đã trả lời {answeredCount}/{totalQuestions} câu hỏi
      </Typography>
      {answeredCount < totalQuestions && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <WarningIcon sx={{ color: 'warning.main' }} />
          <Typography variant="body2" color="warning.main">
            Còn {totalQuestions - answeredCount} câu chưa trả lời
          </Typography>
        </Stack>
      )}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        endIcon={isSubmitting ? null : <SendIcon />}
        sx={{
          px: 6,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        {isSubmitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={24} color="inherit" />
            <span>Đang nộp bài...</span>
          </Box>
        ) : (
          'Nộp bài'
        )}
      </Button>
    </Paper>
  );
};

export default SubmitFooter;