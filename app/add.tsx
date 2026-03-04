import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formFields, renderFormField } from '@/components/FormFields';
import { OssUpload } from '@/components/OssUpload';
import { useTheme } from '@/contexts/ThemeContext';
import { useFarmForm } from '@/hooks/useFarmForm';
import { createFormStyles } from '@/styles/formStyles';

export default function AddScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createFormStyles(theme);

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleImagesChange,
    handleImageRemove,
    submit,
  } = useFarmForm({
    onSuccess: () => {
      // 2秒后返回列表页
      setTimeout(() => {
        router.back();
      }, 1500);
    },
  });

  const handleSubmit = async () => {
    const success = await submit();
    if (success) {
      // 成功后的逻辑在 onSuccess 中处理
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {loading ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading, formData]);

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
              onUploadComplete={(files) => handleImagesChange('tail_water_images', files)}
              onFileRemove={(_, index) => handleImageRemove('tail_water_images', index)}
              maxFiles={5}
              uploadType="image"
              previewType="picture"
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
              onUploadComplete={(files) => handleImagesChange('safety_info', files)}
              onFileRemove={(_, index) => handleImageRemove('safety_info', index)}
              maxFiles={5}
              uploadType="file"
              previewType="list"
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
