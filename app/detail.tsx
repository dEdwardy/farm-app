import { dataService } from '@/services/dataService';

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { createFormStyles } from '../styles/formStyles';
import { FarmFormData, farmFormSchema } from '../types/schemas';

// 暂无数据组件
function NoData({ 
  icon = 'folder-open', 
  text = '暂无数据', 
  style 
}: { 
  icon?: React.ComponentProps<typeof MaterialIcons>['name']; 
  text?: string; 
  style?: object 
}) {
  return (
    <View style={[
      {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 24,
      },
      style
    ]}>
      <MaterialIcons name={icon} size={48} color="#999" style={{ marginBottom: 8 }} />
      <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

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
            <Text style={styles.infoValue}>{formData.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>经纬度</Text>
            <Text style={styles.infoValue}>{formData.longitude_latitude}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>负责人</Text>
            <Text style={styles.infoValue}>{formData.responsible_person}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>联系电话</Text>
            <Text style={styles.infoValue}>{formData.contact_phone}</Text>
          </View>
        </View>

        {/* 养殖信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>养殖信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>池塘口数</Text>
            <Text style={styles.infoValue}>{formData.pond_count}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖水面面积</Text>
            <Text style={styles.infoValue}>{formData.water_area_acre} 亩</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖占地面积</Text>
            <Text style={styles.infoValue}>{formData.farm_area_acre} 亩</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>其他养殖水面面积</Text>
            <Text style={styles.infoValue}>{formData.other_water_area_sqm} 平方米</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>其他养殖占地面积</Text>
            <Text style={styles.infoValue}>{formData.other_farm_area_acre} 亩</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>平均水深</Text>
            <Text style={styles.infoValue}>{formData.avg_water_depth} 米</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>主养品种</Text>
            <Text style={styles.infoValue}>{formData.main_species}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖模式</Text>
            <Text style={styles.infoValue}>{formData.farm_mode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>生产运行情况</Text>
            <Text style={styles.infoValue}>{formData.operation_status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>总产量</Text>
            <Text style={styles.infoValue}>{formData.output} 吨</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年总产值</Text>
            <Text style={styles.infoValue}>{formData.output_value} 万元</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年总投入</Text>
            <Text style={styles.infoValue}>{formData.total_investment} 万元</Text>
          </View>
          <View style={styles.infoRowHorizontal}>
            <Text style={styles.infoLabelHorizontal}>养殖情况图片</Text>
            <View style={styles.imageGrid}>
              {formData.farm_images && formData.farm_images.length > 0 ? (
                formData.farm_images.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image 
                      source={{ uri: image.url }} 
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ))
              ) : (
                <View style={styles.imageItemEmpty}>
                  <NoData text="暂无数据" style={{ backgroundColor: 'transparent' }} />
                </View>
              )}
            </View>
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
            <Text style={styles.infoValue}>{formData.treatment_method}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>尾水处理设施面积</Text>
            <Text style={styles.infoValue}>{formData.treatment_facility_area} 亩</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>已完成尾水治理排放量</Text>
            <Text style={styles.infoValue}>{formData.treated_discharge_volume} 吨</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>养殖尾水最终去向</Text>
            <Text style={styles.infoValue}>{formData.final_destination}</Text>
          </View>
          <View style={styles.infoRowHorizontal}>
            <Text style={styles.infoLabelHorizontal}>尾水处理图片</Text>
            <View style={styles.imageGrid}>
              {formData.tail_water_images && formData.tail_water_images.length > 0 ? (
                formData.tail_water_images.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image 
                      source={{ uri: image.url }} 
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ))
              ) : (
                <View style={styles.imageItemEmpty}>
                  <NoData text="暂无数据" style={{ backgroundColor: 'transparent' }} />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 安全信息 */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>安全信息</Text>
          <View style={styles.infoRowHorizontal}>
            <Text style={styles.infoLabelHorizontal}>安全信息文件</Text>
            <View style={styles.fileList}>
              {formData.safety_info && formData.safety_info.length > 0 ? (
                formData.safety_info.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">{file.name}</Text>
                      <Text style={styles.fileSize}>{(file as any).size ? `${((file as any).size / 1024 / 1024).toFixed(2)} MB` : '未知大小'}</Text>
                    </View>
                    <View style={styles.fileActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.downloadIcon}>⬇️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.shareIcon}>🔗</Text>
                      </TouchableOpacity>
                    </View>
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

        {/* 成功提示 */}
        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
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
            // 实现删除逻辑
            console.log('Delete farm:', id);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
