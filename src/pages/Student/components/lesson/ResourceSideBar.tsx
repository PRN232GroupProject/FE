import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  PictureAsPdf as PictureAsPdfIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import type { IResource } from '../../../../types/content.types';

interface ResourceSidebarProps {
  resources: IResource[];
  selectedResource: IResource | null;
  completedResources: number[];
  onSelectResource: (resource: IResource) => void;
}

const ResourceSidebar: React.FC<ResourceSidebarProps> = ({
  resources,
  selectedResource,
  completedResources,
  onSelectResource,
}) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Tài liệu bài giảng
        </Typography>
        <Typography variant="caption">
          Hoàn thành {completedResources.length}/{resources.length}
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {resources.map((res, index) => {
          const isSelected = selectedResource?.id === res.id;
          const isCompleted = completedResources.includes(res.id);

          return (
            <React.Fragment key={res.id}>
              {index > 0 && <Box sx={{ borderTop: 1, borderColor: 'divider' }} />}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => onSelectResource(res)}
                  sx={{
                    py: 2,
                    px: 2,
                    bgcolor: isSelected ? alpha('#FF6C00', 0.1) : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected ? alpha('#FF6C00', 0.15) : alpha('#0055A5', 0.05),
                    },
                  }}
                >
                  <ListItemIcon>
                    {res.type === 'video' ? (
                      <VideocamIcon
                        sx={{
                          color: isSelected ? 'primary.main' : 'text.secondary',
                          fontSize: 28,
                        }}
                      />
                    ) : (
                      <PictureAsPdfIcon
                        sx={{
                          color: isSelected ? 'primary.main' : 'text.secondary',
                          fontSize: 28,
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={res.title}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.95rem',
                      color: isSelected ? 'primary.main' : 'text.primary',
                    }}
                  />
                  {isCompleted ? (
                    <CheckCircleIcon sx={{ color: 'success.main', ml: 1 }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', ml: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default ResourceSidebar;