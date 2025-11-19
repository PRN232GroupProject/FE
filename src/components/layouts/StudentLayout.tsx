import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  LibraryBooks as LibraryBooksIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { authService } from '../../services/features/auth.service';
import { userService } from '../../services/features/user.service';
import type { IUser } from '../../types/user.types';

const StudentLayout: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const isAuthenticated = authService.isAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        try {
          const response = await userService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };
      fetchUser();
    }
  }, [isAuthenticated]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await authService.logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const menuItems = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Bài học', icon: <SchoolIcon />, path: '/lessons' },
    { text: 'Bài kiểm tra', icon: <QuizIcon />, path: '/tests' },
    { text: 'Tài liệu', icon: <LibraryBooksIcon />, path: '/resources' },
  ];

  if (isAuthenticated && user?.role === 'Student') {
    menuItems.splice(3, 0, {
      text: 'Kết quả',
      icon: <AssessmentIcon />,
      path: '/results',
    });
  }

  // Only show navigation if user is a student or not authenticated
  const showNavigation = !isAuthenticated || user?.role === 'Student';
  
  // Show staff portal link for staff/admin users
  const showStaffPortalLink = isAuthenticated && user && (user.role === 'Staff' || user.role === 'Admin');

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Học Hóa học
        </Typography>
        <Typography variant="caption">Nền tảng học tập trực tuyến</Typography>
      </Box>
      <Divider />
      {showNavigation && (
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              flexGrow: 1,
            }}
            onClick={() => navigate('/')}
          >
            <SchoolIcon sx={{ mr: 1, fontSize: 32 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Học Hóa học
              </Typography>
              {!isMobile && (
                <Typography variant="caption" sx={{ lineHeight: 1 }}>
                  Nền tảng BinBin
                </Typography>
              )}
            </Box>
          </Box>

          {!isMobile && showNavigation && (
            <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    fontWeight: location.pathname === item.path ? 700 : 400,
                    bgcolor:
                      location.pathname === item.path
                        ? 'rgba(255,255,255,0.15)'
                        : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && showStaffPortalLink && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/staff/dashboard')}
              sx={{
                mr: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              Về Staff Portal
            </Button>
          )}

          {isAuthenticated && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  textAlign: 'right',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.fullName}
                </Typography>
                <Chip
                  label={user.role === 'Admin' ? 'Quản trị viên' : user.role === 'Staff' ? 'Quản trị viên' : 'Học sinh'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    height: 20,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    fontWeight: 700,
                    border: '2px solid white',
                  }}
                >
                  {user.fullName ? getInitials(user.fullName) : 'U'}
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {isAuthenticated && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: { mt: 1, minWidth: 200 },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileClick}>
            <PersonIcon sx={{ mr: 1 }} fontSize="small" />
            Thông tin cá nhân
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
            Đăng xuất
          </MenuItem>
        </Menu>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>

      {/* 🚀🚀🚀 PHẦN SỬA Ở ĐÂY 🚀🚀🚀 */}
      <Box
        component="main" // Dùng thẻ <main> cho ngữ nghĩa
        sx={{
          flexGrow: 1, // Để nó lấp đầy không gian
          py: 4, // Chuyển padding ra đây
          bgcolor: 'background.default', // Chuyển màu nền ra đây
        }}
      >
        <Container maxWidth="xl"> {/* Container giờ chỉ lo căn giữa */}
          <Outlet />
        </Container>
      </Box>
      {/* 🚀🚀🚀 HẾT PHẦN SỬA 🚀🚀🚀 */}

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2025 Nền tảng Học Hóa học BinBin. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                Về chúng tôi
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                Liên hệ
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                Điều khoản
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentLayout;