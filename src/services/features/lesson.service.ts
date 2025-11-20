import type { ApiResponse } from '../../types/api.types';
import type { ILessonResponse } from '../../types/content.types';
import axiosInstance from '../constant/axiosInstance';

export const lessonService = {
  lessonEndpoint: '/lessons',

  async getAllLessons(): Promise<ApiResponse<ILessonResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ILessonResponse[]>>(
        `${this.lessonEndpoint}`
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

  async getLessonsByChapter(
    chapterId: number
  ): Promise<ApiResponse<ILessonResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ILessonResponse[]>>(
        `${this.lessonEndpoint}/chapter/${chapterId}`
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Fetching lessons failed');
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
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Fetching lesson detail failed');
      throw new Error('Network Error occurred!');
    }
  },

  async createLesson(data: {
    title: string;
    objectives?: string;
    content?: string;
    chapterId: number;
  }): Promise<ApiResponse<ILessonResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ILessonResponse>>(
        this.lessonEndpoint,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Create lesson error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Creating lesson failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async updateLesson(
    id: number,
    data: {
      title: string;
      objectives?: string;
      content?: string;
      chapterId: number;
    }
  ): Promise<ApiResponse<ILessonResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<ILessonResponse>>(
        `${this.lessonEndpoint}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update lesson error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Updating lesson failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async deleteLesson(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<any>>(
        `${this.lessonEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Delete lesson error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Deleting lesson failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
};