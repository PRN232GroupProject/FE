import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  alpha,
  Stack,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Videocam as VideoIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  ViewModule as TableIcon,
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
    { value: 1, label: 'Lý thuyết', icon: <ScienceIcon />, filter: 'theory' },
    { value: 2, label: 'Công thức', icon: <CalculateIcon />, filter: 'formula' },
    {
      value: 3,
      label: 'Bảng tuần hoàn',
      icon: <TableIcon />,
      filter: 'periodic-table',
    },
    { value: 4, label: 'Bài tập', icon: <BookIcon />, filter: 'exercise' },
  ];

  const filteredResources =
    selectedTab === 0
      ? resources
      : resources.filter((r) => r.category === categories[selectedTab].filter);

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

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)} 0%, ${alpha(
            '#0055A5',
            0.9,
          )} 100%)`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Tài liệu học tập
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95 }}>
          Tổng hợp tài liệu, công thức và bài tập hỗ trợ học tập
        </Typography>
      </Box>

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
            <Tab
              key={cat.value}
              icon={cat.icon}
              iconPosition="start"
              label={cat.label}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Popular Resources */}
      {selectedTab === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700, color: 'primary.main' }}
          >
            📚 Tài liệu phổ biến
          </Typography>
          <List>
            {resources
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 3)
              .map((resource) => (
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
                    <Chip
                      label={getTypeLabel(resource.type)}
                      size="small"
                      color="primary"
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Paper>
      )}

      {/* === SỬA LỖI GRID: Thay <Grid container> bằng <Box display="grid"> === */}
      <Box
        display="grid"
        gap={3} // Tương đương spacing={3}
        gridTemplateColumns={{
          xs: '1fr', // Tương đương xs={12}
          md: '1fr 1fr', // Tương đương md={6}
          lg: '1fr 1fr 1fr', // Tương đương lg={4}
        }}
      >
        {filteredResources.map((resource) => (
          // <Grid item ...> ĐÃ BỊ XÓA
          // 'key' được chuyển vào Card
          <Card
            key={resource.id}
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
                background: `linear-gradient(135deg, ${alpha(
                  '#FF6C00',
                  0.1,
                )}, ${alpha('#0055A5', 0.1)})`,
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
                {resource.type === 'pdf'
                  ? 'Tải xuống'
                  : resource.type === 'video'
                  ? 'Xem video'
                  : 'Truy cập'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* === HẾT PHẦN SỬA LỖI GRID === */}

      {filteredResources.length === 0 && (
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