export interface IUser {
  id: number;
  role: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  studentTestSessions?: IUserTestSession[];
}

export interface IUpdateProfileRequest {
  fullName: string;
  email: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUserTestSession {
  id: number;
  testId: number;
  score?: number;
  status: string;
  startTime: string;
  endTime?: string;
}