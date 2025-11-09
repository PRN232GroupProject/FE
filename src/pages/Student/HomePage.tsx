import React, { useEffect, useState } from 'react';
import type { IChapter } from '../../types/content.types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import { Link as RouterLink } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);

      // PHẦN TÍCH HỢP API (SẼ MỞ COMMENT KHI BE SẴN SÀNG)
      // try {
      //   // Giả sử bạn có contentService
      //   const response = await contentService.getChapters(); 
      //   setChapters(response.data); // Lấy từ response chuẩn
      // } catch (error) {
      //   console.error("Lỗi khi tải danh sách chương", error);
      // } finally {
      //   setLoading(false);
      // }

      // ---- DỮ LIỆU CỨNG (ĐỂ PHÁT TRIỂN UI) ----
      setTimeout(() => {
        const stubData: IChapter[] = [
          {
            id: 1,
            name: 'Chương 1: Sự điện li',
            grade: 11,
            description: 'Nội dung về chất điện li, axit, bazơ, muối, pH.',
            lessons: [
              { id: 1, title: 'Bài 1: Axit, Bazơ và Muối' },
              { id: 2, title: 'Bài 2: pH và Chất chỉ thị' },
            ],
          },
          {
            id: 2,
            name: 'Chương 2: Nitơ - Phốtpho',
            grade: 11,
            description: 'Các hợp chất của Nitơ, Phốtpho và các bài toán liên quan.',
            lessons: [{ id: 3, title: 'Bài 3: Amoniac (NH3)' }],
          },
        ];
        setChapters(stubData);
        setLoading(false);
      }, 500); // Giả lập load
      // ---- HẾT DỮ LIỆU CỨNG ----
    };

    fetchChapters();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Danh sách Chương học
      </Typography>
      {chapters.map((chapter) => (
        <Accordion key={chapter.id} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${chapter.id}-content`}
            id={`panel${chapter.id}-header`}
          >
            <Typography variant="h6">{chapter.name} (Lớp {chapter.grade})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: '#f9f9f9' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {chapter.description}
            </Typography>
            <List>
              {chapter.lessons.map((lesson) => (
                <Paper key={lesson.id} elevation={1} sx={{ mb: 1 }}>
                  <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to={`/lesson/${lesson.id}`}>
                      <ListItemIcon>
                        <ArticleIcon />
                      </ListItemIcon>
                      <ListItemText primary={lesson.title} />
                    </ListItemButton>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default HomePage;