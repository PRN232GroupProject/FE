// src/hooks/useTestSession.ts
import { useMutation } from '@tanstack/react-query';
import { testSessionService } from '../services/features/testSession.service';
import type {
  ICreateTestSessionRequest,
  ISubmitAnswerRequest,
  IUpdateTestSessionRequest,
} from '../types/test.types';
import { useNavigate } from 'react-router-dom';

/**
 * Hook cho trang TestListPage.tsx (Khi bấm "Bắt đầu")
 */
export const useStartTestSession = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: ICreateTestSessionRequest) =>
      testSessionService.startTestSession(request),
    onSuccess: (response) => {
      // Chuyển hướng đến trang làm bài với session ID
      const sessionId = response.data.sessionId;
      navigate(`/test/session/${sessionId}`);
    },
    onError: (error) => {
      console.error('Failed to start test:', error.message);
      // Hiện toast/alert lỗi
    },
  });
};

/**
 * Hook cho trang TestSessionPage.tsx (Khi chọn đáp án)
 * Gửi (lưu) TỪNG câu trả lời khi làm bài
 */
export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (request: ISubmitAnswerRequest) =>
      testSessionService.submitAnswer(request),
    onSuccess: (response) => {
      console.log('Answer saved:', response.data.id);
    },
    onError: (error) => {
      console.error('Failed to save answer:', error.message);
      // Có thể retry hoặc báo lỗi cho user
    },
  });
};

/**
 * Hook cho trang TestSessionPage.tsx (Khi bấm "Nộp bài")
 */
export const useSubmitTest = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: Partial<IUpdateTestSessionRequest>; // Gửi { endTime, status }
    }) => testSessionService.submitTest(sessionId, request),

    onSuccess: (_response, variables) => {
      const sessionId = variables.sessionId;
      // Chuyển hướng đến trang kết quả
      navigate(`/test/result/${sessionId}`);
    },
    onError: (error) => {
      console.error('Failed to submit test:', error.message);
    },
  });
};