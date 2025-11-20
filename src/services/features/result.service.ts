import type { ApiResponse } from '../../types/api.types';
import type {
  IStudentTestSessionResponse,
  ITestAttempt,
} from '../../types/test.types';
import axiosInstance from '../constant/axiosInstance';

export const resultService = {
  sessionEndpoint: '/sessions',
  
  /**
   * ✅ Endpoint THẬT: GET /api/sessions/{id}/answers
   * Back-end: TestSessionController -> GetStudentAnswers(int id)
   * Trả về: StudentTestSessionResponse (chứa danh sách câu trả lời)
   */
  async getSessionAnswers(
    sessionId: number
  ): Promise<ApiResponse<IStudentTestSessionResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IStudentTestSessionResponse>>(
        `${this.sessionEndpoint}/${sessionId}/answers`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get session answers error:', error);
      throw error;
    }
  },

  /**
   * ✅ Endpoint THẬT: GET /api/sessions/user/{userId}/test/{testId}
   * Back-end: TestSessionController -> GetByUserAndTest
   * Trả về: Danh sách các lần làm bài
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
    } catch (error: any) {
      console.error('Get attempts for test error:', error);
      throw error;
    }
  }
};