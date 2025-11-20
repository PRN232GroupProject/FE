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

// 1. Hook cho danh sách bài thi
export const useTestList = (filters?: ITestFilterParams) => {
  return useQuery({
    queryKey: [TEST_QUERY_KEY, 'list', filters],
    queryFn: async () => {
      const response = await testService.getAllTests(filters);
      return response.data.map(mapTestResponse);
    },
  });
};

// 2. Hook cho trang Kết quả (SỬA LOGIC AN TOÀN & TỰ CHẤM)
export const useTestResult = (sessionId: number) => {
  return useQuery<ITestResult>({
    queryKey: [RESULT_QUERY_KEY, 'detail', sessionId],
    queryFn: async () => {
      console.log("🚀 [FE] Bắt đầu lấy kết quả session:", sessionId);

      // 1. Gọi API lấy Session (Đáp án HS)
      const sessionRes = await resultService.getSessionAnswers(sessionId);
      const sessionData = sessionRes.data;
      
      if (!sessionData) throw new Error("Không lấy được dữ liệu bài làm");

      // 2. Gọi API lấy Đề thi (Câu hỏi gốc)
      const testRes = await testService.getTestById(sessionData.testId);
      const testData = testRes.data;

      // 3. Xử lý danh sách đáp án (Chống crash do lệch tên trường)
      // .NET thường trả về 'answers' (camelCase của Answers)
      const rawAnswers = (sessionData as any).answers || (sessionData as any).studentAnswers || [];

      // 4. Gộp và Tự chấm điểm
      let correctCount = 0;
      
      const questionsList = testData.questions || [];

      const mergedAnswers: ITestAnswerDetail[] = questionsList.map((question: IQuestionResponse) => {
        // Tìm đáp án HS chọn cho câu này
        const studentAns = rawAnswers.find((a: any) => a.questionId === question.id);
        
        // Lấy giá trị (xử lý an toàn)
        const selected = studentAns?.selectedAnswer || '';
        const correct = question.correctAnswer || '';
        
        // Logic chấm điểm FE (Bỏ qua hoa thường, khoảng trắng)
        const isCorrectFE = selected.trim().toLowerCase() === correct.trim().toLowerCase();
        
        if (isCorrectFE) correctCount++;

        return {
          questionId: question.id,
          content: question.content,
          options: question.options || {},
          selectedAnswer: selected,
          correctAnswer: correct,
          isCorrect: isCorrectFE, // Dùng kết quả FE tự tính
          explanation: question.explanation || '',
        };
      });

      // 5. Tính điểm thang 10
      const totalQ = questionsList.length;
      const finalScore = totalQ > 0 ? (correctCount / totalQ) * 10 : 0;

      console.log(`✅ [FE] Kết quả tính toán: ${correctCount}/${totalQ} đúng. Điểm: ${finalScore}`);

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
    enabled: !!sessionId, // Chỉ chạy khi có sessionId
    retry: 1,
  });
};

// 3. Hook lịch sử (Lấy từ User Profile như đã bàn)
export const useTestHistory = (userId: number) => {
  return useQuery({
    queryKey: ['testHistory', userId],
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      // Hàm này bạn đã có trong utils/historyUtils.ts
      return calculateTestHistory(response.data.studentTestSessions);
    },
    enabled: !!userId,
  });
};

// 4. Hook chi tiết (Giữ nguyên)
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