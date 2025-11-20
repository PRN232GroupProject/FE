import axiosInstance from '../constant/axiosInstance';
import type { ApiResponse } from '../../types/api.types';
import type { IUser } from '../../types/user.types';

export const userService = {
    userEndpoint: '/users',
    authEndpoint: '/auth',

    async getCurrentUser(): Promise<ApiResponse<IUser>> {
        try {
            const response = await axiosInstance.get<ApiResponse<IUser>>(`${this.userEndpoint}/current`);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) throw new Error(apiError.message || 'Fetching current user failed');
            throw new Error("Network Error occurred!");
        }
    },

    async updateProfile(data: Partial<IUser>): Promise<ApiResponse<IUser>> {
        try {
            const response = await axiosInstance.put<ApiResponse<IUser>>(`${this.userEndpoint}/profile`, data);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) throw new Error(apiError.message || 'Update profile failed');
            throw new Error("Network Error occurred!");
        }
    },

    async getAllUsers(): Promise<ApiResponse<IUser[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<IUser[]>>(this.userEndpoint);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async createStaff(data: any): Promise<ApiResponse<IUser>> {
        try {
            const response = await axiosInstance.post<ApiResponse<IUser>>(this.userEndpoint, data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async updateStaff(id: number, data: Partial<IUser>): Promise<ApiResponse<IUser>> {
        try {
            const response = await axiosInstance.put<ApiResponse<IUser>>(`${this.userEndpoint}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async deleteStaff(id: number): Promise<ApiResponse<object>> {
        try {
            const response = await axiosInstance.delete<ApiResponse<object>>(`${this.userEndpoint}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
};