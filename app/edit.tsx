import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FarmForm } from '@/components/FarmForm';
import { BUSINESS_CONSTANTS } from '@/constants';
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
  operation_status?: string|undefined|null;
  output?: string;
  output_value?: string;
  total_investment?: string;
  farm_images?: (FarmImageData | string)[];
  has_treatment_facility?: boolean;
  treatment_method?: string|undefined|null;
  treatment_facility_area?: string;
  treated_discharge_volume?: string;
  final_destination?: string|undefined|null;
  tail_water_images?: (FarmImageData | string)[];
  safety_info?: (FarmImageData | string)[];
}

// 提取文件处理函数
function extractOriginalFiles (
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
function processImages (images: (FarmImageData | string)[] | undefined): FarmFile[] {
  if (!Array.isArray(images)) return [];

  return images.map((item) => {
    if (typeof item === 'string') {
      return { url: item, name: item.split('/').pop() || '', size: 0 };
    }
    return { ...item, size: item.size || 0 };
  });
}

// 处理表单数据
function processFarmData (data: FarmDataFromApi) {
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
    operation_status: data.operation_status,
    output: data.output ? String(data.output) : '',
    output_value: data.output_value ? String(data.output_value) : '',
    total_investment: data.total_investment ? String(data.total_investment) : '',
    farm_images: processImages(data.farm_images),
    has_treatment_facility: Boolean(data.has_treatment_facility ?? false),
    treatment_method: data.treatment_method,
    treatment_facility_area: String(data.treatment_facility_area ?? ''),
    treated_discharge_volume: String(data.treated_discharge_volume ?? ''),
    final_destination: data.final_destination,
    tail_water_images: processImages(data.tail_water_images),
    safety_info: processImages(data.safety_info),
  };
}

export default function EditScreen () {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const styles = useMemo(() => createFormStyles(theme), [theme]);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const { loading: formLoading, setOriginalFiles } = useFarmForm({
    onSuccess: () => {
      setTimeout(() => {
        router.replace('/');
      }, BUSINESS_CONSTANTS.NAVIGATION_DELAY);
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

      // 处理表单数据
      const processedData = processFarmData(farmData);
      setInitialData(processedData);
    } catch (error) {
      logger.error('edit', '获取数据失败:', error);
      toast.error('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [id, setOriginalFiles]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <FarmForm 
      onSuccess={() => {
        setTimeout(() => {
          router.replace('/(tabs)');
        }, BUSINESS_CONSTANTS.NAVIGATION_DELAY);
      }}
      initialData={initialData}
      submitId={id}
      loading={loading}
      saving={formLoading}
      navigation={navigation}
    />
  );
}
