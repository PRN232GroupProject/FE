// Question Types
export interface IQuestion {
  id: number;
  lessonId: number;
  content: string;
  options: Record<string, string>; // { "A": "Answer A", "B": "Answer B", ... }
  correctAnswer: string; // e.g., "A"
  explanation: string;
  difficulty: string;
}

export interface ICreateQuestionRequest {
  lessonId?: number;
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
}

export interface IUpdateQuestionRequest {
  id: number;
  lessonId?: number;
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
}

export interface IQuestionFilterParams {
  lessonId?: number;
  difficulty?: string;
}
