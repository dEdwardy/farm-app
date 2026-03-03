import { dataService } from '@/services/dataService';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formFields, renderFormField } from '../components/FormFields';
import { OssUpload } from '../components/OssUpload';
import { formStyles } from '../styles/formStyles';
import { FarmFormData, farmFormSchema } from '../types/schemas';

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

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
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFiles, setOriginalFiles] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      // 从API获取数据
      console.log('Fetching data for id:', id);
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
        setTimeout(() => {
          console.log({
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
        })
        }, 500);
      } else {
        setErrors({ global: '获取数据失败，未找到该记录' });
      }
    } catch (e) {
      console.error('Fetch data error:', e);
      setErrors({ global: '获取数据失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

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

  const handleSubmit = async () => {
    setErrors({});
    setSuccess(null);
    setLoading(true);

    try {
      // 验证表单数据
      farmFormSchema.parse(formData);

      // 更新数据
      console.log('Updating data:', formData);
      console.log('Original files count:', originalFiles.length);
      const updatedFarm = await dataService.updateFarm(id, formData, originalFiles);
      
      if (updatedFarm) {
        // 更新本地状态以回显数据
        setFormData({
          farm_name: String(updatedFarm.farm_name ?? ''),
          address: String(updatedFarm.address ?? ''),
          longitude_latitude: String(updatedFarm.longitude_latitude ?? ''),
          responsible_person: String(updatedFarm.responsible_person ?? ''),
          contact_phone: String(updatedFarm.contact_phone ?? ''),
          pond_count: String(updatedFarm.pond_count ?? ''),
          water_area_acre: String(updatedFarm.water_area_acre ?? ''),
          farm_area_acre: String(updatedFarm.farm_area_acre ?? ''),
          other_water_area_sqm: String(updatedFarm.other_water_area_sqm ?? ''),
          other_farm_area_acre: String(updatedFarm.other_farm_area_acre ?? ''),
          avg_water_depth: String(updatedFarm.avg_water_depth ?? ''),
          main_species: String(updatedFarm.main_species ?? ''),
          farm_mode: String(updatedFarm.farm_mode ?? ''),
          operation_status: String(updatedFarm.operation_status ?? ''),
          output: String(updatedFarm.output ?? ''),
          output_value: String(updatedFarm.output_value ?? ''),
          total_investment: String(updatedFarm.total_investment ?? ''),
          farm_images: Array.isArray(updatedFarm.farm_images) ? updatedFarm.farm_images : [],
          has_treatment_facility: Boolean(updatedFarm.has_treatment_facility ?? false),
          treatment_method: String(updatedFarm.treatment_method ?? ''),
          treatment_facility_area: String(updatedFarm.treatment_facility_area ?? ''),
          treated_discharge_volume: String(updatedFarm.treated_discharge_volume ?? ''),
          final_destination: String(updatedFarm.final_destination ?? ''),
          tail_water_images: Array.isArray(updatedFarm.tail_water_images) ? updatedFarm.tail_water_images : [],
          safety_info: Array.isArray(updatedFarm.safety_info) ? updatedFarm.safety_info : [],
        });
        setSuccess('数据更新成功！');
        setIsEditing(false);
      } else {
        setErrors({ global: '数据更新失败，请稍后重试' });
      }
    } catch (e) {
      if (e instanceof Error) {
        // 处理验证错误，将错误信息按字段分组
        const fieldErrors: Record<string, string> = {};
        if ('issues' in e) {
          (e as any).issues.forEach((issue: any) => {
            if (issue.path && issue.path.length > 0) {
              const fieldName = issue.path[0];
              fieldErrors[fieldName] = issue.message;
            }
          });
        }
        setErrors(fieldErrors);
      } else {
        console.error('Update error:', e);
        setErrors({ global: '数据更新失败，请稍后重试' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={formStyles.safeArea}>
        <View style={formStyles.centerContainer}>
          <Text>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={formStyles.safeArea}>
      <ScrollView contentContainerStyle={formStyles.scrollContent}>
        <View style={formStyles.titleContainer}>
          <Text style={formStyles.heading}>数据详情</Text>
          <Text style={formStyles.subtitle}>查看和修改数据</Text>
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
                  errors[field.name],
                  !isEditing
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
                  errors[field.name],
                  !isEditing
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
                disabled={!isEditing}
                initialFiles={formData.farm_images || []}
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
                  errors[field.name],
                  !isEditing
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
                disabled={!isEditing}
                initialFiles={formData.tail_water_images || []}
                loading={loading}
              />
            </View>
          </View>

          {/* 安全信息 */}
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>安全信息</Text>
            {/* 安全信息文件上传 */}
            <View style={formStyles.formGroup}>
              <Text style={{ fontSize: 14, color: 'rgba(108,117,125,1.00)', marginBottom: 4 }}>安全信息文件</Text>
              <OssUpload
                onUploadComplete={handleSafetyInfoUpload}
                onFileRemove={handleSafetyInfoRemove}
                onUploading={setUploading}
                maxFiles={5}
                uploadType="file"
                previewType="list"
                disabled={!isEditing}
                initialFiles={formData.safety_info || []}
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

          {/* 成功提示 */}
          {success && (
            <View style={formStyles.successContainer}>
              <Text style={formStyles.successText}>{success}</Text>
            </View>
          )}

          {/* 操作按钮 */}
          <View style={formStyles.buttonContainer}>
            {!isEditing ? (
              <>
                <TouchableOpacity
                  style={formStyles.submitButton}
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>编辑</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={formStyles.backButton}
                  onPress={() => router.back()}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#1976d2', fontWeight: '600', fontSize: 16 }}>返回</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[formStyles.submitButton, (loading || uploading) && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={loading || uploading}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{loading ? "保存中..." : uploading ? "上传中..." : "保存"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={formStyles.backButton}
                  onPress={() => {
                    setIsEditing(false);
                    fetchData(); // 重置数据
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#1976d2', fontWeight: '600', fontSize: 16 }}>取消</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
