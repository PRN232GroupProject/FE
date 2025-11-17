import { useQuery } from '@tanstack/react-query';
import { resultService } from '../services/features/result.service';
import { testService } from '../services/features/test.service';
import {
  mapTestResultResponse,
  mapTestResponse,
} from '../utils/dataMappers';
import type { ITestFilterParams } from '../types/api.types';

// === Query Keys (Dùng để quản lý cache) ===
export const TEST_QUERY_KEY = 'tests';
export const RESULT_QUERY_KEY = 'results';

// === Hooks ===

/**
 * 1. Hook cho trang TestListPage.tsx
 * ⚠️ DÙNG SERVICE/ENDPOINT GIẢ ĐỊNH
 */
export const useTestList = (filters?: ITestFilterParams) => {
  return useQuery({
    queryKey: [TEST_QUERY_KEY, 'list', filters],
    queryFn: async () => {
      const response = await testService.getAllTests(filters);
      return response.data.map(mapTestResponse);
    },
  });
};

/**
 * 2. Hook cho trang TestResultPage.tsx
 * ⚠️ DÙNG SERVICE/ENDPOINT GIẢ ĐỊNH
 */
export const useTestResult = (sessionId: number) => {
  return useQuery({
    queryKey: [RESULT_QUERY_KEY, 'detail', sessionId],
    queryFn: async () => {
      const response = await resultService.getTestResult(sessionId);
      return mapTestResultResponse(response.data);
    },
    enabled: !!sessionId,
    staleTime: Infinity, // Kết quả thi không thay đổi
    gcTime: Infinity,
  });
};

/**
 * 3. Hook cho trang StudentResultsPage.tsx
 * ⚠️ DÙNG SERVICE/ENDPOINT GIẢ ĐỊNH
 */
export const useTestHistory = (userId: number) => {
  return useQuery({
    queryKey: [RESULT_QUERY_KEY, 'history', userId],
    queryFn: async () => {
      const response = await resultService.getTestHistory(userId);
      return response.data; // IStudentTestsResponse
    },
    enabled: !!userId,
  });
};

/**
 * 4. Hook cho trang StudentResultsPage.tsx (khi xem chi tiết 1 bài test)
 * Dùng endpoint bạn đã cung cấp
 */
export const useTestAttempts = (userId: number, testId: number) => {
  return useQuery({
    queryKey: [RESULT_QUERY_KEY, 'attempts', userId, testId],
    queryFn: async () => {
      const response = await resultService.getAttemptsForTest(userId, testId);
      return response.data; // ITestAttempt[]
    },
    enabled: !!userId && !!testId,
  });
};