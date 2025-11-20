import type { ApiResponse } from '../../types/api.types';
import type {
  IStudentTestSessionResponse,
  ITestAttempt,
} from '../../types/test.types';
import axiosInstance from '../constant/axiosInstance';

export const resultService = {
  sessionEndpoint: '/sessions',
  
  async getSessionAnswers(
    sessionId: number
  ): Promise<ApiResponse<IStudentTestSessionResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IStudentTestSessionResponse>>(
        `${this.sessionEndpoint}/${sessionId}/answers`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getAttemptsForTest(
    userId: number,
    testId: number
  ): Promise<ApiResponse<ITestAttempt[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ITestAttempt[]>>(
        `${this.sessionEndpoint}/user/${userId}/test/${testId}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};