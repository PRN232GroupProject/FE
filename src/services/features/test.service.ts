import type { ApiResponse } from '../../types/api.types';
import type { ITestResponse } from '../../types/test.types'; // Dùng ITestResponse
import axiosInstance from '../constant/axiosInstance';

export const testService = {
  testEndpoint: '/tests',

  // Đổi return type thành ITestResponse[]
  async getAllTests(filters?: any): Promise<ApiResponse<ITestResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ITestResponse[]>>(
        this.testEndpoint,
        { params: filters }
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Fetching tests failed');
      throw new Error('Network Error occurred!');
    }
  },

  async getTestById(id: number): Promise<ApiResponse<ITestResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ITestResponse>>(
        `${this.testEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Fetching test details failed');
      throw new Error('Network Error occurred!');
    }
  },
};