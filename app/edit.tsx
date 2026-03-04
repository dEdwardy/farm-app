import { dataService } from '@/services/dataService';
import { createFormStyles } from '@/styles/formStyles';
import { useNavigation } from '@react-navigation/native';
import { Overlay } from '@rneui/base';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { formFields, renderFormField } from '../components/FormFields';
import { OssUpload } from '../components/OssUpload';
import { useTheme } from '../contexts/ThemeContext';
import { FarmFormData, farmFormSchema } from '../types/schemas';

export default function EditScreen() {
  const router = useRouter();
  const navigation = useNavigation();
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
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [originalFiles, setOriginalFiles] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      const farmData = await dataService.getFarmById(id);
      if (farmData) {
        // 准备原始文件数据
        const files: { id: string; url: string; business_type: string; name: string; type: string }[] = [];
        
        // 处理养殖情况图片
        if (Array.isArray(farmData.farm_images)) {
          farmData.farm_images.forEach((item: any) => {
            if (item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: 'farm_images',
                name: item.name,
                type: item.type
              });
            }
          });
        }
        
        // 处理尾水处理图片
        if (Array.isArray(farmData.tail_water_images)) {
          farmData.tail_water_images.forEach((item: any) => {
            if (item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: 'tail_water_images',
                name: item.name,
                type: item.type
              });
            }
          });
        }
        
        // 处理安全信息文件
        if (Array.isArray(farmData.safety_info)) {
          farmData.safety_info.forEach((item: any) => {
            if (item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: 'safety_info',
                name: item.name,
                type: item.type
              });
            }
          });
        }
        
        // 存储原始文件数据
        setOriginalFiles(files);
        
        // 将获取的数据设置到formData
        setFormData({
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
          farm_images: Array.isArray(farmData.farm_images) ? farmData.farm_images.map((item: any) => typeof item === 'string' ? { url: item, name: item.split('/').pop() || '', size: 0 } : { ...item, size: item.size || 0 }) : [],
          has_treatment_facility: Boolean(farmData.has_treatment_facility ?? false),
          treatment_method: String(farmData.treatment_method ?? ''),
          treatment_facility_area: String(farmData.treatment_facility_area ?? ''),
          treated_discharge_volume: String(farmData.treated_discharge_volume ?? ''),
          final_destination: String(farmData.final_destination ?? ''),
          tail_water_images: Array.isArray(farmData.tail_water_images) ? farmData.tail_water_images.map((item: any) => typeof item === 'string' ? { url: item, name: item.split('/').pop() || '', size: 0 } : { ...item, size: item.size || 0 }) : [],
          safety_info: Array.isArray(farmData.safety_info) ? farmData.safety_info.map((item: any) => typeof item === 'string' ? { url: item, name: item.split('/').pop() || '', size: 0 } : { ...item, size: item.size || 0 }) : [],
        });
      } else {
        setErrors({ global: '获取数据失败，未找到该记录' });
      }
    } catch (e) {
      setErrors({ global: '获取数据失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  // 自动隐藏消息
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (key: string, value: string | boolean | any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    // 清除对应字段的错误
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // 处理养殖情况图片上传完成
  const handleFarmImagesUpload = (files: { url: string; name: string }[]) => {
    setFormData(prev => ({
      ...prev,
      farm_images: files
    }));
  };

  // 处理养殖情况图片删除
  const handleFarmImageRemove = (file: { url: string; name: string }, index: number) => {
    const updatedFarmImages = [...(formData.farm_images || [])];
    updatedFarmImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      farm_images: updatedFarmImages
    }));
  };

  // 处理尾水处理图片上传完成
  const handleTailWaterImagesUpload = (files: { url: string; name: string }[]) => {
    setFormData(prev => ({
      ...prev,
      tail_water_images: files
    }));
  };

  // 处理尾水处理图片删除
  const handleTailWaterImageRemove = (file: { url: string; name: string }, index: number) => {
    const updatedTailWaterImages = [...(formData.tail_water_images || [])];
    updatedTailWaterImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      tail_water_images: updatedTailWaterImages
    }));
  };

  // 处理安全信息文件上传完成
  const handleSafetyInfoUpload = (files: { url: string; name: string }[]) => {
    setFormData(prev => ({
      ...prev,
      safety_info: files
    }));
  };

  // 处理安全信息文件删除
  const handleSafetyInfoRemove = (file: { url: string; name: string }, index: number) => {
    const updatedSafetyInfo = [...(formData.safety_info || [])];
    updatedSafetyInfo.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      safety_info: updatedSafetyInfo
    }));
  };

  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);

    try {
      // 验证表单数据
      farmFormSchema.parse(formData);

      const updatedFarm = await dataService.updateFarm(id, formData, originalFiles);
      
      if (updatedFarm) {
        // 显示成功提示
        setMessage('数据更新成功！');
        setMessageType('success');
        
        // 跳转到详情页面
        router.replace(`/detail?id=${id}`);
      } else {
        // 显示错误提示
        setMessage('数据更新失败，请稍后重试');
        setMessageType('error');
      }
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        // 处理验证错误，将错误信息按字段分组
        const fieldErrors: Record<string, string> = {};
        e.issues.forEach((issue: any) => {
          if (issue.path && issue.path.length > 0) {
            const fieldName = issue.path[0];
            fieldErrors[fieldName] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setMessage('数据更新失败，请稍后重试');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={loading || uploading}
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {loading ? "保存中..." : uploading ? "上传中..." : "保存"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading, uploading, formData]);

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
              onUploadComplete={handleFarmImagesUpload}
              onFileRemove={handleFarmImageRemove}
              onUploading={setUploading}
              maxFiles={5}
              uploadType="image"
              previewType="picture"
              initialFiles={formData.farm_images || []}
              loading={loading}
            />
          </View>
        </View>

        {/* 尾水处理 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>尾水处理</Text>
          {formFields.slice(17).map((field) => (
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
              onUploadComplete={handleTailWaterImagesUpload}
              onFileRemove={handleTailWaterImageRemove}
              onUploading={setUploading}
              maxFiles={5}
              uploadType="image"
              previewType="picture"
              initialFiles={formData.tail_water_images || []}
              loading={loading}
            />
          </View>
        </View>

        {/* 安全信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>安全信息</Text>
          {/* 安全信息文件上传 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>安全信息文件</Text>
            <OssUpload
              onUploadComplete={handleSafetyInfoUpload}
              onFileRemove={handleSafetyInfoRemove}
              onUploading={setUploading}
              maxFiles={5}
              uploadType="file"
              previewType="list"
              initialFiles={formData.safety_info || []}
              loading={loading}
            />
          </View>
        </View>

        {/* 全局错误提示 */}
        {errors.global && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.global}</Text>
          </View>
        )}

        {/* 消息提示 */}
        {message && (
          <Overlay
            isVisible={!!message}
            onBackdropPress={() => setMessage(null)}
            overlayStyle={[styles.overlay, messageType === 'success' ? styles.successOverlay : styles.errorOverlay]}
          >
            <Text style={[styles.overlayText, messageType === 'success' ? styles.successText : styles.errorText]}>
              {message}
            </Text>
          </Overlay>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
