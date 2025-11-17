import axiosInstance from '../constant/axiosInstance';
import type { ApiResponse } from '../../types/api.types';
import type { IUser } from '../../types/user.types';

export const userService = {

    userEndpoint: '/users',

    async getCurrentUser(): Promise<ApiResponse<IUser>> {
        try {
            const response = await axiosInstance.get<ApiResponse<IUser>>(this.userEndpoint + '/current');
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || 'Fetching current user failed');
            }
        } throw new Error("Network Error occured!");
    },
}