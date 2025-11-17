import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Videocam as VideoIcon,
  Link as LinkIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';

interface IResource {
  id: number;
  title: string;
  type: 'pdf' | 'video' | 'link';
  views?: number;
}

interface PopularResourcesProps {
  resources: IResource[];
}

const PopularResources: React.FC<PopularResourcesProps> = ({ resources }) => {
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

  const topResources = resources
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
        📚 Tài liệu phổ biến
      </Typography>
      <List>
        {topResources.map((resource) => (
          <ListItem key={resource.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: alpha('#FF6C00', 0.05),
                  borderColor: 'primary.main',
                },
              }}
            >
              <ListItemIcon>{getResourceIcon(resource.type)}</ListItemIcon>
              <ListItemText
                primary={resource.title}
                secondary={`${resource.views} lượt xem`}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              <Chip label={getTypeLabel(resource.type)} size="small" color="primary" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PopularResources;