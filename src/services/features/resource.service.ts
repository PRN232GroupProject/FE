import type { ApiResponse } from '../../types/api.types';
import axiosInstance from '../constant/axiosInstance';
import type { IResourceResponse } from '../../types/content.types';

export const resourceService = {
    resourceEndpoint: '/resources',
    async getAllResources(): Promise<ApiResponse<IResourceResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IResourceResponse[]>>(
        this.resourceEndpoint
      );
      return response.data;
    } catch (error: any) {
      console.error('Get all resources error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching resources failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
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