import type { ApiResponse } from '../../types/api.types';
import type { 
  ITestResponse, 
  ICreateTestRequest, 
  IUpdateTestRequest,
  IAddQuestionsToTestRequest,
} from '../../types/test.types';
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

  async createTest(data: ICreateTestRequest): Promise<ApiResponse<ITestResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ITestResponse>>(
        this.testEndpoint,
        data
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Creating test failed');
      throw new Error('Network Error occurred!');
    }
  },

  async updateTest(id: number, data: IUpdateTestRequest): Promise<ApiResponse<ITestResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<ITestResponse>>(
        `${this.testEndpoint}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Updating test failed');
      throw new Error('Network Error occurred!');
    }
  },

  async deleteTest(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `${this.testEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Deleting test failed');
      throw new Error('Network Error occurred!');
    }
  },

  async addQuestionsToTest(testId: number, data: IAddQuestionsToTestRequest): Promise<ApiResponse<ITestResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ITestResponse>>(
        `${this.testEndpoint}/${testId}/questions`,
        data
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Adding questions to test failed');
      throw new Error('Network Error occurred!');
    }
  },

  async removeQuestionFromTest(testId: number, questionId: number): Promise<ApiResponse<ITestResponse>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<ITestResponse>>(
        `${this.testEndpoint}/${testId}/questions/${questionId}`
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) throw new Error(apiError.message || 'Removing question from test failed');
      throw new Error('Network Error occurred!');
    }
  },
};