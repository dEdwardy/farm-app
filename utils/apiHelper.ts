import { getSupabase, supabaseInitError } from '@/lib/supabase';

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

export async function checkSupabase(): Promise<{ ok: true; client: NonNullable<Awaited<ReturnType<typeof getSupabase>>> } | { ok: false; error: string }> {
  const client = await getSupabase();
  if (!client) {
    return { ok: false, error: supabaseInitError ?? 'Supabase 未初始化' };
  }
  return { ok: true, client };
}

export function handleError(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data, success: true };
}

export function createErrorResponse<T>(error: string): ApiResponse<T> {
  return { data: null, error, success: false };
}

export function createPaginatedSuccessResponse<T>(
  data: T[],
  totalCount: number
): PaginatedResponse<T> {
  return { data, totalCount, success: true };
}

export function createPaginatedErrorResponse<T>(error: string): PaginatedResponse<T> {
  return { data: [], totalCount: 0, error, success: false };
}
