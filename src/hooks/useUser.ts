// src/hooks/useUser.ts
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { userService } from '../services/features/user.service';
import { authService } from '../services/features/auth.service';
import type { IUpdateProfileRequest } from '../types/user.types'

export const USER_QUERY_KEY = 'currentUser';

/**
 * Hook lấy thông tin user hiện tại (cho trang Profile)
 */
export const useCurrentUser = () => {
  const isAuthenticated = authService.isAuthenticated();

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

    onSuccess: () => {
      // Invalidate query to refetch user data
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};