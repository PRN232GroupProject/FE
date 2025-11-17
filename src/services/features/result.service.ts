// src/services/features/result.service.ts
// ⚠️ DỊCH VỤ NÀY ĐANG DÙNG ENDPOINT GIẢ ĐỊNH
import type { ApiResponse } from '../../types/api.types';
import type {
  ITestResultResponse,
  IStudentTestsResponse,
  ITestAttempt, // Import type này
} from '../../types/test.types';
import axiosInstance from '../constant/axiosInstance';

export const resultService = {
  sessionEndpoint: '/sessions',
  
  /**
   * ⚠️ GIẢ ĐỊNH: Lấy kết quả chi tiết cho TestResultPage.tsx
   */
  async getTestResult(
    sessionId: number
  ): Promise<ApiResponse<ITestResultResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ITestResultResponse>>(
        `${this.sessionEndpoint}/${sessionId}/result` // ⚠️ GIẢ ĐỊNH
      );
      return response.data;
    } catch (error: any) {
      console.error('Get test result error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch test result');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * ⚠️ GIẢ ĐỊNH: Lấy lịch sử tất cả bài test cho StudentResultsPage.tsx
   * (Endpoint bạn gửi /user/{userId}/test/{testId} chỉ lấy cho 1 test)
   * (Giả định endpoint này lấy TẤT CẢ)
   */
  async getTestHistory(
    userId: number
  ): Promise<ApiResponse<IStudentTestsResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IStudentTestsResponse>>(
        `${this.sessionEndpoint}/user/${userId}/history` // ⚠️ GIẢ ĐỊNH
      );
      return response.data;
    } catch (error: any) {
      console.error('Get test history error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch test history');
      }
      throw new Error('Network Error occurred!');
    }
  },
  
  /**
   * Dùng endpoint bạn đã cung cấp (GET /api/sessions/user/{userId}/test/{testId})
   * Lấy lịch sử làm bài cho 1 user VÀ 1 test cụ thể
   */
  async getAttemptsForTest(
    userId: number,
    testId: number
  ): Promise<ApiResponse<ITestAttempt[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ITestAttempt[]>>(
        `${this.sessionEndpoint}/user/${userId}/test/${testId}`
      );
      return response.data;
    } catch (error: any)
    {
      console.error('Get attempts for test error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch test attempts');
      }
      throw new Error('Network Error occurred!');
    }
  }
};