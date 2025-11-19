import type { ApiResponse } from '../../types/api.types';
import type { 
  IChapterResponse, 
  ICreateChapterRequest, 
  IUpdateChapterRequest 
} from '../../types/content.types';
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

  async getChapterById(id: number): Promise<ApiResponse<IChapterResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IChapterResponse>>(
        `${this.chapterEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get chapter by id error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching chapter failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async createChapter(data: ICreateChapterRequest): Promise<ApiResponse<IChapterResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<IChapterResponse>>(
        this.chapterEndpoint,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Create chapter error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Creating chapter failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async updateChapter(
    id: number,
    data: IUpdateChapterRequest
  ): Promise<ApiResponse<IChapterResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<IChapterResponse>>(
        `${this.chapterEndpoint}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Update chapter error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Updating chapter failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async deleteChapter(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<any>>(
        `${this.chapterEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Delete chapter error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Deleting chapter failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
};