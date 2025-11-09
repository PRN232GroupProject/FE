// Cấu trúc response chuẩn
export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}