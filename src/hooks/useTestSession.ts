import { useMutation, useQuery } from '@tanstack/react-query';
import { testSessionService } from '../services/features/testSession.service';
import { testService } from '../services/features/test.service';
import type {
  ICreateTestSessionRequest,
  ICreateAnswerRequest,
  IUpdateTestSessionRequest,
  ITestResponse,
  ITestSessionData,
} from '../types/test.types';
import { useNavigate } from 'react-router-dom';

export const TEST_SESSION_KEY = 'testSession';

// 1. Lấy đề bài
export const useTestDetails = (testId: number) => {
  return useQuery<ITestResponse>({
    queryKey: [TEST_SESSION_KEY, 'details', testId],
    queryFn: async () => {
      const response = await testService.getTestById(testId);
      return response.data;
    },
    enabled: !!testId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Tạo session
export const useStartSession = () => {
  return useMutation<ITestSessionData, Error, ICreateTestSessionRequest>({
    mutationFn: async (request) => {
      const data = await testSessionService.startTestSession(request);
      return data;
    },
  });
};

// 3. Lưu câu trả lời
export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (request: ICreateAnswerRequest) =>
      testSessionService.submitAnswer(request),
  });
};

// 4. Nộp bài
export const useSubmitTest = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: IUpdateTestSessionRequest; // Xóa Partial, dùng Type đầy đủ
    }) => testSessionService.submitTest(sessionId, request),

    onSuccess: (_response, variables) => {
      navigate(`/test/result/${variables.sessionId}`); 
    },
  });
};