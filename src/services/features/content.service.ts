import axiosInstance from '../constant/axiosInstance';
import type { ApiResponse } from '../../types/api.types';
import type { ILessonInfo, IChapter } from '../../types/content.types';

export const contentService = {

    chapterEndpoint: '/chapters',
    lessonEndpoint: '/lessons',

    // === CHAPTER METHODS ===
    async getChapters(): Promise<ApiResponse<IChapter[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<IChapter[]>>(this.chapterEndpoint);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Fetching chapters failed');
            }
        } throw new Error("Network Error occured!");
    },

    async getChapterById(id: number): Promise<ApiResponse<IChapter>> {
        try {
            const response = await axiosInstance.get<ApiResponse<IChapter>>(`${this.chapterEndpoint}/${id}`);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Fetching chapter failed');
            }
        } throw new Error("Network Error occured!");
    },

    async createChapter(data: { chapterName: string; grade: number; description: string }): Promise<ApiResponse<IChapter>> {
        try {
            const response = await axiosInstance.post<ApiResponse<IChapter>>(this.chapterEndpoint, data);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Creating chapter failed');
            }
        } throw new Error("Network Error occured!");
    },

    async updateChapter(id: number, data: { chapterName: string; grade: number; description: string }): Promise<ApiResponse<IChapter>> {
        try {
            const response = await axiosInstance.put<ApiResponse<IChapter>>(`${this.chapterEndpoint}/${id}`, data);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Updating chapter failed');
            }
        } throw new Error("Network Error occured!");
    },

    async deleteChapter(id: number): Promise<ApiResponse<any>> {
        try {
            const response = await axiosInstance.delete<ApiResponse<any>>(`${this.chapterEndpoint}/${id}`);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Deleting chapter failed');
            }
        } throw new Error("Network Error occured!");
    },

    // === LESSON METHODS ===
    async getLessons(): Promise<ApiResponse<ILessonInfo[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<ILessonInfo[]>>(this.lessonEndpoint);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Fetching lessons failed');
            }
        } throw new Error("Network Error occured!");
    },

    async getLessonById(id: number): Promise<ApiResponse<ILessonInfo>> {
        try {
            const response = await axiosInstance.get<ApiResponse<ILessonInfo>>(`${this.lessonEndpoint}/${id}`);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Fetching lesson failed');
            }
        } throw new Error("Network Error occured!");
    },

    async createLesson(data: { title: string; objectives: string; content: string; chapterId: number }): Promise<ApiResponse<ILessonInfo>> {
        try {
            const response = await axiosInstance.post<ApiResponse<ILessonInfo>>(this.lessonEndpoint, data);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Creating lesson failed');
            }
        } throw new Error("Network Error occured!");
    },

    async updateLesson(id: number, data: { title: string; objectives: string; content: string; chapterId: number }): Promise<ApiResponse<ILessonInfo>> {
        try {
            const response = await axiosInstance.put<ApiResponse<ILessonInfo>>(`${this.lessonEndpoint}/${id}`, data);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Updating lesson failed');
            }
        } throw new Error("Network Error occured!");
    },

    async deleteLesson(id: number): Promise<ApiResponse<any>> {
        try {
            const response = await axiosInstance.delete<ApiResponse<any>>(`${this.lessonEndpoint}/${id}`);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Deleting lesson failed');
            }
        } throw new Error("Network Error occured!");
    },

}