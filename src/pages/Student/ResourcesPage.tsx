import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import {
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  ViewModule as TableIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/shared/PageHeader';
import ResourceCard from './components/resource/ResourceCard';
import PopularResources from './components/resource/PopularResources';

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

const ResourcesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // DỮ LIỆU MẪU
  const resources: IResource[] = [
    {
      id: 1,
      title: 'Bảng tuần hoàn các nguyên tố hóa học',
      description: 'Bảng tuần hoàn Mendeleev đầy đủ với thông tin chi tiết về các nguyên tố',
      type: 'pdf',
      category: 'periodic-table',
      url: '/docs/bang-tuan-hoan.pdf',
      size: '2.5 MB',
      views: 1250,
    },
    {
      id: 2,
      title: 'Công thức tính toán Hóa học 11',
      description: 'Tổng hợp công thức tính toán quan trọng cho chương trình Hóa học lớp 11',
      type: 'pdf',
      category: 'formula',
      url: '/docs/cong-thuc-hoa-11.pdf',
      size: '1.8 MB',
      views: 980,
    },
    {
      id: 3,
      title: 'Lý thuyết về Axit - Bazơ',
      description: 'Tài liệu lý thuyết chi tiết về axit, bazơ theo chương trình mới',
      type: 'pdf',
      category: 'theory',
      url: '/docs/ly-thuyet-axit-bazo.pdf',
      size: '3.2 MB',
      views: 1520,
    },
    {
      id: 4,
      title: 'Video: Cân bằng phương trình hóa học',
      description: 'Hướng dẫn chi tiết cách cân bằng các phương trình hóa học phức tạp',
      type: 'video',
      category: 'theory',
      url: 'https://youtube.com/watch?v=example1',
      views: 2340,
    },
    {
      id: 5,
      title: 'Bài tập tính pH dung dịch',
      description: '100 bài tập tính pH từ cơ bản đến nâng cao có lời giải chi tiết',
      type: 'pdf',
      category: 'exercise',
      url: '/docs/bai-tap-ph.pdf',
      size: '4.1 MB',
      views: 890,
    },
    {
      id: 6,
      title: 'Công thức tính nồng độ dung dịch',
      description: 'Các công thức liên quan đến nồng độ mol, nồng độ phần trăm, độ tan',
      type: 'pdf',
      category: 'formula',
      url: '/docs/nong-do-dung-dich.pdf',
      size: '1.2 MB',
      views: 1120,
    },
    {
      id: 7,
      title: 'Tài liệu ôn thi THPT Quốc gia',
      description: 'Tổng hợp kiến thức và bài tập ôn thi THPT Quốc gia môn Hóa',
      type: 'pdf',
      category: 'theory',
      url: '/docs/on-thi-thpt.pdf',
      size: '8.5 MB',
      views: 3200,
    },
    {
      id: 8,
      title: 'Bảng độ âm điện của các nguyên tố',
      description: 'Thang độ âm điện Pauling và ứng dụng',
      type: 'link',
      category: 'periodic-table',
      url: 'https://example.com/electronegativity',
      views: 680,
    },
  ];

  const categories = [
    { value: 0, label: 'Tất cả', icon: <BookIcon /> },
    { value: 1, label: 'Lý thuyết', icon: <ScienceIcon />, filter: 'theory' as const },
    { value: 2, label: 'Công thức', icon: <CalculateIcon />, filter: 'formula' as const },
    {
      value: 3,
      label: 'Bảng tuần hoàn',
      icon: <TableIcon />,
      filter: 'periodic-table' as const,
    },
    { value: 4, label: 'Bài tập', icon: <BookIcon />, filter: 'exercise' as const },
  ];

  const filteredResources =
    selectedTab === 0
      ? resources
      : resources.filter((r) => r.category === categories[selectedTab].filter);

  return (
    <Box>
      <PageHeader
        title="Tài liệu học tập"
        subtitle="Tổng hợp tài liệu, công thức và bài tập hỗ trợ học tập"
      />

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
            },
          }}
        >
          {categories.map((cat) => (
            <Tab key={cat.value} icon={cat.icon} iconPosition="start" label={cat.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Popular Resources */}
      {selectedTab === 0 && <PopularResources resources={resources} />}

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          }}
        >
          {filteredResources.map((resource) => (
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