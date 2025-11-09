import axios from 'axios';
import { useAuthStore } from '../src/store/authStore';

const apiClient = axios.create({
  baseURL: '/api', // BE của bạn sẽ chạy trên /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn token vào header
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => {
    // Trả về data từ cấu trúc ApiResponse
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Gọi hàm logout từ store
      useAuthStore.getState().logout();
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;