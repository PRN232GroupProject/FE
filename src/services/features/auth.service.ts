import type { ApiResponse } from '../../types/api.types';
import type { ILoginRequest, ILoginResponse, IRegisterRequest } from '../../types/auth.types';
import axiosInstance from '../constant/axiosInstance';
import { cacheService } from './cacheService';

export const authService = {

  authEndpoint: '/auth',

  async login(credentials: ILoginRequest): Promise<ApiResponse<ILoginResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ILoginResponse>>(this.authEndpoint+'/login', credentials);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      console.log(apiError);
      if (apiError) {
        throw new Error(apiError.message || 'Login failed');
      }
      throw new Error("Network Error occured!");
    }
  },

  async register(credentials: IRegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>(this.authEndpoint + '/register', credentials);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Registration failed');
      }
    }  throw new Error("Network Error occured!");
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // Clear all cache data on logout
      cacheService.clear();
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      // Clear all cache data even if logout fails
      cacheService.clear();
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
