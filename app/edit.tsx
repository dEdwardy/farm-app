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
      // 1秒后返回列表页
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    },
  });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const farmData = await dataService.getFarmById(id);
      if (farmData) {
        const {
          farm_name,
          address,
          longitude_latitude,
          responsible_person,
          contact_phone,
          pond_count,
          water_area_acre,
          farm_area_acre,
          other_water_area_sqm,
          other_farm_area_acre,
          avg_water_depth,
          main_species,
          farm_mode,
          operation_status,
          output,
          output_value,
          total_investment,
          farm_images,
          has_treatment_facility,
          treatment_method,
          treatment_facility_area,
          treated_discharge_volume,
          final_destination,
          tail_water_images,
          safety_info,
        } = farmData;

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

        // 准备原始文件数据
        const files: OriginalFile[] = [];
        if (Array.isArray(farm_images)) {
          farm_images.forEach((item) => {
            if (typeof item !== 'string' && 'id' in item && item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: 'farm_images',
                name: item.name,
                type: item.type || 'image'
              });
            }
          });
        }
        if (Array.isArray(tail_water_images)) {
          tail_water_images.forEach((item) => {
            if (typeof item !== 'string' && 'id' in item && item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: 'tail_water_images',
                name: item.name,
                type: item.type || 'image'
              });
            }
          });
        }
        if (Array.isArray(safety_info)) {
          safety_info.forEach((item) => {
            if (typeof item !== 'string' && 'id' in item && item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: 'safety_info',
                name: item.name,
                type: item.type || 'file'
              });
            }
          });
        }
        setOriginalFiles(files);

        const processedData = {
          farm_name: String(farm_name ?? ''),
          address: String(address ?? ''),
          longitude_latitude: String(longitude_latitude ?? ''),
          responsible_person: String(responsible_person ?? ''),
          contact_phone: String(contact_phone ?? ''),
          pond_count: String(pond_count ?? ''),
          water_area_acre: String(water_area_acre ?? ''),
          farm_area_acre: String(farm_area_acre ?? ''),
          other_water_area_sqm: String(other_water_area_sqm ?? ''),
          other_farm_area_acre: String(other_farm_area_acre ?? ''),
          avg_water_depth: String(avg_water_depth ?? ''),
          main_species: String(main_species ?? ''),
          farm_mode: String(farm_mode ?? ''),
          operation_status: String(operation_status ?? ''),
          output: output ? String(output) : '',
          output_value: output_value ? String(output_value) : '',
          total_investment: total_investment ? String(total_investment) : '',
          farm_images: Array.isArray(farm_images) ? farm_images.map((item: FarmImageData | string) => {
            if (typeof item === 'string') {
              return { url: item, name: item.split('/').pop() || '', size: 0 };
            }
            return { ...item, size: item.size || 0 };
          }) : [],
          has_treatment_facility: Boolean(has_treatment_facility ?? false),
          treatment_method: String(treatment_method ?? ''),
          treatment_facility_area: String(treatment_facility_area ?? ''),
          treated_discharge_volume: String(treated_discharge_volume ?? ''),
          final_destination: String(final_destination ?? ''),
          tail_water_images: Array.isArray(tail_water_images) ? tail_water_images.map((item: FarmImageData | string) => {
            if (typeof item === 'string') {
              return { url: item, name: item.split('/').pop() || '', size: 0 };
            }
            return { ...item, size: item.size || 0 };
          }) : [],
          safety_info: Array.isArray(safety_info) ? safety_info.map((item: FarmImageData | string) => {
            if (typeof item === 'string') {
              return { url: item, name: item.split('/').pop() || '', size: 0 };
            }
            return { ...item, size: item.size || 0 };
          }) : [],
        };

        Object.keys(processedData).forEach(key => {
          handleChange(key, processedData[key as keyof typeof processedData]);
        });
      }
    } catch (e) {
      console.error('获取数据失败:', e);
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
          {formFields.slice(0, 5).map((field) => (
            <View key={field.name} style={styles.formGroup}>
              {renderFormField(
                field,
                formData[field.name as keyof typeof formData],
                handleChange,
                errors[field.name]
              )}
            </View>
          ))}
        </View>

        {/* 养殖信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>养殖信息</Text>
          {formFields.slice(5, 17).map((field) => (
            <View key={field.name} style={styles.formGroup}>
              {renderFormField(
                field,
                formData[field.name as keyof typeof formData],
                handleChange,
                errors[field.name]
              )}
            </View>
          ))}
          {/* 养殖情况图片上传 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>养殖情况图片</Text>
            <OssUpload
              onUploadComplete={(files) => handleImagesChange('farm_images', files)}
              onFileRemove={(_, index) => handleImageRemove('farm_images', index)}
              maxFiles={5}
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
                formData[field.name as keyof typeof formData],
                handleChange,
                errors[field.name]
              )}
            </View>
          ))}
          {/* 其他尾水处理字段 - 仅当 has_treatment_facility 为 true 时显示 */}
          {formData.has_treatment_facility && (
            <>
              {formFields.slice(18).map((field) => (
                <View key={field.name} style={styles.formGroup}>
                  {renderFormField(
                    field,
                    formData[field.name as keyof typeof formData],
                    handleChange,
                    errors[field.name]
                  )}
                </View>
              ))}
              {/* 尾水处理图片上传 */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>尾水处理图片</Text>
                <OssUpload
                  onUploadComplete={(files) => handleImagesChange('tail_water_images', files)}
                  onFileRemove={(_, index) => handleImageRemove('tail_water_images', index)}
                  maxFiles={5}
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
              maxFiles={5}
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
