import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  MenuBook as BookIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/shared/PageHeader';
import ResourceCard from './components/resource/ResourceCard';

import { useAllResources } from '../../hooks/useContent'; 
import LoadingSpinner from '../../components/shared/LoadingSpinner'; 
import EmptyState from '../../components/shared/EmptyState';

const ResourcesPage: React.FC = () => {
  const {
    data: resources,
    isLoading,
    isError,
  } = useAllResources();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <EmptyState title="Lỗi" description="Không thể tải tài liệu" />;
  }

  return (
    <Box>
      <PageHeader
        title="Tài liệu học tập"
        subtitle="Tổng hợp tài liệu, công thức và bài tập hỗ trợ học tập"
      />

      {/* Resource Cards Grid */}
      {(resources && resources.length > 0) ? (
        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          }}
        >
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={8}>
          <BookIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không có tài liệu nào trong danh mục này
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResourcesPage;