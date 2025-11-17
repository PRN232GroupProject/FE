import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Chip,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import {
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import type { IChapter } from '../../../../types/content.types';

interface ChapterAccordionProps {
  chapter: IChapter;
  completedLessons: number;
  progress: number;
  defaultExpanded?: boolean;
}

const ChapterAccordion: React.FC<ChapterAccordionProps> = ({
  chapter,
  completedLessons,
  progress,
  defaultExpanded = false,
}) => {
  const navigate = useNavigate();

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 2,
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
          margin: '16px 0',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 3,
          '&.Mui-expanded': {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              icon={<SchoolIcon />}
              label={`Lớp ${chapter.grade}`}
              size="small"
              color="primary"
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {chapter.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                bgcolor: alpha('#FF6C00', 0.1),
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 120 }}>
              {completedLessons}/{chapter.lessons.length} bài hoàn thành
            </Typography>
          </Stack>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List sx={{ p: 0 }}>
          {chapter.lessons.map((lesson, idx) => (
            <ListItem key={lesson.id} disablePadding>
              <ListItemButton
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                sx={{
                  py: 2,
                  px: 3,
                  borderTop: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: alpha('#FF6C00', 0.05),
                  },
                }}
              >
                <ListItemIcon>
                  {idx < completedLessons ? (
                    <CheckIcon sx={{ color: 'success.main' }} />
                  ) : (
                    <PlayIcon sx={{ color: 'text.secondary' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={lesson.title}
                  primaryTypographyProps={{
                    fontWeight: idx < completedLessons ? 600 : 400,
                    color: idx < completedLessons ? 'text.primary' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default ChapterAccordion;