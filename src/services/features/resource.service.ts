import type { ApiResponse } from '../../types/api.types';
import axiosInstance from '../constant/axiosInstance';

export const resourceService = {
  // Dùng endpoint [HttpPut("/mark/{id}")]
  async markResourceAsCompleted(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosInstance.put<ApiResponse<boolean>>(
        `/mark/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Mark resource completed error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Marking resource failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
};