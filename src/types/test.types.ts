// ============================================
// TEST TYPES
// Mapped from Backend DTOs
// ============================================

// ============================================
// QUESTION
// ============================================
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

// Create Test Session Request
export interface ICreateTestSessionRequest {
  userId: number;
  testId: number;
  startTime: string;
  endTime?: string;
  score?: number;
  status: 'in_progress' | 'completed';
}

// Update Test Session Request
export interface IUpdateTestSessionRequest {
  id: number;
  userId: number;
  testId: number;
  startTime: string;
  endTime?: string;
  score?: number;
  status: 'in_progress' | 'completed';
}

// Test Session Response (Basic)
export interface ITestSessionResponseBasic {
  id: number;
  userId: number;
  testId: number;
  startTime: string;
  endTime?: string;
  score?: number;
  status: 'in_progress' | 'completed';
}

// Student Test Session Response (with answers)
export interface IStudentTestSessionResponse {
  sessionId: number;
  testId: number;
  score?: number;
  status: string;
  startTime: string;
  endTime?: string;
  answers: IStudentAnswerResponse[];
}

// Start Test (Frontend)
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
// ANSWERS
// ============================================

// Student Answer Response
export interface IStudentAnswerResponse {
  questionId: number;
  selectedAnswer?: string;
  isCorrect: boolean;
}

// Answer Response
export interface IAnswerResponse {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer?: string;
  isCorrect: boolean;
}

// Create Answer Request
export interface ICreateAnswerRequest {
  sessionId: number;
  questionId: number;
  selectedAnswer?: string;
  isCorrect: boolean;
}

// Update Answer Request
export interface IUpdateAnswerRequest {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer?: string;
  isCorrect: boolean;
}

// ============================================
// QUESTION EXPLANATION
// ============================================
export interface IQuestionExplanationResponse {
  questionId: number;
  explanationHtml?: string;
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