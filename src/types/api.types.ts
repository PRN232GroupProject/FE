export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

// Alternative response structure (nếu backend dùng)
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// ============================================
// PAGINATION
// ============================================
export interface IPaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// ERROR HANDLING
// ============================================
export interface IApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

// ============================================
// FILTER & QUERY PARAMS
// ============================================
export interface ITestFilterParams {
  grade?: number;
  type?: string;
  difficulty?: string;
  search?: string;
}

export interface IChapterFilterParams {
  grade?: number;
}