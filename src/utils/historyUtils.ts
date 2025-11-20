import type { IUserTestSession } from '../types/user.types';
import type { IStudentTestsResponse, ITestAttempt } from '../types/test.types';

export const calculateTestHistory = (
  sessions: IUserTestSession[] = []
): IStudentTestsResponse => {
  // 1. Lọc các bài đã hoàn thành
  const completedSessions = sessions.filter(
    (s) => s.status === 'completed'
  );

  // 2. Sắp xếp: Mới nhất lên đầu
  completedSessions.sort((a, b) => {
    const timeA = a.endTime ? new Date(a.endTime).getTime() : 0;
    const timeB = b.endTime ? new Date(b.endTime).getTime() : 0;
    return timeB - timeA;
  });

  // 3. Group by TestId và chỉ lấy bài đầu tiên (Mới nhất)
  const latestAttemptsMap = new Map<number, IUserTestSession>();
  
  completedSessions.forEach((session) => {
    // Nếu chưa có bài làm nào của TestId này -> Thêm vào map
    if (!latestAttemptsMap.has(session.testId)) {
      latestAttemptsMap.set(session.testId, session);
    }
  });

  const latestSessions = Array.from(latestAttemptsMap.values());

  // 4. Tính toán thống kê trên danh sách "Mới nhất"
  const totalTests = latestSessions.length;
  
  // Lọc ra các bài có điểm số hợp lệ để tính trung bình
  const sessionsWithScore = latestSessions.filter(s => typeof s.score === 'number');
  
  const totalScore = sessionsWithScore.reduce((acc, s) => acc + (s.score || 0), 0);
  const averageScore = sessionsWithScore.length > 0 ? totalScore / sessionsWithScore.length : 0;
  
  const highestScore =
    sessionsWithScore.length > 0
      ? Math.max(...sessionsWithScore.map((s) => s.score || 0))
      : 0;

  // 5. Map sang ITestAttempt
  // Lưu ý: testName sẽ được điền ở Page component thông qua việc merge với useTestList
  const completedTests: ITestAttempt[] = latestSessions.map((s) => ({
    sessionId: s.id,
    testId: s.testId,
    testName: '', // Sẽ điền sau
    date: s.endTime || s.startTime,
    score: s.score || 0,
    totalCorrect: 0, 
    totalQuestions: 0, 
  }));

  return {
    totalTests,
    averageScore,
    highestScore,
    completedTests,
  };
};