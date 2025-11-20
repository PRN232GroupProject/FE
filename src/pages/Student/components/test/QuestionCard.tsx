import React from 'react';
import type { IQuestionResponse } from '../../../../types/test.types';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface QuestionCardProps {
  question: IQuestionResponse;
  index: number;
  currentAnswer: string;
  onAnswerChange: (questionId: number, value: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  currentAnswer,
  onAnswerChange,
}) => {
  const isAnswered = currentAnswer !== '';

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderLeft: 5,
        borderColor: isAnswered ? 'success.main' : 'grey.300',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Chip
            label={`Câu ${index + 1}`}
            color="primary"
            sx={{ fontWeight: 700 }}
          />
          {isAnswered && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Đã trả lời"
              color="success"
              size="small"
            />
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {question.content}
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={currentAnswer || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
          >
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: '1fr',
                sm: '1fr 1fr',
              }}
            >
              {Object.entries(question.options).map(([key, value]) => (
                <Paper
                  key={key}
                  elevation={currentAnswer === key ? 3 : 1}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 2,
                    borderColor:
                      currentAnswer === key ? 'primary.main' : 'transparent',
                    bgcolor:
                      currentAnswer === key
                        ? alpha('#FF6C00', 0.05)
                        : 'transparent',
                    '&:hover': {
                      bgcolor: alpha('#FF6C00', 0.08),
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => onAnswerChange(question.id, key)}
                >
                  <FormControlLabel
                    value={key}
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontWeight: currentAnswer === key ? 600 : 400 }}>
                        {key}. {value}
                      </Typography>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;