// ============================================
// AUTH REQUEST/RESPONSE TYPES
// Mapping từ backend DTOs
// ============================================

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  role: string;
}

export interface IRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string; // Frontend only - validation
}

// Payload gửi lên backend (không có confirmPassword)
export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
}