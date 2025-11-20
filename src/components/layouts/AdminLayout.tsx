import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import adminTheme from '../../theme/adminTheme';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, alpha
} from '@mui/material';
import {
  Dashboard, People, School, Quiz, Menu as MenuIcon, 
  Logout, School as SchoolIcon
} from '@mui/icons-material';
import { authService } from '../../services/features/auth.service';
import { userService } from '../../services/features/user.service';
import type { IUser } from '../../types/user.types';

const DRAWER_WIDTH = 260;
const THEME_COLOR = '#004280'; // Màu chủ đạo chung

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<IUser | null>(null);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { text: 'Tổng quan', icon: <Dashboard />, path: '/admin' },
    { text: 'Quản lý Người dùng', icon: <People />, path: '/admin/users' },
    { text: 'Quản lý Bài học', icon: <School />, path: '/admin/lessons' },
    { text: 'Quản lý Bài test', icon: <Quiz />, path: '/admin/tests' },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const drawer = (
    // Box này chứa nội dung Sidebar
    <Box sx={{ height: '100%', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Area - Căn chỉnh chiều cao khớp với Toolbar bên phải */}
      <Box sx={{ pl: 3, pr: 2, display: 'flex', alignItems: 'center', gap: 2, minHeight: 64 }}>
         <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
         <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>Admin Portal</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Nền tảng BinBin</Typography>
         </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0 }} />
      
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 2, // Bo góc nhẹ cho nút menu
                minHeight: 48,
                color: 'rgba(255,255,255,0.8)',
                '&.Mui-selected': { 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    color: '#ffffff',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#ffffff' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: location.pathname === item.path ? 700 : 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
        {/* AppBar: Làm liền khối với Sidebar */}
        <AppBar 
            position="fixed" 
            sx={{ 
                width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, 
                ml: { md: `${DRAWER_WIDTH}px` }, 
                bgcolor: THEME_COLOR, // Cùng màu với Sidebar
                color: 'white', 
                boxShadow: 'none', // Bỏ bóng để không thấy vạch ngăn cách
                borderBottom: 'none', // Bỏ viền dưới
                borderRadius: 0 // Ép vuông góc
            }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            
            {/* User Profile Section - Đã chỉnh màu */}
            <Box 
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ 
                    display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
                    // Đổi màu nền nút profile cho hài hòa với nền xanh đậm
                    bgcolor: alpha('#ffffff', 0.1), 
                    py: 0.5, px: 1.5, pr: 2.5, borderRadius: 50,
                    transition: '0.2s',
                    '&:hover': { bgcolor: alpha('#ffffff', 0.2) }
                }}
            >
               {/* Avatar màu trắng chữ xanh */}
               <Avatar sx={{ bgcolor: 'white', color: THEME_COLOR, width: 32, height: 32, fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {user?.fullName?.[0] || 'A'}
               </Avatar>
               <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ lineHeight: 1.2, fontWeight: 600 }}>{user?.fullName}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9, lineHeight: 1 }}>{user?.role}</Typography>
               </Box>
            </Box>
            
            <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={() => setAnchorEl(null)} 
                PaperProps={{ 
                  sx: { 
                    mt: 1.5, 
                    minWidth: 160, 
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: 2
                  } 
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
               {/* Menu Logout - Màu chữ thường */}
               <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                    <Logout sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} /> 
                    <Typography variant="body2" fontWeight="500">Đăng xuất</Typography>
               </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        
        {/* Sidebar Navigation */}
        <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
          <Drawer 
            variant="temporary" 
            open={mobileOpen} 
            onClose={() => setMobileOpen(false)} 
            sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: THEME_COLOR, border: 'none' } }}
          >
            {drawer}
          </Drawer>
          <Drawer 
            variant="permanent" 
            sx={{ 
              display: { xs: 'none', md: 'block' }, 
              '& .MuiDrawer-paper': { 
                width: DRAWER_WIDTH, 
                border: 'none', // Bỏ viền phải
                bgcolor: THEME_COLOR, // Màu nền đồng bộ
                borderRadius: 0 // Ép vuông góc
              } 
            }} 
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;