import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button, Stack, alpha } from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Videocam as VideoIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';

interface IResource {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link';
  category: 'theory' | 'formula' | 'periodic-table' | 'exercise';
  url: string;
  size?: string;
  views?: number;
}

interface ResourceCardProps {
  resource: IResource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon sx={{ fontSize: 40, color: 'error.main' }} />;
      case 'video':
        return <VideoIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'link':
        return <LinkIcon sx={{ fontSize: 40, color: 'info.main' }} />;
      default:
        return <BookIcon sx={{ fontSize: 40 }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'Video';
      case 'link':
        return 'Link';
      default:
        return type;
    }
  };

  const getButtonLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'Tải xuống';
      case 'video':
        return 'Xem video';
      case 'link':
        return 'Truy cập';
      default:
        return 'Xem';
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8,
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.1)}, ${alpha(
            '#0055A5',
            0.1
          )})`,
        }}
      >
        {getResourceIcon(resource.type)}
        <Chip
          label={getTypeLabel(resource.type)}
          size="small"
          color="primary"
          sx={{ mt: 1, fontWeight: 600 }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {resource.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {resource.description}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          {resource.size && (
            <Typography variant="caption" color="text.secondary">
              📦 Dung lượng: {resource.size}
            </Typography>
          )}
          {resource.views && (
            <Typography variant="caption" color="text.secondary">
              👁️ Lượt xem: {resource.views}
            </Typography>
          )}
        </Stack>

        <Button
          variant="contained"
          fullWidth
          startIcon={
            resource.type === 'pdf' || resource.type === 'link' ? (
              <DownloadIcon />
            ) : (
              <VideoIcon />
            )
          }
          onClick={() => window.open(resource.url, '_blank')}
          sx={{
            mt: 'auto',
            borderRadius: 2,
            py: 1.2,
            fontWeight: 600,
          }}
        >
          {getButtonLabel(resource.type)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;