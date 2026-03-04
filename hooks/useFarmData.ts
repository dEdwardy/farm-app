import { useCallback, useState } from 'react';

import { dataService, FarmRow } from '@/services/dataService';
import { FarmFormData } from '@/types/schemas';

interface FarmFile {
  id: string;
  url: string;
  business_type: string;
  name: string;
  type: string;
  size?: number;
}

interface UseFarmDataReturn {
  formData: FarmFormData;
  loading: boolean;
  uploading: boolean;
  errors: Record<string, string>;
  originalFiles: FarmFile[];
  fetchData: (id: string) => Promise<void>;
  handleChange: (key: string, value: string | boolean | any) => void;
  handleImagesChange: (field: 'farm_images' | 'tail_water_images' | 'safety_info', files: { url: string; name: string }[]) => void;
  handleImageRemove: (field: 'farm_images' | 'tail_water_images' | 'safety_info', index: number) => void;
  setUploading: (value: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
}

const defaultFormData: FarmFormData = {
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
};

export function useFarmData(): UseFarmDataReturn {
  const [formData, setFormData] = useState<FarmFormData>(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalFiles, setOriginalFiles] = useState<FarmFile[]>([]);

  const fetchData = useCallback(async (id: string) => {
    setLoading(true);
    setErrors({});

    try {
      const farmData = await dataService.getFarmById(id);
      if (farmData) {
        const files: FarmFile[] = [];
        
        const processFiles = (items: any[], businessType: string) => {
          items?.forEach((item: any) => {
            if (item.id) {
              files.push({
                id: item.id,
                url: item.url,
                business_type: businessType,
                name: item.name,
                type: item.type,
                size: item.size,
              });
            }
          });
        };

        processFiles(farmData.farm_images, 'farm_images');
        processFiles(farmData.tail_water_images, 'tail_water_images');
        processFiles(farmData.safety_info, 'safety_info');

        setOriginalFiles(files);

        const formImages = (farmData.farm_images || []).map((item: any) => ({
          url: item.url,
          name: item.name,
        }));
        const formTailWaterImages = (farmData.tail_water_images || []).map((item: any) => ({
          url: item.url,
          name: item.name,
        }));
        const formSafetyInfo = (farmData.safety_info || []).map((item: any) => ({
          url: item.url,
          name: item.name,
        }));

        setFormData({
          farm_name: farmData.farm_name || '',
          address: farmData.address || '',
          longitude_latitude: farmData.longitude_latitude || '',
          responsible_person: farmData.responsible_person || '',
          contact_phone: farmData.contact_phone || '',
          pond_count: farmData.pond_count?.toString() || '',
          water_area_acre: farmData.water_area_acre?.toString() || '',
          farm_area_acre: farmData.farm_area_acre?.toString() || '',
          other_water_area_sqm: farmData.other_water_area_sqm?.toString() || '',
          other_farm_area_acre: farmData.other_farm_area_acre?.toString() || '',
          avg_water_depth: farmData.avg_water_depth?.toString() || '',
          main_species: farmData.main_species || '',
          farm_mode: farmData.farm_mode || '',
          operation_status: farmData.operation_status || '',
          output: farmData.output?.toString() || '',
          output_value: farmData.output_value?.toString() || '',
          total_investment: farmData.total_investment?.toString() || '',
          farm_images: formImages,
          has_treatment_facility: farmData.has_treatment_facility || false,
          treatment_method: farmData.treatment_method || '',
          treatment_facility_area: farmData.treatment_facility_area?.toString() || '',
          treated_discharge_volume: farmData.treated_discharge_volume?.toString() || '',
          final_destination: farmData.final_destination || '',
          tail_water_images: formTailWaterImages,
          safety_info: formSafetyInfo,
        });
      }
    } catch (e) {
      setErrors({ fetch: '获取数据失败' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback((key: string, value: string | boolean | any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [errors]);

  const handleImagesChange = useCallback((
    field: 'farm_images' | 'tail_water_images' | 'safety_info',
    files: { url: string; name: string }[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: files,
    }));
  }, []);

  const handleImageRemove = useCallback((
    field: 'farm_images' | 'tail_water_images' | 'safety_info',
    index: number
  ) => {
    setFormData((prev) => {
      const updated = [...(prev[field] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [field]: updated,
      };
    });
  }, []);

  return {
    formData,
    loading,
    uploading,
    errors,
    originalFiles,
    fetchData,
    handleChange,
    handleImagesChange,
    handleImageRemove,
    setUploading,
    setErrors,
  };
}
