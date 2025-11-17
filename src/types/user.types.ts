export interface IUser {
  id: number;
  role: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
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