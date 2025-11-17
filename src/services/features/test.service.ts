import type { ApiResponse } from '../../types/api.types';
import type { ITest } from '../../types/test.types';
import axiosInstance from '../constant/axiosInstance';

export const testService = {
  testEndpoint: '/tests', 

  async getAllTests(filters?: any): Promise<ApiResponse<ITest[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ITest[]>>(
        this.testEndpoint,
        { params: filters }
      );
      return response.data;
    } catch (error: any) {
      console.error('Get all tests error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching tests failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
  
};