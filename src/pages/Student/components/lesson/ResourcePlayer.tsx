import React, { useRef, useEffect } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Description as DescriptionIcon } from '@mui/icons-material';
import type { IResource } from '../../../../types/content.types';

interface ResourcePlayerProps {
  resource: IResource | null;
  isCompleted: boolean;
  onComplete: (resourceId: number) => void;
  isMarkingComplete: boolean;
}

const ResourcePlayer: React.FC<ResourcePlayerProps> = ({ 
  resource, 
  isCompleted, 
  onComplete, 
  isMarkingComplete 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Cleanup timer khi unmount hoặc resource thay đổi
  useEffect(() => {
    return () => {
      if (autoCompleteTimerRef.current) {
        clearTimeout(autoCompleteTimerRef.current);
      }
    };
  }, [resource?.id]);

  // ✅ Auto-complete cho video sau khi xem gần hết
  useEffect(() => {
    if (!resource || resource.type !== 'video' || isCompleted) return;

    // Clear timer cũ nếu có
    if (autoCompleteTimerRef.current) {
      clearTimeout(autoCompleteTimerRef.current);
    }

    // Giả sử video trung bình dài 10 phút (600s)
    // Auto mark complete sau 9 phút 55 giây (595s)
    // Bạn có thể điều chỉnh thời gian này
    const AUTO_COMPLETE_DELAY = 595000; // 9 phút 55 giây

    autoCompleteTimerRef.current = setTimeout(() => {
      if (!isCompleted && resource) {
        console.log('Auto-completing video resource:', resource.id);
        onComplete(resource.id);
      }
    }, AUTO_COMPLETE_DELAY);

    return () => {
      if (autoCompleteTimerRef.current) {
        clearTimeout(autoCompleteTimerRef.current);
      }
    };
  }, [resource, isCompleted, onComplete]);

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
          <iframe
            ref={iframeRef}
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
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Đã hoàn thành" 
              color="success" 
              size="small" 
            />
          ) : (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => onComplete(resource.id)} 
              disabled={isMarkingComplete}
            >
              {isMarkingComplete ? 'Đang lưu...' : 'Đánh dấu hoàn thành'}
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
            disabled={isCompleted || isMarkingComplete}
          >
            {isCompleted ? 'Đã hoàn thành' : (isMarkingComplete ? 'Đang lưu...' : 'Đánh dấu hoàn thành')}
          </Button>
        </Box>
      </Box>
    );
  }

  return null;
};

export default ResourcePlayer;