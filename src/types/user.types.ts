export interface IUser {
  id: number;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
}