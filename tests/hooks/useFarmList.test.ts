// 定义 __DEV__ 变量，模拟 React Native 环境
(global as any).__DEV__ = true;

// 模拟 AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(null),
  multiRemove: jest.fn().mockResolvedValue(null),
}));

// 模拟 supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    })),
  },
}));

import { renderHook } from '@testing-library/react-native';
import { useFarmList } from '@/hooks/useFarmList';

// 模拟 console.error
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('useFarmList 死循环修复验证', () => {
  test('修复验证：搜索函数引用稳定', async () => {
    const { result, rerender } = renderHook(() => useFarmList());

    // 保存初始 search 函数的引用
    const initialSearchRef = result.current.search;

    // 重新渲染组件
    rerender();

    // 检查 search 函数的引用是否稳定（修复后应该相同）
    const newSearchRef = result.current.search;
    expect(initialSearchRef).toBe(newSearchRef);
    
    // 这表明搜索函数的引用是稳定的，不会导致死循环
  });

  test('修复验证：所有函数引用都稳定', async () => {
    const { result, rerender } = renderHook(() => useFarmList());

    // 保存初始函数引用
    const initialRefreshRef = result.current.refresh;
    const initialLoadMoreRef = result.current.loadMore;
    const initialSearchRef = result.current.search;

    // 重新渲染组件
    rerender();

    // 检查所有函数引用是否稳定
    expect(result.current.refresh).toBe(initialRefreshRef);
    expect(result.current.loadMore).toBe(initialLoadMoreRef);
    expect(result.current.search).toBe(initialSearchRef);
    
    // 这表明所有函数引用都是稳定的，不会导致死循环
  });
});
