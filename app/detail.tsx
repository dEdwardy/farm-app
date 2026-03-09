import { dataService } from '@/services/dataService';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ImageGridDisplay, ImagePreview, NoData } from '@/components/common';
import { FileDownloader } from '@/components/upload/FileDownloader';
import { formatDisplayValue, formatValueWithUnit } from '@/utils/format';
import { toast } from '@/utils/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { createFormStyles } from '../styles/formStyles';
import type { FarmRow } from '../types/farm';
import type { FarmFormData } from '../types/schemas';

interface FarmImageData {
  id?: string;
  url: string;
  name: string;
  type?: string;
  size?: number;
}



// 将图片/文件数据转换为 FormData 格式
const mapImageData = (
  images: (FarmImageData | string)[] | undefined
): { url: string; name: string; size: number }[] => {
  if (!Array.isArray(images)) return [];
  
  return images.map((item) => {
    if (typeof item === 'string') {
      return { url: item, name: item.split('/').pop() || '', size: 0 };
    }
    return { url: item.url, name: item.name, size: item.size || 0 };
  });
};



// 将表单数据转换为提交格式
const mapFormData = (farmData: FarmRow): FarmFormData => {
  return {
    farm_name: String(farmData.farm_name ?? ''),
    address: String(farmData.address ?? ''),
    longitude_latitude: String(farmData.longitude_latitude ?? ''),
    responsible_person: String(farmData.responsible_person ?? ''),
    contact_phone: String(farmData.contact_phone ?? ''),
    pond_count: String(farmData.pond_count ?? ''),
    water_area_acre: String(farmData.water_area_acre ?? ''),
    farm_area_acre: String(farmData.farm_area_acre ?? ''),
    other_water_area_sqm: String(farmData.other_water_area_sqm ?? ''),
    other_farm_area_acre: String(farmData.other_farm_area_acre ?? ''),
    avg_water_depth: String(farmData.avg_water_depth ?? ''),
    main_species: String(farmData.main_species ?? ''),
    farm_mode: String(farmData.farm_mode ?? ''),
    operation_status: String(farmData.operation_status ?? ''),
    output: String(farmData.output ?? ''),
    output_value: String(farmData.output_value ?? ''),
    total_investment: String(farmData.total_investment ?? ''),
    farm_images: mapImageData(farmData.farm_images),
    has_treatment_facility: Boolean(farmData.has_treatment_facility ?? false),
    treatment_method: String(farmData.treatment_method ?? ''),
    treatment_facility_area: String(farmData.treatment_facility_area ?? ''),
    treated_discharge_volume: String(farmData.treated_discharge_volume ?? ''),
    final_destination: String(farmData.final_destination ?? ''),
    tail_water_images: mapImageData(farmData.tail_water_images),
    safety_info: mapImageData(farmData.safety_info),
  };
};



