import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Description as DescriptionIcon } from '@mui/icons-material';
import type { IResource } from '../../../../types/content.types';

interface ResourcePlayerProps {
  resource: IResource | null;
  isCompleted: boolean;
  onComplete: (resourceId: number) => void;
}

const ResourcePlayer: React.FC<ResourcePlayerProps> = ({ resource, isCompleted, onComplete }) => {
  if (!resource) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          color: 'text.secondary',
        }}
      >
        <DescriptionIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">Chọn một tài liệu để xem</Typography>
      </Box>
    );
  }

  if (resource.type === 'video') {
    return (
      <Box>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            bgcolor: 'black',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Using iframe for better compatibility - no ReactPlayer needed */}
          <iframe
            src={resource.url.replace('watch?v=', 'embed/')}
            title={resource.title}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {resource.title}
          </Typography>
          {isCompleted ? (
            <Chip icon={<CheckCircleIcon />} label="Đã hoàn thành" color="success" size="small" />
          ) : (
            <Button variant="outlined" size="small" onClick={() => onComplete(resource.id)}>
              Đánh dấu hoàn thành
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  if (resource.type === 'pdf') {
    return (
      <Box>
        <Box
          sx={{
            height: '70vh',
            borderRadius: 2,
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <iframe
            src={resource.url}
            width="100%"
            height="100%"
            title={resource.title}
            style={{ border: 'none' }}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {resource.title}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => onComplete(resource.id)}
            disabled={isCompleted}
          >
            {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
          </Button>
        </Box>
      </Box>
    );
  }

  return null;
};

export default ResourcePlayer;