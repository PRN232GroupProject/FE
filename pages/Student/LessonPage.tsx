import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ILessonDetail, IResource } from '../../types/content.types';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import ReactPlayer from 'react-player';
import VideocamIcon from '@mui/icons-material/Videocam';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<ILessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchLesson = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (SẼ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   const response = await contentService.getLessonDetail(id);
      //   setLesson(response.data);
      //   if (response.data.resources.length > 0) {
      //     setSelectedResource(response.data.resources[0]); // Chọn resource đầu tiên
      //   }
      // } catch (error) {
      //   console.error("Lỗi khi tải bài học", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: ILessonDetail = {
          id: parseInt(id),
          title: `Bài ${id}: Axit, Bazơ và Muối`,
          objectives: 'Hiểu rõ khái niệm axit, bazơ theo thuyết Arrhenius và Bronsted. Nắm vững cách tính pH.',
          resources: [
            { id: 1, title: 'Video bài giảng: Axit, Bazơ', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { id: 2, title: 'Tài liệu PDF: Axit, Bazơ', type: 'pdf', url: '/docs/axit_bazo.pdf' },
            { id: 3, title: 'Video: Bài tập ví dụ', type: 'video', url: 'https://www.youtube.com/watch?v=L-2Of9aznxg' },
          ],
        };
        setLesson(stubData);
        if (stubData.resources.length > 0) {
          setSelectedResource(stubData.resources[0]); // Chọn resource đầu tiên
        }
        setLoading(false);
      }, 500);
      // ---- HẾT DỮ LIỆU CỨNG ----
    };
    fetchLesson();
  }, [id]);

  const renderResourceContent = () => {
    if (!selectedResource) {
      return <Typography>Chọn một tài liệu để xem</Typography>;
    }
    if (selectedResource.type === 'video') {
      return (
        <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}>
          <ReactPlayer
            src={selectedResource.url}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </Box>
      );
    }
    if (selectedResource.type === 'pdf') {
      return (
        <Box sx={{ height: '70vh' }}>
          <iframe
            src={selectedResource.url}
            width="100%"
            height="100%"
            title={selectedResource.title}
          />
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (!lesson) {
    return <Typography>Không tìm thấy bài học.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{lesson.title}</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        <strong>Mục tiêu:</strong> {lesson.objectives}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          // Mặc định là 'row'. Trên mobile (xs) thì xếp chồng, trên desktop (md) thì xếp hàng ngang
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3, // Tương đương với 'spacing={3}' của Grid
        }}
      >
        {/* Cột chính: Nội dung bài học */}
        <Box sx={{ 
          width: { xs: '100%', md: '75%' }, // 9/12 = 75%
          flexShrink: 0 
        }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {renderResourceContent()}
          </Paper>
        </Box>

        {/* Cột phụ: Danh sách tài liệu */}
        <Box sx={{ 
          width: { xs: '100%', md: '25%' }, // 3/12 = 25%
          flexGrow: 1 
        }}>
          <Paper elevation={3}>
            <Typography variant="h6" sx={{ p: 2 }}>Tài liệu bài giảng</Typography>
            <Divider />
            <List>
              {lesson.resources.map((res) => (
                <ListItem
                  key={res.id}
                  disablePadding
                  sx={{
                    backgroundColor: selectedResource?.id === res.id ? '#e0f7fa' : 'inherit',
                  }}
                >
                  <ListItemButton onClick={() => setSelectedResource(res)}>
                    <ListItemIcon>
                      {res.type === 'video' ? <VideocamIcon /> : <PictureAsPdfIcon />}
                    </ListItemIcon>
                    <ListItemText primary={res.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonPage;