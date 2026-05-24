export interface ApiResponse<T> {
  success: boolean;
  
  data: T;
  message?: string;
  totalPages?: number;   
  totalCount?: number;   
}
