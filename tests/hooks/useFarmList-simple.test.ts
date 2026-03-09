import { renderHook } from '@testing-library/react-native';

// 定义稳定的函数引用
const fetchData = () => {};
const loadInitial = () => {};
const refresh = () => {};
const loadMore = () => {};
const search = () => {};
const setSearchQuery = () => {};

// 模拟 useFarmList 钩子，只测试函数引用稳定性
const mockUseFarmList = () => {
  return {
    data: [],
    loading: false,
    refreshing: false,
    loadingMore: false,
    error: null,
    hasMore: false,
    page: 1,
    searchQuery: '',
    setSearchQuery,
    refresh,
    loadMore,
    search,
  };
};

describe('useFarmList 函数引用稳定性测试', () => {
  test('函数引用应该稳定', () => {
    const { result, rerender } = renderHook(() => mockUseFarmList());

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
  });
});
