import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FarmList, SearchBar } from '@/components/farm';
import { useFarmList } from '@/hooks/useFarmList';
import { FarmRow } from '@/services/dataService';
import { indexStyles } from '@/styles/indexStyles';

export default function HomeScreen() {
  const router = useRouter();
  const isFirstFocusRef = useRef(true);

  const {
    data,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    searchQuery,
    refresh,
    loadMore,
    search,
  } = useFarmList({
    pageSize: 10,
    debounceMs: 500,
  });

  // 页面聚焦时刷新数据（跳过首次聚焦，避免重复加载）
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocusRef.current) {
        isFirstFocusRef.current = false;
        return;
      }
      refresh();
    }, [refresh])
  );

  // 跳转到新增页面
  const handleAddNew = useCallback(() => {
    router.push('/add');
  }, [router]);

  // 跳转到详情页面
  const handleFarmPress = useCallback((farm: FarmRow) => {
    router.push({
      pathname: '/detail',
      params: { id: farm.id }
    });
  }, [router]);

  // 搜索提交
  const handleSearchSubmit = useCallback(() => {
    search(searchQuery);
  }, [search, searchQuery]);

  return (
    <SafeAreaView style={indexStyles.safeArea}>
      {/* 头部 */}
      <View style={indexStyles.header}>
        <Text style={indexStyles.headerTitle}>养殖场管理</Text>
      </View>

      {/* 搜索区域 */}
      <SearchBar
        value={searchQuery}
        onChangeText={search}
        onSubmit={handleSearchSubmit}
      />

      {/* 结果统计 */}
      <View style={indexStyles.resultsStats}>
        <Text style={indexStyles.resultsCount}>
          找到 <Text style={indexStyles.resultsCountStrong}>{data.length}</Text> 个相关结果
        </Text>
      </View>

      {/* 农场列表 */}
      <FarmList
        data={data}
        searchQuery={searchQuery}
        loading={loading}
        refreshing={refreshing}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onRefresh={refresh}
        onLoadMore={loadMore}
        onItemPress={handleFarmPress}
        onRetry={refresh}
      />

      {/* 新增按钮 */}
      <TouchableOpacity style={indexStyles.addButton} onPress={handleAddNew}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