export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const styles = createFormStyles(theme);

  const [formData, setFormData] = useState<FarmFormData>({
    farm_name: '',
    address: '',
    longitude_latitude: '',
    responsible_person: '',
    contact_phone: '',
    pond_count: '',
    water_area_acre: '',
    farm_area_acre: '',
    other_water_area_sqm: '',
    other_farm_area_acre: '',
    avg_water_depth: '',
    main_species: '',
    farm_mode: '',
    operation_status: '',
    output: '',
    output_value: '',
    total_investment: '',
    farm_images: [],
    has_treatment_facility: false,
    treatment_method: '',
    treatment_facility_area: '',
    treated_discharge_volume: '',
    final_destination: '',
    tail_water_images: [],
    safety_info: [],
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ url: string; name?: string }[]>([]);
  const [previewInitialIndex, setPreviewInitialIndex] = useState(0);

  const openImagePreview = useCallback((images: { url: string; name?: string }[], index: number) => {
    setPreviewImages(images);
    setPreviewInitialIndex(index);
    setImagePreviewVisible(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setImagePreviewVisible(false);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      const farmData = await dataService.getFarmById(id);
      if (!farmData) {
        setErrors({ global: '获取数据失败，未找到该记录' });
        return;
      }

      // 将获取的数据设置到formData
      setFormData(mapFormData(farmData));
    } catch {
      setErrors({ global: '获取数据失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 场所信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>场所信息</Text>
          <Text style={styles.farmName}>{formData.farm_name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>详细地址</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.address)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>经纬度</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.longitude_latitude)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>负责人</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.responsible_person)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>联系电话</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.contact_phone)}</Text>
          </View>
        </View>

        {/* 养殖信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>养殖信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>池塘口数</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.pond_count)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖水面面积</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.water_area_acre, '亩')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖占地面积</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.farm_area_acre, '亩')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>其他养殖水面面积</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.other_water_area_sqm, '平方米')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>其他养殖占地面积</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.other_farm_area_acre, '亩')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>平均水深</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.avg_water_depth, '米')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>主养品种</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.main_species)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖模式</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.farm_mode)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>生产运行情况</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.operation_status)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>总产量</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.output, '吨')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年总产值</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.output_value, '万元')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年总投入</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.total_investment, '万元')}</Text>
          </View>
          <View style={styles.infoRowHorizontal}>
            <Text style={styles.infoLabelHorizontal}>养殖情况图片</Text>
            <ImageGridDisplay
              images={formData.farm_images ?? []}
              onImagePress={openImagePreview}
            />
          </View>
        </View>

        {/* 尾水处理 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>尾水处理</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>有无尾水处理设施</Text>
            <Text style={styles.infoValue}>{formData.has_treatment_facility ? '有' : '无'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>尾水处理方式</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.treatment_method)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>尾水处理设施面积</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.treatment_facility_area, '亩')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>已完成尾水治理排放量</Text>
            <Text style={styles.infoValue}>{formatValueWithUnit(formData.treated_discharge_volume, '吨')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖尾水最终去向</Text>
            <Text style={styles.infoValue}>{formatDisplayValue(formData.final_destination)}</Text>
          </View>
          <View style={styles.infoRowHorizontal}>
            <Text style={styles.infoLabelHorizontal}>尾水处理图片</Text>
            <ImageGridDisplay
              images={formData.tail_water_images ?? []}
              onImagePress={openImagePreview}
            />
          </View>
        </View>

        {/* 安全信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>安全信息</Text>
          <View style={styles.infoRowHorizontal}>
            <Text style={styles.infoLabelHorizontal}>安全信息文件</Text>
            <View style={styles.fileList}>
              {formData.safety_info && formData.safety_info.length > 0 ? (
                formData.safety_info.map((file) => (
                  <View key={file.url} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={2} ellipsizeMode="tail">{file.name}</Text>
                      <Text style={styles.fileSize}>{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '未知大小'}</Text>
                    </View>
                    <FileDownloader
                      fileUrl={file.url}
                      fileName={file.name}
                      fileSize={file.size}
                    />
                  </View>
                ))
              ) : (
                <View style={styles.fileListEmpty}>
                  <NoData text="暂无数据" style={{ backgroundColor: 'transparent' }} />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 全局错误提示 */}
        {errors.global && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.global}</Text>
          </View>
        )}


      </ScrollView>

      {/* 底部操作按钮 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push(`/edit?id=${id}`)}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setShowDeleteDialog(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>删除</Text>
        </TouchableOpacity>
      </View>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="确认删除"
        message="确定要删除这个养殖场信息吗？此操作不可恢复。"
        confirmText="删除"
        cancelText="取消"
        destructive={true}
        onConfirm={async () => {
          setShowDeleteDialog(false);
          setTimeout(async () => {
            try {
              setLoading(true);
              const success = await dataService.softDeleteFarm(id);
              if (success) {
                toast.success('养殖场信息已成功删除');
                router.push('/(tabs)');
              } else {
                toast.error('删除养殖场信息失败，请稍后重试');
              }
            } catch {
          toast.error('删除过程中出现错误，请稍后重试');
        } finally {
              setLoading(false);
            }
          }, 160);
        }}
        onCancel={() => {
          setShowDeleteDialog(false);
        }}
      />

      <ImagePreview
        visible={imagePreviewVisible}
        images={previewImages}
        initialIndex={previewInitialIndex}
        onClose={closeImagePreview}
      />
    </SafeAreaView>
  );
}
