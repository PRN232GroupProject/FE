import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/features/user.service';
import { testService } from '../services/features/test.service';
import { resultService } from '../services/features/result.service';
import { mapTestResponse } from '../utils/dataMappers';
import type { ITestFilterParams } from '../types/api.types';
import type { ITestResult, ITestAnswerDetail, IQuestionResponse } from '../types/test.types';
import { calculateTestHistory } from '../utils/historyUtils';

export const TEST_QUERY_KEY = 'tests';
export const RESULT_QUERY_KEY = 'results';

export const useTestList = (filters?: ITestFilterParams) => {
  return useQuery({
    queryKey: [TEST_QUERY_KEY, 'list', filters],
    queryFn: async () => {
      const response = await testService.getAllTests(filters);
      return response.data.map(mapTestResponse);
    },
  });
};

export const useTestResult = (sessionId: number) => {
  return useQuery<ITestResult>({
    queryKey: [RESULT_QUERY_KEY, 'detail', sessionId],
    queryFn: async () => {
      const sessionRes = await resultService.getSessionAnswers(sessionId);
      const sessionData = sessionRes.data;
      
      if (!sessionData) throw new Error("No session data found");

      const testRes = await testService.getTestById(sessionData.testId);
      const testData = testRes.data;

      const rawSession = sessionData as any;
      const rawAnswers = rawSession.answers || rawSession.Answers || rawSession.studentAnswers || rawSession.StudentAnswers || [];

      let correctCount = 0;
      const questionsList = testData.questions || [];

      const mergedAnswers: ITestAnswerDetail[] = questionsList.map((question: IQuestionResponse) => {
        const studentAns = rawAnswers.find((a: any) => {
            const aId = a.questionId || a.QuestionId;
            const qId = question.id || (question as any).Id;
            return Number(aId) === Number(qId);
        });

        const selected = String(studentAns?.selectedAnswer || studentAns?.SelectedAnswer || '').trim();
        const correct = String(question.correctAnswer || (question as any).CorrectAnswer || '').trim();
        
        const isCorrectFE = selected.toLowerCase() === correct.toLowerCase() && selected !== '';
        
        if (isCorrectFE) {
          correctCount++;
        }

        return {
          questionId: question.id,
          content: question.content,
          options: question.options || {},
          selectedAnswer: selected,
          correctAnswer: correct,
          isCorrect: isCorrectFE,
          explanation: question.explanation || '',
        };
      });

      const totalQ = questionsList.length;
      const finalScore = totalQ > 0 ? (correctCount / totalQ) * 10 : 0;

      return {
        testId: sessionData.testId,
        score: finalScore,
        totalCorrect: correctCount,
        sessionDetails: {
          id: sessionData.sessionId,
          testName: testData.name,
          startTime: sessionData.startTime,
          endTime: sessionData.endTime || '',
        },
        answers: mergedAnswers,
      };
    },
    enabled: !!sessionId,
    staleTime: Infinity,
    retry: false,
  });
};

export const useTestHistory = (userId: number) => {
  return useQuery({
    queryKey: ['testHistory', userId],
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      return calculateTestHistory(response.data.studentTestSessions);
    },
    enabled: !!userId,
  });
};

export const useTestAttempts = (userId: number, testId: number) => {
  return useQuery({
    queryKey: [RESULT_QUERY_KEY, 'attempts', userId, testId],
    queryFn: async () => {
      const response = await resultService.getAttemptsForTest(userId, testId);
      return response.data;
    },
    enabled: !!userId && !!testId,
  });
};