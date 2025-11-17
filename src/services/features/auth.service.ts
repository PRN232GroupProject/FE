import type { ApiResponse } from '../../types/api.types';
import type { ILoginRequest, ILoginResponse, IRegisterRequest } from '../../types/auth.types';
import axiosInstance from '../constant/axiosInstance';
import { cacheService } from './cacheService';

export const authService = {

  authEndpoint: '/auth',

  async login(credentials: ILoginRequest): Promise<ApiResponse<ILoginResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ILoginResponse>>(
        `${this.authEndpoint}/login`, 
        credentials
      );
      console.log('Login response:', response.data);
      
      // Save token if login successful
      if (response.data.data?.token) {
        this.setToken(response.data.data.token);
        if (response.data.data.role) {
          localStorage.setItem('role', response.data.data.role);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Login failed');
      }
      throw new Error("Network Error occurred!");
    }
  },

  async register(credentials: IRegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>(
        `${this.authEndpoint}/register`, 
        {
          fullName: credentials.fullName,
          email: credentials.email,
          password: credentials.password,
        }
      );
      console.log('Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Registration failed');
      }
      throw new Error("Network Error occurred!");
    }
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
      localStorage.removeItem('role');
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
  },

  getRole(): string | null {
    return localStorage.getItem('role');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};