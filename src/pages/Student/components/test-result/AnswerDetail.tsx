import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Paper, Divider, alpha } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import type { ITestAnswerDetail } from '../../../../types/test.types';

interface AnswerDetailProps {
  answer: ITestAnswerDetail;
  index: number;
}

const AnswerDetail: React.FC<AnswerDetailProps> = ({ answer, index }) => {
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderLeft: 5,
        borderColor: answer.isCorrect ? 'success.main' : 'error.main',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label={`Câu ${index + 1}`} color="primary" sx={{ fontWeight: 700 }} />
          <Chip
            icon={answer.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
            label={answer.isCorrect ? 'Đúng' : 'Sai'}
            color={answer.isCorrect ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {answer.content}
        </Typography>

        {/* Options */}
        <Box
          display="grid"
          gap={2}
          sx={{ my: 2 }}
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr',
          }}
        >
          {Object.entries(answer.options).map(([key, value]) => {
            const isSelected = answer.selectedAnswer === key;
            const isCorrect = answer.correctAnswer === key;

            let bgcolor = 'background.paper';
            let borderColor = 'divider';
            let color = 'text.primary';

            if (isCorrect) {
              bgcolor = alpha('#4CAF50', 0.1);
              borderColor = 'success.main';
              color = 'success.main';
            }
            if (isSelected && !isCorrect) {
              bgcolor = alpha('#F44336', 0.1);
              borderColor = 'error.main';
              color = 'error.main';
            }

            return (
              <Paper
                key={key}
                elevation={isSelected || isCorrect ? 3 : 1}
                sx={{
                  p: 2,
                  border: 2,
                  borderColor,
                  bgcolor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {isCorrect && <CheckCircleIcon sx={{ color: 'success.main' }} />}
                {isSelected && !isCorrect && <CancelIcon sx={{ color: 'error.main' }} />}
                <Typography sx={{ fontWeight: isSelected || isCorrect ? 600 : 400, color }}>
                  {key}. {value}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={`Bạn chọn: ${answer.selectedAnswer || 'Không chọn'}`}
            color={answer.isCorrect ? 'success' : 'error'}
            variant="outlined"
          />
          <Chip
            label={`Đáp án đúng: ${answer.correctAnswer}`}
            color="success"
            variant="filled"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            bgcolor: alpha('#2196F3', 0.05),
            p: 2,
            borderRadius: 2,
            borderLeft: 4,
            borderColor: 'info.main',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
            💡 Giải thích chi tiết:
          </Typography>
          <Box
            dangerouslySetInnerHTML={createMarkup(answer.explanation)}
            sx={{
              '& p': { margin: '8px 0' },
              '& sub': { fontSize: '0.75em', bottom: '-0.25em' },
              '& strong': { color: 'primary.main' },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnswerDetail;