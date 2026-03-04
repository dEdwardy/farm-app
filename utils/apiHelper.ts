import { supabase, supabaseInitError } from '@/lib/supabase';

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  error?: string;
  success: boolean;
}

/**
 * 检查 Supabase 是否初始化
 */
export function checkSupabase(): { ok: true } | { ok: false; error: string } {
  if (!supabase) {
    return { ok: false, error: supabaseInitError ?? 'Supabase 未初始化' };
  }
  return { ok: true };
}

/**
 * 统一错误处理
 */
export function handleError(error: unknown, defaultMessage: string): string {
  console.error(defaultMessage, error);
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
}

/**
 * 创建成功的 API 响应
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data, success: true };
}

/**
 * 创建失败的 API 响应
 */
export function createErrorResponse<T>(error: string): ApiResponse<T> {
  return { data: null, error, success: false };
}

/**
 * 创建分页成功的响应
 */
export function createPaginatedSuccessResponse<T>(
  data: T[],
  totalCount: number
): PaginatedResponse<T> {
  return { data, totalCount, success: true };
}

/**
 * 创建分页失败的响应
 */
export function createPaginatedErrorResponse<T>(error: string): PaginatedResponse<T> {
  return { data: [], totalCount: 0, error, success: false };
}
