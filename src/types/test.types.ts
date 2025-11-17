export interface IQuestionResponse {
  id: number;
  lessonId?: number;
  content: string;
  options: Record<string, string>; // { "A": "Đáp án A", "B": "Đáp án B" }
  correctAnswer: string;
  explanation: string; // HTML
  difficulty: string; // 'easy' | 'medium' | 'hard'
}

export interface ITestQuestion {
  id: number;
  content: string;
  options: Record<string, string>;
  // Note: correctAnswer và explanation chỉ có ở kết quả, không trả về khi làm bài
}

// ============================================
// TEST
// ============================================
export interface ITest {
  id: number;
  name: string;
  type: string; // 'Sau bài học' | '15 phút' | '1 tiết' | 'Học kỳ' | 'Tốt nghiệp' | 'Đại học'
  duration: number; // minutes
  totalQuestions: number;
  chapterId?: number;
  chapterName?: string;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
  lastAttempt?: {
    score: number;
    date: string;
    completed: boolean;
  };
}

// ============================================
// TEST SESSION (Làm bài)
// ============================================
export interface IStartTestRequest {
  testId: number;
}

export interface ITestSessionResponse {
  sessionId: number;
  testId: number;
  studentId: number;
  startTime: string;
  endTime?: string;
  questions: ITestQuestion[]; // Danh sách câu hỏi của bài test
  duration: number; // minutes
}

export interface ISubmitAnswerRequest {
  sessionId: number;
  questionId: number;
  selectedAnswer: string; // "A" | "B" | "C" | "D"
}

export interface ISubmitTestRequest {
  sessionId: number;
}

// ============================================
// TEST RESULT (Kết quả)
// ============================================
export interface ITestAnswerDetail {
  questionId: number;
  content: string;
  options: Record<string, string>;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string; // HTML
}

export interface ITestResult {
  score: number;
  totalCorrect: number;
  sessionDetails: {
    id: number;
    testName: string;
    startTime: string;
    endTime: string;
  };
  answers: ITestAnswerDetail[];
}

export interface ITestResultResponse {
  sessionId: number;
  testId: number;
  testName: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  startTime: string;
  endTime: string;
  answers: ITestAnswerDetail[];
}

// ============================================
// STUDENT TEST HISTORY
// ============================================
export interface ITestAttempt {
  sessionId: number;
  testId: number;
  testName: string;
  date: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
}

export interface IStudentTestsResponse {
  completedTests: ITestAttempt[];
  totalTests: number;
  averageScore: number;
  highestScore: number;
}