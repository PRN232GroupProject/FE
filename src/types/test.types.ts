export interface IQuestionResponse {
  id: number;
  lessonId?: number;
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

export interface ITestQuestion {
  id: number;
  content: string;
  options: Record<string, string>;
}

export interface ITest {
  id: number;
  name: string;
  type: string;
  duration: number;
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

export interface ICreateTestSessionRequest {
  userId: number;
  testId: number;
  startTime: string;
  status: string; 
}

export interface IUpdateTestSessionRequest {
  id: number;
  userId: number;
  testId: number;
  startTime: string;
  endTime: string;
  status: string; 
  score: number;
}

export interface ITestSessionResponseBasic {
  id: number;
  userId: number;
  testId: number;
  startTime: string;
  endTime?: string;
  score?: number;
  status: 'in_progress' | 'completed';
}

export interface IStudentTestSessionResponse {
  sessionId: number;
  testId: number;
  score?: number;
  status: string;
  startTime: string;
  endTime?: string;
  answers: IStudentAnswerResponse[];
}

export interface IStartTestRequest {
  testId: number;
}

export interface ITestSessionResponse {
  sessionId: number;
  testId: number;
  score?: number;
  status: string;
  startTime: string;
  endTime?: string;
  answers: IStudentAnswerResponse[];
}

export interface ISubmitAnswerRequest {
  sessionId: number;
  questionId: number;
  selectedAnswer: string;
}

export interface ISubmitTestRequest {
  sessionId: number;
}

export interface IStudentAnswerResponse {
  questionId: number;
  selectedAnswer?: string;
  isCorrect: boolean;
}

export interface IAnswerResponse {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface ICreateAnswerRequest {
  sessionId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean; 
}

export interface IUpdateAnswerRequest {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer?: string;
  isCorrect: boolean;
}

export interface IQuestionExplanationResponse {
  questionId: number;
  explanationHtml?: string;
}

export interface ITestAnswerDetail {
  questionId: number;
  content: string;
  options: Record<string, string>;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ITestResult {
  score: number;
  totalCorrect: number;
  testId: number;
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

export interface ITestSessionData {
  id: number; 
  userId: number;
  testId: number;
  startTime: string;
  endTime?: string;
  score?: number;
  status: string;
}

// REQUEST DTOs
export interface ICreateTestRequest {
  name: string;
  description?: string;
  type: string;
  durationMinutes: number;
}

export interface IUpdateTestRequest {
  id: number;
  name: string;
  description?: string;
  type: string;
  durationMinutes: number;
}

export interface IAddQuestionsToTestRequest {
  questionIds: number[];
}

export interface ICreateQuestionRequest {
  lessonId?: number | null;
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
}

export interface IUpdateQuestionRequest {
  id: number;
  lessonId?: number | null;
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
}

export interface IQuestionResponseDto {
  id: number;
  lessonId?: number;
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

export interface ITestResponseDto {
  id: number;
  name: string;
  description: string;
  type: string;
  durationMinutes: number;
  createdAt: string;
  createdBy: number;
  totalQuestions: number; 
  questions: IQuestionResponse[];
}

// Alias để các file cũ không bị lỗi
export type ITestResponse = ITestResponseDto;