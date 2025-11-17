import type { ApiResponse } from '../../types/api.types';
import type { IChapterResponse } from '../../types/content.types';
import axiosInstance from '../constant/axiosInstance';

export const chapterService = {
  chapterEndpoint: '/chapters',

  async getAllChapters(): Promise<ApiResponse<IChapterResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IChapterResponse[]>>(
        this.chapterEndpoint
      );
      return response.data;
    } catch (error: any) {
      console.error('Get all chapters error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching chapters failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
};