import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useFarmForm } from '@/hooks/useFarmForm';
import { createFormStyles } from '@/styles/formStyles';
import type { FormFile } from '@/types/farm';
import type { FarmFormData } from '@/types/schemas';
import { formFields, renderFormField } from './FormFields';
import { OssUpload } from './OssUpload';

interface FarmFormProps {
  onSuccess: () => void;
  initialData?: Partial<FarmFormData>;
  submitId?: string;
  loading?: boolean;
  saving?: boolean;
  navigation: any;
}

export const FarmForm: React.FC<FarmFormProps> = ({
  onSuccess,
  initialData,
  submitId,
  loading = false,
  saving = false,
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = createFormStyles(theme);

  // 动画引用
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const {
    formData,
    errors,
    loading: formLoading,
    handleChange,
    handleImagesChange,
    handleImageRemove,
    submit,
  } = useFarmForm({
    initialData,
    onSuccess,
  });

  // 使用 useCallback 包装事件处理函数，确保引用稳定
  const handleFarmImagesChange = React.useCallback((files: FormFile[]) => {
    handleImagesChange('farm_images', files);
  }, [handleImagesChange]);

  const handleFarmImageRemove = React.useCallback((_: FormFile, index: number) => {
    handleImageRemove('farm_images', index);
  }, [handleImageRemove]);

  const handleTailWaterImagesChange = React.useCallback((files: FormFile[]) => {
    handleImagesChange('tail_water_images', files);
  }, [handleImagesChange]);

  const handleTailWaterImageRemove = React.useCallback((_: FormFile, index: number) => {
    handleImageRemove('tail_water_images', index);
  }, [handleImageRemove]);

  const handleSafetyInfoChange = React.useCallback((files: FormFile[]) => {
    handleImagesChange('safety_info', files);
  }, [handleImagesChange]);

  const handleSafetyInfoRemove = React.useCallback((_: FormFile, index: number) => {
    handleImageRemove('safety_info', index);
  }, [handleImageRemove]);

  const currentSaving = saving || formLoading;
  const currentLoading = loading || formLoading;
  
  // 加载动画
  React.useEffect(() => {
    if (currentLoading) {
      // 保存动画引用
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();
      
      // 淡入效果
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 停止动画
      if (animationRef.current) {
        animationRef.current.stop();
      }
      // 淡出效果
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // 清理函数
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [currentLoading, loadingAnim, fadeAnim]);

  useLayoutEffect(() => {
    const handleSubmit = async () => {
      console.log('formData', formData);
      await submit(submitId);
    };

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={currentSaving || currentLoading}
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {currentSaving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, currentSaving, currentLoading, submit, submitId]);

  // 表单字段分组配置
  const formSections = useMemo(() => {
    // 在 useMemo 内部获取图片数组，避免依赖项变化
    const farmImages = formData.farm_images || [];
    const tailWaterImages = formData.tail_water_images || [];
    const safetyInfoFiles = formData.safety_info || [];
    
    return [
      {
        title: '场所信息',
        fields: formFields.slice(0, 5),
        uploader: null,
      },
      {
        title: '养殖信息',
        fields: formFields.slice(5, 17),
        uploader: (
          <View style={styles.formGroup}>
            <Text style={styles.label}>养殖情况图片</Text>
            <OssUpload
              onUploadComplete={handleFarmImagesChange}
              onFileRemove={handleFarmImageRemove}
              uploadType="image"
              previewType="picture"
              initialFiles={farmImages}
              loading={currentSaving}
            />
          </View>
        ),
      },
      {
        title: '尾水处理',
        fields: formFields.slice(17, 18), // 只包含 has_treatment_facility 字段
        conditionalFields: formData.has_treatment_facility ? formFields.slice(18) : [],
        uploader: formData.has_treatment_facility ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>尾水处理图片</Text>
            <OssUpload
              onUploadComplete={handleTailWaterImagesChange}
              onFileRemove={handleTailWaterImageRemove}
              uploadType="image"
              previewType="picture"
              initialFiles={tailWaterImages}
              loading={currentSaving}
            />
          </View>
        ) : null,
      },
      {
        title: '安全信息',
        fields: [],
        uploader: (
          <View style={styles.formGroup}>
            <Text style={styles.label}>安全信息文件</Text>
            <OssUpload
              onUploadComplete={handleSafetyInfoChange}
              onFileRemove={handleSafetyInfoRemove}
              uploadType="file"
              previewType="list"
              initialFiles={safetyInfoFiles}
              loading={currentSaving}
            />
          </View>
        ),
      },
    ];
  }, [formData, currentSaving, handleFarmImagesChange, handleFarmImageRemove, handleTailWaterImagesChange, handleTailWaterImageRemove, handleSafetyInfoChange, handleSafetyInfoRemove, styles.formGroup, styles.label]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {formSections.map((section, index) => (
            <View key={index} style={styles.formContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {/* 渲染普通字段 */}
              {section.fields.map((field) => (
                <View key={field.name} style={styles.formGroup}>
                  {renderFormField(
                    field,
                    formData[field.name as keyof typeof formData] ?? '',
                    handleChange,
                    errors[field.name]
                  )}
                </View>
              ))}
              {/* 渲染条件字段 */}
              {(section as any).conditionalFields?.map((field: any) => (
                <View key={field.name} style={styles.formGroup}>
                  {renderFormField(
                    field,
                    formData[field.name as keyof typeof formData] ?? '',
                    handleChange,
                    errors[field.name]
                  )}
                </View>
              ))}
              {/* 渲染上传组件 */}
              {section.uploader}
            </View>
          ))}
        </ScrollView>
      
      {/* 加载指示器 */}
      {currentLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      )}
      </Animated.View>
    </SafeAreaView>
  );
}
