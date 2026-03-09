import { useEffect, useRef, useState, useCallback } from 'react';

import { dataService, FarmRow, PaginationParams } from '@/services/dataService';

interface UseFarmListOptions {
  pageSize?: number;
  debounceMs?: number;
}

interface UseFarmListReturn {
  data: FarmRow[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  search: (query: string) => Promise<void>;
}

export function useFarmList(options: UseFarmListOptions = {}): UseFarmListReturn {
  const { pageSize = 10, debounceMs = 500 } = options;

  const [data, setData] = useState<FarmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // 清理定时器
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  // 计算是否还有更多数据
  const hasMore = data.length < totalCount;

  // 获取数据的核心函数
  const fetchData = useCallback(async (
    params: PaginationParams & { isRefresh?: boolean; isLoadMore?: boolean }
  ) => {
    const { isRefresh, isLoadMore, ...paginationParams } = params;

    if (isRefresh) {
      setRefreshing(true);
    } else if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    if (!isLoadMore) {
      setError(null);
    }

    try {
      const response = await dataService.getFarms(paginationParams);

      if (!isMountedRef.current) return;

      if (response.error) {
        setError(response.error);
        return;
      }

      setTotalCount(response.totalCount);

      if (isRefresh || paginationParams.page === 1) {
        // 刷新或第一页：替换数据
        setData(response.data);
      } else if (isLoadMore) {
        // 加载更多：追加数据
        setData(prev => [...prev, ...response.data]);
      }
    } catch (_) {
      if (isMountedRef.current) {
        setError('获取数据失败，请稍后重试');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // 初始加载
  const loadInitial = useCallback(async () => {
    setPage(1);
    await fetchData({
      page: 1,
      pageSize,
      searchQuery: searchQuery.trim(),
    });
  }, [fetchData, pageSize, searchQuery]);

  // 下拉刷新
  const refresh = useCallback(async () => {
    setPage(1);
    await fetchData({
      page: 1,
      pageSize,
      searchQuery: searchQuery.trim(),
      isRefresh: true,
    });
  }, [fetchData, pageSize, searchQuery]);

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchData({
      page: nextPage,
      pageSize,
      searchQuery: searchQuery.trim(),
      isLoadMore: true,
    });
  }, [fetchData, pageSize, searchQuery, loadingMore, hasMore, page]);

  // 搜索（带防抖）
  const search = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setPage(1);
      await fetchData({
        page: 1,
        pageSize,
        searchQuery: query.trim(),
      });
    }, debounceMs);
  }, [debounceMs, pageSize, fetchData]);

  // 标记是否已经初始加载
  const hasInitialLoadedRef = useRef(false);

  // 初始加载 - 只在组件挂载且未加载过时执行
  useEffect(() => {
    if (!hasInitialLoadedRef.current) {
      hasInitialLoadedRef.current = true;
      loadInitial();
    }
  }, []); // 移除 loadInitial 依赖，因为只需要执行一次

  return {
    data,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    page,
    searchQuery,
    setSearchQuery,
    refresh,
    loadMore,
    search,
  };
}
