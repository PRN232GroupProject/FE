import type { ApiResponse } from '../../types/api.types';
import type { ILessonResponse } from '../../types/content.types';
import axiosInstance from '../constant/axiosInstance';

export const lessonService = {
  lessonEndpoint: '/lessons',

  async getLessonsByChapter(
    chapterId: number
  ): Promise<ApiResponse<ILessonResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ILessonResponse[]>>(
        `${this.lessonEndpoint}/chapter/${chapterId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get lessons by chapter error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching lessons failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async getLessonById(id: number): Promise<ApiResponse<ILessonResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ILessonResponse>>(
        `${this.lessonEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get lesson detail error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching lesson detail failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
};