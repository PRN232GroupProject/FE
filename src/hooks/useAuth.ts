// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/features/auth.service';
import { getUserFromToken } from '../utils/jwt.utils'; // Import utils bạn đã có
import type { ILoginRequest, IRegisterRequest } from '../types/auth.types';

/**
 * Hook xử lý Đăng nhập
 */
export const useLogin = () => {
  const navigate = useNavigate();
  // Lấy hàm loginToStore từ Zustand store
  const loginToStore = useAuthStore((state) => state.loginToStore);

  return useMutation({
    // mutationFn trỏ đến hàm service của bạn
    mutationFn: (credentials: ILoginRequest) => authService.login(credentials),

    onSuccess: (response) => {
      if (response.data?.token) {
        const token = response.data.token;
        
        // 1. Dùng util của bạn để decode token -> lấy thông tin user
        const user = getUserFromToken(token);

        if (user) {
          // 2. Lưu token và user vào Zustand store
          loginToStore(token, user);

          // 3. Chuyển hướng dựa trên role
          const role = user.role.toLowerCase();
          navigate(role === 'admin' || role === 'staff' ? '/admin' : '/');
        } else {
          // Xử lý lỗi nếu không decode được token
          throw new Error('Invalid token received.');
        }
      }
    },
    onError: (error) => {
      // React Query tự động quản lý 'error' state
      console.error('Login failed:', error.message);
      // Bạn có thể hiện toast lỗi ở đây
    },
  });
};

/**
 * Hook xử lý Đăng ký
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: IRegisterRequest) =>
      authService.register(credentials),

    onSuccess: () => {
      // Đăng ký thành công, chuyển hướng đến trang đăng nhập
      // Bạn có thể hiện toast thành công ở đây
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });
};

/**
 * Hook xử lý Đăng xuất (chỉ là logic phía client)
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const logoutFromStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient(); // 👈 Lấy Query Client

  const logout = async () => {
    // 1. Gọi service để dọn dẹp localStorage
    await authService.logout();
    
    // 2. Gọi store để reset state (user, token...)
    logoutFromStore();

    // 3. (MỚI) Xoá toàn bộ cache của React Query
    queryClient.clear();
    
    // 4. Chuyển hướng về trang login
    navigate('/login');
  };

  return logout;
};