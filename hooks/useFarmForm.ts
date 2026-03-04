import { useCallback, useState } from 'react';
import { z } from 'zod';

import { dataService } from '@/services/dataService';
import { FarmFormData, farmFormSchema } from '@/types/schemas';

interface UseFarmFormOptions {
  initialData?: Partial<FarmFormData>;
  onSuccess?: () => void;
}

interface UseFarmFormReturn {
  formData: FarmFormData;
  errors: Record<string, string>;
  loading: boolean;
  message: string | null;
  messageType: 'success' | 'error' | null;
  handleChange: (key: string, value: string | boolean | any) => void;
  handleImagesChange: (field: 'farm_images' | 'tail_water_images' | 'safety_info', files: { url: string; name: string }[]) => void;
  handleImageRemove: (field: 'farm_images' | 'tail_water_images' | 'safety_info', index: number) => void;
  validate: () => boolean;
  submit: (id?: string) => Promise<boolean>;
  resetMessage: () => void;
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

export function useFarmForm(options: UseFarmFormOptions = {}): UseFarmFormReturn {
  const { initialData, onSuccess } = options;

  const [formData, setFormData] = useState<FarmFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleChange = useCallback((key: string, value: string | boolean | any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    // 清除对应字段的错误
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

  const validate = useCallback((): boolean => {
    try {
      farmFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (error as z.ZodError).issues.forEach((err: z.ZodIssue) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData]);

  const submit = useCallback(async (id?: string): Promise<boolean> => {
    if (!validate()) {
      setMessage('请检查表单填写是否正确');
      setMessageType('error');
      return false;
    }

    setLoading(true);
    setMessage(null);

    try {
      let result;
      if (id) {
        result = await dataService.updateFarm(id, formData);
      } else {
        result = await dataService.addFarm(formData);
      }

      if (result) {
        setMessage(id ? '更新成功' : '创建成功');
        setMessageType('success');
        onSuccess?.();
        return true;
      } else {
        setMessage('操作失败');
        setMessageType('error');
        return false;
      }
    } catch (error) {
      setMessage('操作失败，请稍后重试');
      setMessageType('error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validate, onSuccess]);

  const resetMessage = useCallback(() => {
    setMessage(null);
    setMessageType(null);
  }, []);

  return {
    formData,
    errors,
    loading,
    message,
    messageType,
    handleChange,
    handleImagesChange,
    handleImageRemove,
    validate,
    submit,
    resetMessage,
  };
}
