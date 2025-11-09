// Dùng cho TestSessionPage
export interface ITestQuestion {
  id: number;
  content: string;
  options: Record<string, string>; // {"A": "HCl", "B": "NaOH"}
}

// Dùng cho TestResultPage
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
  sessionDetails: {
    id: number;
    testName: string;
    startTime: string;
    endTime: string;
  };
  answers: ITestAnswerDetail[];
}