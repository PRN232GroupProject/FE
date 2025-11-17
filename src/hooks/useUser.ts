// src/hooks/useUser.ts
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { userService } from '../services/features/user.service';
import { useAuthStore } from '../stores/authStore';
import type { IUpdateProfileRequest } from '../types/user.types'

export const USER_QUERY_KEY = 'currentUser';

/**
 * Hook lấy thông tin user hiện tại (cho trang Profile)
 */
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    // 1. queryKey: Tên định danh cho cache này
    queryKey: [USER_QUERY_KEY],

    // 2. queryFn: Hàm gọi API
    queryFn: () => userService.getCurrentUser(),

    // 3. select: Chỉ trả về `data` từ `ApiResponse`
    select: (response) => response.data,

    // 4. enabled: Chỉ chạy query này khi user đã đăng nhập
    enabled: !!isAuthenticated,

    // 5. staleTime: Cache data này "mãi mãi" (Infinity)
    // Dữ liệu user chỉ bị fetch lại khi:
    // - User reload trang
    // - Chúng ta chủ động invalidate (ví dụ: sau khi update profile)
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateProfileRequest) => 
      userService.updateProfile(data),

    onSuccess: (response) => {
      const updatedUser = response.data;
      const { token } = useAuthStore.getState();

      if (token && updatedUser) {
        // 1. Cập nhật user trong Zustand store (để Header thay đổi)
        useAuthStore.getState().loginToStore(token, updatedUser);
      }
      
      // 2. Làm mới (invalidate) query 'currentUser'
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};