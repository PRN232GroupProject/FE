import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { userService } from '../services/features/user.service';
import type { IUpdateProfileRequest } from '../types/user.types';

export const USER_QUERY_KEY = 'currentUser';

export const useCurrentUser = () => {
  const token = localStorage.getItem('token');

  const query = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => userService.getCurrentUser(),
    select: (response) => response.data,
    // Chỉ fetch khi có token
    enabled: !!token,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Nếu không có token (đã logout), ép buộc trả về undefined để UI reset
  if (!token) {
    return {
      ...query,
      data: undefined, // 👈 SỬA: Dùng undefined thay vì null để khớp type
      isLoading: false,
      isError: false,
      status: 'idle',
      fetchStatus: 'idle',
    } as typeof query;
  }

  return query;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateProfileRequest) => 
      userService.updateProfile(data),

    onSuccess: () => {
      // Chỉ cần invalidate cache để hook useCurrentUser tự lấy lại data mới
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};