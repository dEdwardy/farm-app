import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formFields, renderFormField } from '@/components/FormFields';
import { OssUpload } from '@/components/OssUpload';
import { useTheme } from '@/contexts/ThemeContext';
import { useFarmForm } from '@/hooks/useFarmForm';
import { dataService } from '@/services/dataService';
import { createFormStyles } from '@/styles/formStyles';
import type { FarmFile } from '@/types/farm';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

// 类型定义
interface FarmImageData {
  id?: string;
  url: string;
  name: string;
  type?: string;
  size?: number;
}

interface OriginalFile {
  id: string;
  url: string;
  business_type: string;
  name: string;
  type: string;
}

interface FarmDataFromApi {
  farm_name?: string;
  address?: string;
  longitude_latitude?: string;
  responsible_person?: string;
  contact_phone?: string;
  pond_count?: string;
  water_area_acre?: string;
  farm_area_acre?: string;
  other_water_area_sqm?: string;
  other_farm_area_acre?: string;
  avg_water_depth?: string;
  main_species?: string;
  farm_mode?: string;
  operation_status?: string;
  output?: string;
  output_value?: string;
  total_investment?: string;
  farm_images?: (FarmImageData | string)[];
  has_treatment_facility?: boolean;
  treatment_method?: string;
  treatment_facility_area?: string;
  treated_discharge_volume?: string;
  final_destination?: string;
  tail_water_images?: (FarmImageData | string)[];
  safety_info?: (FarmImageData | string)[];
}

// 提取文件处理函数
function extractOriginalFiles(
  farmImages: (FarmImageData | string)[],
  tailWaterImages: (FarmImageData | string)[],
  safetyInfo: (FarmImageData | string)[]
): OriginalFile[] {
  const files: OriginalFile[] = [];

  const processFile = (item: FarmImageData | string, businessType: string, defaultType: string) => {
    if (typeof item !== 'string' && item.id) {
      files.push({
        id: item.id,
        url: item.url,
        business_type: businessType,
        name: item.name,
        type: item.type || defaultType,
      });
    }
  };

  farmImages?.forEach((item) => processFile(item, 'farm_images', 'image'));
  tailWaterImages?.forEach((item) => processFile(item, 'tail_water_images', 'image'));
  safetyInfo?.forEach((item) => processFile(item, 'safety_info', 'file'));

  return files;
}

// 处理图片数组
function processImages(images: (FarmImageData | string)[] | undefined): FarmFile[] {
  if (!Array.isArray(images)) return [];

  return images.map((item) => {
    if (typeof item === 'string') {
      return { url: item, name: item.split('/').pop() || '', size: 0 };
    }
    return { ...item, size: item.size || 0 };
  });
}

// 处理表单数据
function processFarmData(data: FarmDataFromApi) {
  return {
    farm_name: String(data.farm_name ?? ''),
    address: String(data.address ?? ''),
    longitude_latitude: String(data.longitude_latitude ?? ''),
    responsible_person: String(data.responsible_person ?? ''),
    contact_phone: String(data.contact_phone ?? ''),
    pond_count: String(data.pond_count ?? ''),
    water_area_acre: String(data.water_area_acre ?? ''),
    farm_area_acre: String(data.farm_area_acre ?? ''),
    other_water_area_sqm: String(data.other_water_area_sqm ?? ''),
    other_farm_area_acre: String(data.other_farm_area_acre ?? ''),
    avg_water_depth: String(data.avg_water_depth ?? ''),
    main_species: String(data.main_species ?? ''),
    farm_mode: String(data.farm_mode ?? ''),
    operation_status: String(data.operation_status ?? ''),
    output: data.output ? String(data.output) : '',
    output_value: data.output_value ? String(data.output_value) : '',
    total_investment: data.total_investment ? String(data.total_investment) : '',
    farm_images: processImages(data.farm_images),
    has_treatment_facility: Boolean(data.has_treatment_facility ?? false),
    treatment_method: String(data.treatment_method ?? ''),
    treatment_facility_area: String(data.treatment_facility_area ?? ''),
    treated_discharge_volume: String(data.treated_discharge_volume ?? ''),
    final_destination: String(data.final_destination ?? ''),
    tail_water_images: processImages(data.tail_water_images),
    safety_info: processImages(data.safety_info),
  };
}

