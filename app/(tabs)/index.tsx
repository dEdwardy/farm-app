import { Ionicons } from '@expo/vector-icons';
import { Input } from '@rneui/base';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { dataService, FarmRow } from '@/services/dataService';
import { commonStyles } from '@/styles/commonStyles';
import { indexStyles } from '@/styles/indexStyles';

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<FarmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchData = async (query?: string | any) => {
    setLoading(true);
    setError(null);

    try {
      // 如果query是事件对象，使用searchQuery状态
      const searchTerm = typeof query === 'string' ? query : searchQuery;
      const response = await dataService.getFarms({ page, pageSize, searchQuery: searchTerm });

      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
        setTotalCount(response.totalCount);
      }
    } catch (e) {
      console.error('Fetch data error:', e);
      setError('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 当页面获得焦点时重新获取数据
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [page, pageSize])
  );

  // 只展示前5个字段：序号、养殖场名称、地址、经纬度、负责人、联系电话、创建时间、修改时间
  const headers = ['serial_number', 'farm_name', 'address', 'longitude_latitude', 'responsible_person', 'contact_phone', 'created_at', 'updated_at'];

  // 字段映射：英文key到中文label
  const fieldLabels: Record<string, string> = {
    // 序号
    serial_number: '序号',
    // 场所信息
    farm_name: '养殖场(业主)名称',
    address: '详细地址(精确到村社)',
    longitude_latitude: '经纬度',
    responsible_person: '负责人',
    contact_phone: '联系电话',
    created_at: '创建时间',
    updated_at: '修改时间',
    // 养殖情况
    pond_count: '池塘口数',
    water_area_acre: '养殖水面面积(亩)',
    farm_area_acre: '养殖场占地面积(亩)',
    other_water_area_sqm: '其它养殖水面面积(平方米)',
    other_farm_area_acre: '其它养殖占地面积(亩)',
    avg_water_depth: '平均水深(米)',
    main_species: '主养品种',
    farm_mode: '养殖模式',
    operation_status: '生产运行情况',
    output: '总产量（吨）',
    output_value: '年总产值（万元）',
    total_investment: '年总投入（万元）',
    // 尾水处理
    has_treatment_facility: '有无尾水处理设施',
    treatment_method: '尾水处理方式',
    treatment_facility_area: '尾水处理设施面积(亩)',
    treated_discharge_volume: '已完成尾水治理排放量(吨)',
    final_destination: '养殖尾水最终去向',
  };

  // 获取字段的中文label，如果没有映射则使用原key
  const getFieldLabel = (key: string) => fieldLabels[key] || key;

  // 电话脱敏函数：中间4位用*替换
  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  // 日期格式化函数：将ISO日期格式化为年月日时分秒
  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 状态管理：用于存储展开的电话号码
  const [expandedPhones, setExpandedPhones] = useState<Record<string, boolean>>({});

  // 切换电话展开/收起状态
  const togglePhoneExpansion = (rowIndex: number) => {
    setExpandedPhones(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  const handleSearch = () => {
    // 搜索时重置页码为1并执行搜索
    setPage(1);
    fetchData();
  };

  const handleAddNew = () => {
    router.push('/add');
  };

  return (
    <SafeAreaView style={indexStyles.safeArea}>
      <ScrollView contentContainerStyle={indexStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 头部标题区域 */}
        <View style={indexStyles.header}>
          <View>
            <Text style={indexStyles.heading}>养殖场数据管理</Text>
            <Text style={indexStyles.subtitle}>查看和管理养殖场信息</Text>
          </View>
          <TouchableOpacity 
            style={indexStyles.refreshButton} 
            onPress={fetchData}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={24} color="#1976d2" />
          </TouchableOpacity>
        </View>
        
        {/* 搜索区域 */}
        <View style={indexStyles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              // 防抖处理：500ms后执行搜索
              if (debounceTimer) {
                clearTimeout(debounceTimer);
              }
              const timer = setTimeout(() => {
                // 当搜索查询为空时，重置页码为1
                if (!text.trim()) {
                  setPage(1);
                }
                // 直接使用text参数，而不是searchQuery状态，确保使用最新的输入值
                fetchData(text);
              }, 500);
              setDebounceTimer(timer);
            }}
            placeholder="请输入关键词"
            containerStyle={indexStyles.searchInput}
            inputContainerStyle={indexStyles.searchInputContainer}
            leftIcon={
              <Ionicons name="search" size={20} color="#999" style={indexStyles.searchIcon} />
            }
          />
          <TouchableOpacity
            style={indexStyles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="search" size={18} color="white" style={{ marginRight: 8 }} />
              <Text style={indexStyles.searchButtonText}>搜索</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* 数据统计卡片 */}
        {!loading && !error && data.length > 0 && (
          <View style={commonStyles.statsCard}>
            <View style={commonStyles.statItem}>
              <Text style={commonStyles.statValue}>{totalCount}</Text>
              <Text style={commonStyles.statLabel}>总记录数</Text>
            </View>
            <View style={commonStyles.statDivider} />
            <View style={commonStyles.statItem}>
              <Text style={commonStyles.statValue}>{Math.ceil(totalCount / pageSize)}</Text>
              <Text style={commonStyles.statLabel}>总页数</Text>
            </View>
            <View style={commonStyles.statDivider} />
            <View style={commonStyles.statItem}>
              <Text style={commonStyles.statValue}>{pageSize}</Text>
              <Text style={commonStyles.statLabel}>每页显示</Text>
            </View>
          </View>
        )}
        
        {/* 数据加载状态 */}
        {loading && (
          <View style={commonStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={commonStyles.loadingText}>正在加载数据...</Text>
          </View>
        )}

        {/* 错误状态 */}
        {!loading && error && (
          <View style={commonStyles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
            <Text style={commonStyles.errorTitle}>加载失败</Text>
            <Text style={commonStyles.errorText}>{error}</Text>
            <TouchableOpacity
              style={commonStyles.primaryButton}
              onPress={fetchData}
              activeOpacity={0.7}
            >
              <Text style={commonStyles.buttonText}>重试</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 空数据状态 */}
        {!loading && !error && data.length === 0 && (
          <View style={commonStyles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#999" />
            <Text style={commonStyles.emptyTitle}>暂无数据</Text>
          </View>
        )}

        {/* 数据表格 */}
        {!loading && !error && data.length > 0 && (
          <View style={commonStyles.card}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={indexStyles.table}>
                {/* 表头 */}
                <View style={[indexStyles.row, indexStyles.headerRow]}>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.serialCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>序号</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.nameCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>养殖场名称</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.addressCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>详细地址</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.coordCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>经纬度</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.personCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>负责人</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.phoneCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>联系电话</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.dateCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>创建时间</Text>
                  </View>
                  <View style={[indexStyles.cell, indexStyles.headerCell, indexStyles.dateCell]}>
                    <Text style={[indexStyles.headerText, indexStyles.headerTextBold]}>修改时间</Text>
                  </View>
                </View>
                {/* 数据行 */}
                {data.map((row, rowIndex) => (
                  <View key={row.id || rowIndex} style={[indexStyles.row, rowIndex % 2 === 0 && indexStyles.evenRow]}>
                    {/* 序号 */}
                    <View style={[indexStyles.cell, indexStyles.serialCell]}>
                      <Text numberOfLines={2} style={indexStyles.cellText}>
                        {(page - 1) * pageSize + rowIndex + 1}
                      </Text>
                    </View>
                    {/* 养殖场名称 */}
                    <View style={[indexStyles.cell, indexStyles.nameCell]}>
                      <TouchableOpacity
                        onPress={() => {
                          const id = row.id || rowIndex.toString();
                          router.push(`/detail?id=${id}`);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text numberOfLines={2} style={[indexStyles.cellText, indexStyles.nameText, indexStyles.clickableText]}>
                          {row.farm_name !== null && row.farm_name !== undefined
                            ? String(row.farm_name)
                            : ''}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* 地址 */}
                    <View style={[indexStyles.cell, indexStyles.addressCell]}>
                      <Text numberOfLines={2} style={indexStyles.cellText}>
                        {row.address !== null && row.address !== undefined
                          ? String(row.address)
                          : ''}
                      </Text>
                    </View>
                    {/* 经纬度 */}
                    <View style={[indexStyles.cell, indexStyles.coordCell]}>
                      <Text numberOfLines={2} style={indexStyles.cellText}>
                        {row.longitude_latitude !== null && row.longitude_latitude !== undefined
                          ? String(row.longitude_latitude)
                          : ''}
                      </Text>
                    </View>
                    {/* 负责人 */}
                    <View style={[indexStyles.cell, indexStyles.personCell]}>
                      <Text numberOfLines={2} style={indexStyles.cellText}>
                        {row.responsible_person !== null && row.responsible_person !== undefined
                          ? String(row.responsible_person)
                          : ''}
                      </Text>
                    </View>
                    {/* 联系电话 */}
                    <View style={[indexStyles.cell, indexStyles.phoneCell]}>
                      {row.contact_phone !== null && row.contact_phone !== undefined && String(row.contact_phone).trim() !== '' ? (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            togglePhoneExpansion(rowIndex);
                          }}
                          activeOpacity={0.7}
                          style={indexStyles.phoneButton}
                        >
                          <Text numberOfLines={2} style={[indexStyles.cellText, indexStyles.phoneText]}>
                            {expandedPhones[rowIndex] 
                              ? String(row.contact_phone) 
                              : maskPhoneNumber(String(row.contact_phone))}
                          </Text>
                          <Ionicons 
                            name={expandedPhones[rowIndex] ? "eye-off" : "eye"} 
                            size={16} 
                            color="#1976d2" 
                            style={indexStyles.phoneIcon}
                          />
                        </TouchableOpacity>
                      ) : undefined}
                    </View>
                    {/* 创建时间 */}
                    <View style={[indexStyles.cell, indexStyles.dateCell]}>
                      <Text numberOfLines={2} style={indexStyles.cellText}>
                        {formatDateTime(row.created_at)}
                      </Text>
                    </View>
                    {/* 修改时间 */}
                    <View style={[indexStyles.cell, indexStyles.dateCell]}>
                      <Text numberOfLines={2} style={indexStyles.cellText}>
                        {formatDateTime(row.updated_at)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        
        {/* 分页控件 */}
        {!loading && !error && data.length > 0 && (
          <View style={commonStyles.paginationContainer}>
            <View style={commonStyles.paginationContent}>
              <TouchableOpacity
                style={[commonStyles.paginationButton, page === 1 && commonStyles.paginationButtonDisabled]}
                onPress={() => setPage(page - 1)}
                disabled={page === 1}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={16} 
                  color={page === 1 ? '#999' : '#1976d2'} 
                  style={{ marginRight: 4 }}
                />
                <Text style={[commonStyles.paginationButtonText, page === 1 && commonStyles.paginationButtonTextDisabled]}>
                  上一页
                </Text>
              </TouchableOpacity>
              
              <View style={commonStyles.paginationInfo}>
                <Text style={commonStyles.paginationInfoText}>
                  {page} / {Math.ceil(totalCount / pageSize)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[commonStyles.paginationButton, page >= Math.ceil(totalCount / pageSize) && commonStyles.paginationButtonDisabled]}
                onPress={() => setPage(page + 1)}
                disabled={page >= Math.ceil(totalCount / pageSize)}
                activeOpacity={0.7}
              >
                <Text style={[commonStyles.paginationButtonText, page >= Math.ceil(totalCount / pageSize) && commonStyles.paginationButtonTextDisabled]}>
                  下一页
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={page >= Math.ceil(totalCount / pageSize) ? '#999' : '#1976d2'} 
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={commonStyles.paginationTotal}>
              共 {totalCount} 条记录
            </Text>
          </View>
        )}
        
        {/* 圆形新增按钮 */}
        <TouchableOpacity
          style={commonStyles.fab}
          onPress={handleAddNew}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


