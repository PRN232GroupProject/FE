import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  alpha,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Description as DocumentIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { resourceService } from '../../services/features/resource.service';
import { lessonService } from '../../services/features/lesson.service';
import type { IResourceResponse, ILessonResponse } from '../../types/content.types';

const resourceTypeOptions = [
  { value: 'video', label: 'Video', icon: <VideoIcon /> },
  { value: 'pdf', label: 'PDF', icon: <PdfIcon /> },
  { value: 'document', label: 'Document', icon: <DocumentIcon /> },
  { value: 'link', label: 'Link', icon: <LinkIcon /> },
];

interface ResourceFormData {
  lessonId: number;
  resourceTitle: string;
  resourceType: 'video' | 'pdf' | 'document' | 'link';
  resourceUrl: string;
  resourceDescription?: string;
}

const ResourceManagementPage: React.FC = () => {
  const [resources, setResources] = useState<IResourceResponse[]>([]);
  const [lessons, setLessons] = useState<ILessonResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Resource dialog states
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<IResourceResponse | null>(null);
  const [resourceFormData, setResourceFormData] = useState<ResourceFormData>({
    lessonId: 0,
    resourceTitle: '',
    resourceType: 'document',
    resourceUrl: '',
    resourceDescription: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Resource detail dialog states
  const [resourceDetailDialogOpen, setResourceDetailDialogOpen] = useState(false);
  const [viewingResource, setViewingResource] = useState<IResourceResponse | null>(null);

  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resourcesRes, lessonsRes] = await Promise.all([
        resourceService.getAllResources(),
        lessonService.getAllLessons(),
      ]);
      setResources(resourcesRes.data);
      setLessons(lessonsRes.data);
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // === RESOURCE HANDLERS ===
  const handleOpenResourceDialog = (resource?: IResourceResponse) => {
    if (resource) {
      setEditingResource(resource);
      setResourceFormData({
        lessonId: resource.lessonId,
        resourceTitle: resource.resourceTitle,
        resourceType: (resource.resourceType as any) || 'document',
        resourceUrl: resource.resourceUrl || '',
        resourceDescription: resource.resourceDescription || '',
      });
    } else {
      setEditingResource(null);
      setResourceFormData({
        lessonId: 0,
        resourceTitle: '',
        resourceType: 'document',
        resourceUrl: '',
        resourceDescription: '',
      });
    }
    setUploadFile(null);
    setResourceDialogOpen(true);
  };

  const handleCloseResourceDialog = () => {
    setResourceDialogOpen(false);
    setEditingResource(null);
    setUploadFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      // Auto-detect resource type based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setResourceFormData({ ...resourceFormData, resourceType: 'pdf' });
      } else if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(extension || '')) {
        setResourceFormData({ ...resourceFormData, resourceType: 'video' });
      } else {
        setResourceFormData({ ...resourceFormData, resourceType: 'document' });
      }
    }
  };

  const handleSaveResource = async () => {
    if (!resourceFormData.lessonId) {
      showSnackbar('Vui lòng chọn bài học', 'error');
      return;
    }

    if (!resourceFormData.resourceTitle) {
      showSnackbar('Vui lòng nhập tiêu đề tài nguyên', 'error');
      return;
    }

    // For link type, URL is required
    if (resourceFormData.resourceType === 'link' && !resourceFormData.resourceUrl && !uploadFile) {
      showSnackbar('Vui lòng nhập URL hoặc chọn file', 'error');
      return;
    }

    setUploadProgress(true);
    try {
      if (editingResource) {
        await resourceService.updateResource(
          editingResource.resourceId,
          resourceFormData,
          uploadFile || undefined
        );
        showSnackbar('Cập nhật tài nguyên thành công!', 'success');
      } else {
        await resourceService.createResource(resourceFormData, uploadFile || undefined);
        showSnackbar('Tạo tài nguyên mới thành công!', 'success');
      }
      handleCloseResourceDialog();
      fetchData();
    } catch (error: any) {
      showSnackbar(error.message || 'Lưu tài nguyên thất bại', 'error');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDeleteResource = async (resource: IResourceResponse) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài nguyên này?')) {
      return;
    }
    try {
      await resourceService.deleteResource(resource.resourceId, resource.resourceUrl);
      showSnackbar('Xóa tài nguyên thành công!', 'success');
      fetchData();
    } catch (error: any) {
      showSnackbar(error.message || 'Xóa tài nguyên thất bại', 'error');
    }
  };

  const handleOpenResourceDetail = (resource: IResourceResponse) => {
    setViewingResource(resource);
    setResourceDetailDialogOpen(true);
  };

  const handleCloseResourceDetail = () => {
    setResourceDetailDialogOpen(false);
    setViewingResource(null);
  };

  const getResourceTypeIcon = (type?: string) => {
    switch (type) {
      case 'video':
        return <VideoIcon />;
      case 'pdf':
        return <PdfIcon />;
      case 'document':
        return <DocumentIcon />;
      case 'link':
        return <LinkIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  const getResourceTypeColor = (type?: string) => {
    switch (type) {
      case 'video':
        return '#FF6C00';
      case 'pdf':
        return '#D32F2F';
      case 'document':
        return '#1976D2';
      case 'link':
        return '#388E3C';
      default:
        return '#757575';
    }
  };

  const getLessonTitle = (lessonId: number) => {
    const lesson = lessons.find((l) => l.lessonId === lessonId);
    return lesson?.title || `Bài học #${lessonId}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#FF6C00', 0.9)}, ${alpha(
            '#0055A5',
            0.9
          )})`,
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            right: 150,
            width: 150,
            height: 150,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
              📚 Quản lý Tài nguyên
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              Tạo, chỉnh sửa và quản lý tài nguyên học tập
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                icon={<VideoIcon />}
                label={`${resources.filter((r) => r.resourceType === 'video').length} Video`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
              <Chip
                icon={<PdfIcon />}
                label={`${resources.filter((r) => r.resourceType === 'pdf').length} PDF`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
              <Chip
                icon={<DocumentIcon />}
                label={`${resources.filter((r) => r.resourceType === 'document').length} Document`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
              <Chip
                icon={<LinkIcon />}
                label={`${resources.filter((r) => r.resourceType === 'link').length} Link`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
            </Stack>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenResourceDialog()}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                boxShadow: 6,
              },
            }}
          >
            Thêm Tài nguyên mới
          </Button>
        </Box>
      </Box>

      {/* Resources Table */}
      <Card
        elevation={2}
        sx={{
          bgcolor: 'white',
          border: 2,
          borderColor: '#FF6C00',
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {resources.length === 0 ? (
            <Alert severity="info">
              Chưa có tài nguyên nào. Nhấn "Thêm Tài nguyên mới" để bắt đầu.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#FF6C00', 0.1) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Tiêu đề</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Bài học</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mô tả</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.resourceId} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {resource.resourceTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getLessonTitle(resource.lessonId)}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getResourceTypeIcon(resource.resourceType)}
                          label={resource.resourceType?.toUpperCase() || 'N/A'}
                          size="small"
                          sx={{
                            bgcolor: alpha(getResourceTypeColor(resource.resourceType), 0.1),
                            color: getResourceTypeColor(resource.resourceType),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 300 }}
                          color="text.secondary"
                        >
                          {resource.resourceDescription || 'Chưa có mô tả'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenResourceDetail(resource)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa tài nguyên">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenResourceDialog(resource)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa tài nguyên">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteResource(resource)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Resource Dialog */}
      <Dialog
        open={resourceDialogOpen}
        onClose={handleCloseResourceDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'white',
            border: 2,
            borderColor: '#FF6C00',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem' }}>
          {editingResource ? '✏️ Chỉnh sửa Tài nguyên' : '➕ Tạo Tài nguyên mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Bài học</InputLabel>
              <Select
                value={resourceFormData.lessonId}
                onChange={(e) =>
                  setResourceFormData({ ...resourceFormData, lessonId: Number(e.target.value) })
                }
                label="Bài học"
              >
                <MenuItem value={0} disabled>
                  -- Chọn bài học --
                </MenuItem>
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tiêu đề tài nguyên"
              fullWidth
              required
              value={resourceFormData.resourceTitle}
              onChange={(e) =>
                setResourceFormData({ ...resourceFormData, resourceTitle: e.target.value })
              }
            />

            <FormControl fullWidth required>
              <InputLabel>Loại tài nguyên</InputLabel>
              <Select
                value={resourceFormData.resourceType}
                onChange={(e) =>
                  setResourceFormData({
                    ...resourceFormData,
                    resourceType: e.target.value as any,
                  })
                }
                label="Loại tài nguyên"
              >
                {resourceTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* File Upload */}
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{
                  borderColor: '#FF6C00',
                  color: '#FF6C00',
                  '&:hover': {
                    borderColor: '#FF8C00',
                    bgcolor: alpha('#FF6C00', 0.05),
                  },
                }}
              >
                {uploadFile ? uploadFile.name : 'Chọn File'}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <FormHelperText>
                {resourceFormData.resourceType === 'link'
                  ? 'Tùy chọn: Upload file hoặc nhập URL bên dưới'
                  : 'Upload file sẽ tự động lưu lên Cloudinary'}
              </FormHelperText>
            </Box>

            {/* URL Input (for links or manual URL) */}
            <TextField
              label="URL tài nguyên"
              fullWidth
              value={resourceFormData.resourceUrl}
              onChange={(e) =>
                setResourceFormData({ ...resourceFormData, resourceUrl: e.target.value })
              }
              helperText={
                uploadFile
                  ? 'URL sẽ được tự động tạo từ file upload'
                  : 'Hoặc nhập URL trực tiếp'
              }
              disabled={!!uploadFile}
            />

            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={resourceFormData.resourceDescription}
              onChange={(e) =>
                setResourceFormData({ ...resourceFormData, resourceDescription: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseResourceDialog}
            disabled={uploadProgress}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveResource}
            disabled={uploadProgress || !resourceFormData.resourceTitle || !resourceFormData.lessonId}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              bgcolor: '#FF6C00',
              '&:hover': {
                bgcolor: '#FF8C00',
              },
            }}
          >
            {uploadProgress ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Đang tải...
              </>
            ) : editingResource ? (
              'Cập nhật'
            ) : (
              'Tạo mới'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resource Detail Dialog */}
      <Dialog
        open={resourceDetailDialogOpen}
        onClose={handleCloseResourceDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'white',
            border: 2,
            borderColor: '#FF6C00',
          },
        }}
      >
        <DialogTitle
          sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem', borderBottom: '2px solid #FF6C00' }}
        >
          📄 Chi tiết Tài nguyên
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewingResource && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Tiêu đề
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 600, color: '#FF6C00' }}>
                  {viewingResource.resourceTitle}
                </Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Bài học
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {getLessonTitle(viewingResource.lessonId)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Loại tài nguyên
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={getResourceTypeIcon(viewingResource.resourceType)}
                    label={viewingResource.resourceType?.toUpperCase() || 'N/A'}
                    sx={{
                      bgcolor: alpha(getResourceTypeColor(viewingResource.resourceType), 0.1),
                      color: getResourceTypeColor(viewingResource.resourceType),
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  URL
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: '#F5F9FF',
                    borderColor: '#C7DEFF',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                    }}
                  >
                    {viewingResource.resourceUrl || 'Chưa có URL'}
                  </Typography>
                  {viewingResource.resourceUrl && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      href={viewingResource.resourceUrl}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      Mở Link
                    </Button>
                  )}
                </Paper>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Mô tả
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: '#FFF8F0',
                    borderColor: '#FFE0C7',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {viewingResource.resourceDescription || 'Chưa có mô tả'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #eee' }}>
          <Button
            onClick={handleCloseResourceDetail}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              bgcolor: '#FF6C00',
              '&:hover': {
                bgcolor: '#FF8C00',
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResourceManagementPage;
