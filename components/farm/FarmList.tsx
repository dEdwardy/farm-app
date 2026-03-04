import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { FarmRow } from '@/services/dataService';
import { indexStyles } from '@/styles/indexStyles';

import { FarmCard } from './FarmCard';

interface FarmListProps {
  data: FarmRow[];
  searchQuery: string;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onItemPress: (farm: FarmRow) => void;
  onRetry: () => void;
}

// 列表底部加载更多组件
const ListFooter: React.FC<{
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}> = ({ loadingMore, hasMore, onLoadMore }) => {
  if (loadingMore) {
    return (
      <View style={indexStyles.loadMore}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <Text style={indexStyles.loadMoreText}>加载中...</Text>
      </View>
    );
  }

  if (hasMore) {
    return (
      <View style={indexStyles.loadMore}>
        <TouchableOpacity style={indexStyles.loadMoreButton} onPress={onLoadMore}>
          <Text style={indexStyles.loadMoreButtonText}>加载更多</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasMore && !loadingMore) {
    return (
      <View style={indexStyles.loadMore}>
        <Text style={indexStyles.noMoreText}>没有更多数据了</Text>
      </View>
    );
  }

  return null;
};

// 空状态组件
const EmptyState: React.FC = () => (
  <View style={indexStyles.emptyState}>
    <View style={indexStyles.emptyIcon}>
      <Text style={indexStyles.emptyIconText}>📋</Text>
    </View>
    <Text style={indexStyles.emptyText}>暂无养殖场数据</Text>
    <Text style={indexStyles.emptySubtext}>点击右下角按钮添加新养殖场</Text>
  </View>
);

// 错误状态组件
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <View style={indexStyles.errorContainer}>
    <Text style={indexStyles.errorIcon}>⚠️</Text>
    <Text style={indexStyles.errorTitle}>加载失败</Text>
    <Text style={indexStyles.errorText}>{error}</Text>
    <TouchableOpacity style={indexStyles.retryButton} onPress={onRetry}>
      <Text style={indexStyles.retryButtonText}>重新加载</Text>
    </TouchableOpacity>
  </View>
);

export const FarmList: React.FC<FarmListProps> = ({
  data,
  searchQuery,
  loading,
  refreshing,
  loadingMore,
  error,
  hasMore,
  onRefresh,
  onLoadMore,
  onItemPress,
  onRetry,
}) => {
  // 渲染列表项
  const renderItem: ListRenderItem<FarmRow> = useCallback(
    ({ item }) => (
      <FarmCard
        farm={item}
        searchQuery={searchQuery}
        onPress={onItemPress}
      />
    ),
    [searchQuery, onItemPress]
  );

  // 提取 key
  const keyExtractor = useCallback((item: FarmRow) => item.id?.toString() || '', []);

  // 渲染列表底部
  const renderFooter = useCallback(
    () => (
      <ListFooter
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />
    ),
    [loadingMore, hasMore, onLoadMore]
  );

  // 全屏加载中状态
  if (loading && !refreshing && data.length === 0) {
    return (
      <View style={indexStyles.loadingOverlay}>
        <View style={indexStyles.loadingContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={indexStyles.loadingText}>正在加载数据...</Text>
        </View>
      </View>
    );
  }

  // 错误状态
  if (error && !refreshing && data.length === 0) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={indexStyles.farmList}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4CAF50']}
          tintColor="#4CAF50"
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={EmptyState}
      // 虚拟列表优化
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      getItemLayout={(data, index) => ({
        length: 280, // 预估每个卡片的高度
        offset: 280 * index,
        index,
      })}
    />
  );
};
