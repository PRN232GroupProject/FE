import axiosInstance from '../constant/axiosInstance';
import type { ApiResponse } from '../../types/api.types';
import type {
  IQuestion,
  ICreateQuestionRequest,
  IUpdateQuestionRequest,
  IQuestionFilterParams,
} from '../../types/question.types';

export const questionService = {
  questionEndpoint: '/questions',

  /**
   * Get all questions with optional filters
   * GET /api/questions?lessonId={lessonId}&difficulty={difficulty}
   */
  async getQuestions(params?: IQuestionFilterParams): Promise<ApiResponse<IQuestion[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IQuestion[]>>(
        this.questionEndpoint,
        { params }
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch questions');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Get a single question by ID
   * GET /api/questions/{id}
   */
  async getQuestionById(id: number): Promise<ApiResponse<IQuestion>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IQuestion>>(
        `${this.questionEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch question');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Create a new question
   * POST /api/questions
   */
  async createQuestion(data: ICreateQuestionRequest): Promise<ApiResponse<IQuestion>> {
    try {
      const response = await axiosInstance.post<ApiResponse<IQuestion>>(
        this.questionEndpoint,
        data
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to create question');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Update an existing question
   * PUT /api/questions/{id}
   */
  async updateQuestion(id: number, data: IUpdateQuestionRequest): Promise<ApiResponse<IQuestion>> {
    try {
      const response = await axiosInstance.put<ApiResponse<IQuestion>>(
        `${this.questionEndpoint}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to update question');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Delete a question
   * DELETE /api/questions/{id}
   */
  async deleteQuestion(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `${this.questionEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Failed to delete question');
      }
      throw new Error('Network Error occurred!');
    }
  },
};
