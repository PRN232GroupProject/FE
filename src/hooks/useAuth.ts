// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/features/auth.service';
import type { ILoginRequest, IRegisterRequest } from '../types/auth.types';

/**
 * Hook xử lý Đăng nhập
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: ILoginRequest) => authService.login(credentials),

    onSuccess: (response) => {
      if (response.data?.role) {
        const role = response.data.role.toLowerCase();
        // Navigate based on role
        if (role === 'student') {
          navigate('/');
        } else if (role === 'admin') {
          navigate('/admin/questions');
        } else {
          navigate('/staff/dashboard');
        }
      }
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
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
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });
};

/**
 * Hook xử lý Đăng xuất
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    await authService.logout();
    queryClient.clear();
    navigate('/login');
  };

  return logout;
};