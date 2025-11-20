import type { ApiResponse } from '../../types/api.types';
import type {
  ICreateTestSessionRequest,
  ITestSessionData,
  IUpdateTestSessionRequest,
  ITestSessionResponseBasic,
  ICreateAnswerRequest,
  IAnswerResponse,
} from '../../types/test.types';
import axiosInstance from '../constant/axiosInstance';

export const testSessionService = {
  sessionEndpoint: '/sessions',
  answerEndpoint: '/answers',

  // 1. Tạo session
  async startTestSession(
    request: ICreateTestSessionRequest
  ): Promise<ITestSessionData> {
    try {
      const response = await axiosInstance.post<ApiResponse<ITestSessionData>>(
        this.sessionEndpoint,
        request
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Start session error:', error);
      throw error;
    }
  },

  // 2. Nộp từng câu
  async submitAnswer(
    request: ICreateAnswerRequest
  ): Promise<IAnswerResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<IAnswerResponse>>(
        this.answerEndpoint,
        request
      );
      return response.data.data;
    } catch (error: any) {
      // Không throw error ở đây để tránh làm gián đoạn Promise.all bên ngoài
      console.error('Submit answer error (Ignored):', error.message);
      throw error; 
    }
  },

  // 3. Nộp bài (Sửa lỗi 400 Bad Request tại đây)
  async submitTest(
    sessionId: number,
    request: Partial<IUpdateTestSessionRequest>
  ): Promise<ITestSessionResponseBasic> {
    try {
      // 🚀 QUAN TRỌNG: Chuyển đổi sang PascalCase để khớp với C# Back-end
      const payload = {
        Id: request.id,
        UserId: request.userId,
        TestId: request.testId,
        StartTime: request.startTime, // Đảm bảo là chuỗi ISO chuẩn
        EndTime: request.endTime,     // Đảm bảo là chuỗi ISO chuẩn
        Status: request.status,
        Score: request.score ?? 0     // Gửi 0 nếu null
      };

      const response = await axiosInstance.put<ApiResponse<ITestSessionResponseBasic>>(
        `${this.sessionEndpoint}/${sessionId}`,
        payload
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Submit test error:', error);
      throw error;
    }
  },
};