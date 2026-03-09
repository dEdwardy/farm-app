import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { HighlightText } from '@/components/common/HighlightText';
import { FarmRow } from '@/services/dataService';
import { indexStyles } from '@/styles/indexStyles';
import { formatPhone } from '@/utils/format';

interface FarmCardProps {
  farm: FarmRow;
  searchQuery: string;
  onPress: (farm: FarmRow) => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm, searchQuery, onPress }) => {
  const handlePress = () => {
    onPress(farm);
  };

  const infoItems = [
    { label: '负责人', value: farm.responsible_person || '-' },
    { label: '电话', value: formatPhone(farm.contact_phone) },
    { label: '池塘口数', value: farm.pond_count ? `${farm.pond_count}口` : '-' },
    { label: '水面面积', value: farm.water_area_acre ? `${farm.water_area_acre}亩` : '-' },
    { label: '主养品种', value: farm.main_species || '-' },
    { label: '养殖模式', value: farm.farm_mode || '-' },
  ];

  return (
    <TouchableOpacity
      style={indexStyles.farmCard}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* 卡片头部 - 名称和类型 */}
      <View style={indexStyles.cardHeader}>
        <Text style={indexStyles.farmName} numberOfLines={1}>
          <HighlightText text={farm.farm_name} keyword={searchQuery} />
        </Text>
        {farm.farm_mode && (
          <View style={indexStyles.farmTypeBadge}>
            <Text style={indexStyles.farmTypeBadgeText}>
              {farm.farm_mode}
            </Text>
          </View>
        )}
      </View>

      {/* 地址 */}
      <View style={indexStyles.farmAddress}>
        <Text style={indexStyles.addressIcon}>📍</Text>
        <Text style={indexStyles.farmAddressText} numberOfLines={1}>
          <HighlightText text={farm.address} keyword={searchQuery} />
        </Text>
      </View>

      {/* 分隔线 */}
      <View style={indexStyles.divider} />

      {/* 信息网格 - 两列布局 */}
      <View style={indexStyles.infoGrid}>
        {infoItems.map((item, index) => (
          <View key={index} style={indexStyles.infoGridItem}>
            <View style={indexStyles.infoGridContent}>
              <Text style={indexStyles.infoGridLabel}>{item.label}</Text>
              <Text style={indexStyles.infoGridValue} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 底部状态栏 */}
      <View style={indexStyles.cardFooter}>
        <View style={[
          indexStyles.statusBadge,
          farm.operation_status === '在养' ? indexStyles.statusBadgeActive : indexStyles.statusBadgeInactive
        ]}>
          <Text style={[
            indexStyles.statusBadgeText,
            farm.operation_status === '在养' ? indexStyles.statusBadgeTextActive : indexStyles.statusBadgeTextInactive
          ]}>
            {farm.operation_status || '状态未知'}
          </Text>
        </View>
        <Text style={indexStyles.arrowIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );
};