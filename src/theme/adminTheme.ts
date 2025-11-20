import { createTheme } from '@mui/material/styles';

const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#0055A5', 
      light: '#4dabf5',
      dark: '#003D7A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#ED6C02',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#0288D1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8, // KHÔI PHỤC: Bo góc cho các thẻ Card, Input, Table (như Student)
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none', // QUAN TRỌNG: Xóa viền phải để liền mạch với nội dung
          backgroundColor: '#004280', // Đảm bảo màu nền chuẩn
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // Xóa bóng đổ để liền khối
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Card bo góc mạnh hơn chút cho đẹp
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.03)',
        },
        rounded: {
            borderRadius: 12,
        }
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 700,
          fontSize: '0.75rem',
          height: 24,
          width: 80, 
          justifyContent: 'center',
        },
        label: {
          paddingLeft: 4,
          paddingRight: 4,
          width: '100%',
          textAlign: 'center',
        },
      },
    },
  },
});

export default adminTheme;