export default function EditScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const styles = createFormStyles(theme);
  const [loading, setLoading] = useState(true);

  const {
    formData,
    errors,
    loading: saving,
    handleChange,
    handleImagesChange,
    handleImageRemove,
    submit,
    setOriginalFiles,
  } = useFarmForm({
    onSuccess: () => {
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    },
  });

  // 加载农场数据
  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const farmData = await dataService.getFarmById(id);
      if (!farmData) {
        toast.error('获取数据失败，未找到该记录');
        return;
      }

      const files = extractOriginalFiles(
        farmData.farm_images || [],
        farmData.tail_water_images || [],
        farmData.safety_info || []
      );
      setOriginalFiles(files);

      const processedData = processFarmData(farmData);
      Object.entries(processedData).forEach(([key, value]) => {
        handleChange(key, value);
      });
    } catch (error) {
      logger.error('edit', '获取数据失败:', error);
      toast.error('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [id, handleChange, setOriginalFiles]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async () => {
    const success = await submit(id);
    if (success) {
      // 成功后的逻辑在 onSuccess 中处理
    }
  }, [submit, id]);

  // 渲染表单字段
  const renderFormFields = useCallback((fields: typeof formFields) => {
    return fields.map((field) => (
      <View key={field.name} style={styles.formGroup}>
        {renderFormField(
          field,
          formData[field.name as keyof typeof formData] ?? '',
          handleChange,
          errors[field.name]
        )}
      </View>
    ));
  }, [formData, handleChange, errors]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={saving || loading}
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, saving, loading, formData, handleSubmit]);

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
          {renderFormFields(formFields.slice(0, 5))}
        </View>

        {/* 养殖信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>养殖信息</Text>
          {renderFormFields(formFields.slice(5, 17))}
          {/* 养殖情况图片上传 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>养殖情况图片</Text>
            <OssUpload
              onUploadComplete={(files) => handleImagesChange('farm_images', files)}
              onFileRemove={(_, index) => handleImageRemove('farm_images', index)}
              uploadType="image"
              previewType="picture"
              initialFiles={formData.farm_images || []}
              loading={saving}
            />
          </View>
        </View>

        {/* 尾水处理 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>尾水处理</Text>
          {/* 有无尾水处理设施 - 第一个字段，始终显示 */}
          {formFields.slice(17, 18).map((field) => (
            <View key={field.name} style={styles.formGroup}>
              {renderFormField(
                field,
                formData[field.name as keyof typeof formData] ?? '',
                handleChange,
                errors[field.name]
              )}
            </View>
          ))}
          {/* 其他尾水处理字段 - 仅当 has_treatment_facility 为 true 时显示 */}
          {formData.has_treatment_facility && (
            <>
              {renderFormFields(formFields.slice(18))}
              {/* 尾水处理图片上传 */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>尾水处理图片</Text>
                <OssUpload
                  onUploadComplete={(files) => handleImagesChange('tail_water_images', files)}
                  onFileRemove={(_, index) => handleImageRemove('tail_water_images', index)}
                  uploadType="image"
                  previewType="picture"
                  initialFiles={formData.tail_water_images || []}
                  loading={saving}
                />
              </View>
            </>
          )}
        </View>

        {/* 安全信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>安全信息</Text>
          {/* 安全信息文件上传 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>安全信息文件</Text>
            <OssUpload
              onUploadComplete={(files) => handleImagesChange('safety_info', files)}
              onFileRemove={(_, index) => handleImageRemove('safety_info', index)}
              uploadType="file"
              previewType="list"
              initialFiles={formData.safety_info || []}
              loading={saving}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
