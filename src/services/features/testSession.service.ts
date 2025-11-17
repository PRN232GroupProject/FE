import type { ApiResponse } from '../../types/api.types';
import type {
  ICreateTestSessionRequest,
  ITestSessionResponse, // ⚠️ GIẢ ĐỊNH BE TRẢ VỀ CÁI NÀY KHI START
  IUpdateTestSessionRequest,
  ITestSessionResponseBasic,
  ISubmitAnswerRequest,
  IAnswerResponse,
  ICreateAnswerRequest,
} from '../../types/test.types';
import axiosInstance from '../constant/axiosInstance';

export const testSessionService = {
  sessionEndpoint: '/sessions',
  answerEndpoint: '/answers',

  /**
   * Bước 1: Bấm "Bắt đầu" (Tạo session)
   * Dùng TestSessionController -> POST /api/sessions
   */
  async startTestSession(
    request: ICreateTestSessionRequest
  ): Promise<ApiResponse<ITestSessionResponse>> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<ITestSessionResponse>
      >(this.sessionEndpoint, request);
      return response.data;
    } catch (error: any) {
      console.error('Start test session error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to start test session');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Bước 2: Lưu từng câu trả lời (Tạo answer)
   * Dùng AnswerController -> POST /api/answers
   */
  async submitAnswer(
    request: ISubmitAnswerRequest
  ): Promise<ApiResponse<IAnswerResponse>> {
    try {
      // Map từ ISubmitAnswerRequest (FE) sang ICreateAnswerRequest (BE)
      const payload: ICreateAnswerRequest = {
        sessionId: request.sessionId,
        questionId: request.questionId,
        selectedAnswer: request.selectedAnswer,
        isCorrect: false, // Backend sẽ tự tính toán
      };
      const response = await axiosInstance.post<ApiResponse<IAnswerResponse>>(
        this.answerEndpoint,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Submit answer error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to submit answer');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Bước 3: Nộp bài (Update session)
   * Dùng TestSessionController -> PUT /api/sessions/{id}
   */
  async submitTest(
    sessionId: number,
    request: Partial<IUpdateTestSessionRequest> // Gửi endTime, status: 'completed'
  ): Promise<ApiResponse<ITestSessionResponseBasic>> {
    try {
      const response = await axiosInstance.put<
        ApiResponse<ITestSessionResponseBasic>
      >(`${this.sessionEndpoint}/${sessionId}`, request);
      return response.data;
    } catch (error: any) {
      console.error('Submit test error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to submit test');
      }
      throw new Error('Network Error occurred!');
    }
  },
};