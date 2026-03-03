import { dataService } from '@/services/dataService';
import { formStyles } from '@/styles/formStyles';
import { Overlay } from '@rneui/base';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { formFields, renderFormField } from '../components/FormFields';
import { OssUpload } from '../components/OssUpload';
import { FarmFormData, farmFormSchema } from '../types/schemas';

export default function AddScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FarmFormData>({
    // 场所信息
    farm_name: '',
    address: '',
    longitude_latitude: '',
    responsible_person: '',
    contact_phone: '',
    // 养殖情况
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
    // 尾水处理
    has_treatment_facility: false,
    treatment_method: '',
    treatment_facility_area: '',
    treated_discharge_volume: '',
    final_destination: '',
    tail_water_images: [],
    // 安全信息
    safety_info: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

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
    // 处理文件删除逻辑
    console.log('删除养殖情况图片:', file, '索引:', index);
    // 从formData中移除对应的文件URL
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
    // 处理文件删除逻辑
    console.log('删除尾水处理图片:', file, '索引:', index);
    // 从formData中移除对应的文件URL
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
    // 处理文件删除逻辑
    console.log('删除安全信息文件:', file, '索引:', index);
    // 从formData中移除对应的文件URL
    const updatedSafetyInfo = [...(formData.safety_info || [])];
    updatedSafetyInfo.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      safety_info: updatedSafetyInfo
    }));
  };

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

  const handleSubmit = async () => {
    console.log(formData)
    setErrors({});
    setLoading(true);

    try {
      // 验证表单数据
      farmFormSchema.parse(formData);

      // 提交数据
      console.log('Submitting data:', formData);
      const insertedFarm = await dataService.addFarm(formData);
      
      if (insertedFarm) {
        // 显示成功提示
        setMessage('数据添加成功！');
        setMessageType('success');
        
        // 重置表单
        setFormData({
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
      } else {
        // 显示错误提示
        setMessage('数据添加失败，请稍后重试');
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
        console.error('Submit error:', e);
        // 显示错误提示
        setMessage('数据添加失败，请稍后重试');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={formStyles.safeArea}>
      <ScrollView contentContainerStyle={formStyles.scrollContent}>
        <View style={formStyles.titleContainer}>
          <Text style={formStyles.heading}>新增数据</Text>
          <Text style={formStyles.subtitle}>请填写以下信息</Text>
        </View>

        <View style={formStyles.formContainer}>
          {/* 场所信息 */}
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>场所信息</Text>
            {formFields.slice(0, 5).map((field) => (
              <View key={field.name}>
                {renderFormField(
                  field,
                  formData[field.name as keyof typeof formData],
                  handleChange,
                  errors[field.name]
                )}
              </View>
            ))}
          </View>

          {/* 养殖情况 */}
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>养殖情况</Text>
            {formFields.slice(5, 17).map((field) => (
              <View key={field.name}>
                {renderFormField(
                  field,
                  formData[field.name as keyof typeof formData],
                  handleChange,
                  errors[field.name]
                )}
              </View>
            ))}
            {/* 养殖情况图片上传 */}
            <View style={formStyles.formGroup}>
              <Text style={{ fontSize: 14, color: 'rgba(108,117,125,1.00)', marginBottom: 4 }}>养殖情况图片</Text>
              <OssUpload
                onUploadComplete={handleFarmImagesUpload}
                onFileRemove={handleFarmImageRemove}
                onUploading={setUploading}
                maxFiles={5}
                uploadType="image"
                previewType="picture"
                loading={loading}
              />
            </View>
          </View>

          {/* 尾水处理 */}
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>尾水处理</Text>
            {formFields.slice(17).map((field) => (
              <View key={field.name}>
                {renderFormField(
                  field,
                  formData[field.name as keyof typeof formData],
                  handleChange,
                  errors[field.name]
                )}
              </View>
            ))}
            {/* 尾水处理图片上传 */}
            <View style={formStyles.formGroup}>
              <Text style={{ fontSize: 14, color: 'rgba(108,117,125,1.00)', marginBottom: 4 }}>尾水处理图片</Text>
              <OssUpload
                onUploadComplete={handleTailWaterImagesUpload}
                onFileRemove={handleTailWaterImageRemove}
                onUploading={setUploading}
                maxFiles={5}
                uploadType="image"
                previewType="picture"
                loading={loading}
              />
            </View>
          </View>

          {/* 安全信息 */}
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>安全信息</Text>
            {/* 安全信息文件上传 */}
            <View style={formStyles.formGroup}>
              <OssUpload
                onUploadComplete={handleSafetyInfoUpload}
                onFileRemove={handleSafetyInfoRemove}
                onUploading={setUploading}
                maxFiles={5}
                uploadType="file"
                previewType="list"
                loading={loading}
              />
            </View>
          </View>

          {/* 全局错误提示 */}
          {errors.global && (
            <View style={formStyles.errorContainer}>
              <Text style={formStyles.errorText}>{errors.global}</Text>
            </View>
          )}

          {/* 消息提示 */}
          {message && (
            <Overlay
              isVisible={!!message}
              onBackdropPress={() => setMessage(null)}
              overlayStyle={[formStyles.overlay, messageType === 'success' ? formStyles.successOverlay : formStyles.errorOverlay]}
            >
              <Text style={[formStyles.overlayText, messageType === 'success' ? formStyles.successText : formStyles.errorText]}>
                {message}
              </Text>
            </Overlay>
          )}

          {/* 按钮容器 */}
          <View style={formStyles.buttonContainer}>
            {/* 提交按钮 */}
            <TouchableOpacity
              style={[formStyles.submitButton, (loading || uploading) && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading || uploading}
              activeOpacity={0.7}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{loading ? "提交中..." : uploading ? "上传中..." : "提交"}</Text>
            </TouchableOpacity>

            {/* 返回按钮 */}
            <TouchableOpacity
              style={formStyles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={{ color: '#1976d2', fontWeight: '600', fontSize: 16 }}>返回</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
