import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { dataService } from '@/services/dataService';
import type { FarmFile, FormFile } from '@/types/farm';
import { FarmFormData, farmFormSchema } from '@/types/schemas';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface UseFarmFormOptions {
  initialData?: Partial<FarmFormData>;
  onSuccess?: () => void;
  originalFiles?: FarmFile[];
}

interface UseFarmFormReturn {
  formData: FarmFormData;
  errors: Record<string, string>;
  loading: boolean;
  message: string | null;
  messageType: 'success' | 'error' | null;
  handleChange: (key: string, value: string | boolean | FormFile[] | undefined) => void;
  handleImagesChange: (field: 'farm_images' | 'tail_water_images' | 'safety_info', files: FormFile[]) => void;
  handleImageRemove: (field: 'farm_images' | 'tail_water_images' | 'safety_info', index: number) => void;
  validate: () => Promise<boolean>;
  submit: (id?: string) => Promise<boolean>;
  resetMessage: () => void;
  setOriginalFiles: (files: FarmFile[]) => void;
  setFormData: (data: Partial<FarmFormData>) => void;
}

const defaultFormData: FarmFormData = {
  farm_name: '',
  address: undefined,
  longitude_latitude: undefined,
  responsible_person: undefined,
  contact_phone: undefined,
  // 数值字段使用 undefined 作为初始值，避免 bigint 类型错误
  pond_count: undefined,
  water_area_acre: undefined,
  farm_area_acre: undefined,
  other_water_area_sqm: undefined,
  other_farm_area_acre: undefined,
  avg_water_depth: undefined,
  main_species: undefined,
  farm_mode: undefined,
  operation_status: undefined,
  output: undefined,
  output_value: undefined,
  total_investment: undefined,
  farm_images: [],
  has_treatment_facility: false,
  treatment_method: undefined,
  treatment_facility_area: undefined,
  treated_discharge_volume: undefined,
  final_destination: undefined,
  tail_water_images: [],
  safety_info: [],
};

export function useFarmForm(options: UseFarmFormOptions = {}): UseFarmFormReturn {
  const { initialData, onSuccess, originalFiles: optionsOriginalFiles } = options;

  // 使用 react-hook-form 管理表单
  const {
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors },
    trigger,
    reset,
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      ...defaultFormData,
      ...initialData,
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [originalFiles, setOriginalFiles] = useState<FarmFile[]>(optionsOriginalFiles || []);

  // 监听表单数据变化
  const formData = watch();

  // 转换错误格式
  const errors = Object.entries(formErrors).reduce((acc, [key, error]) => {
    acc[key] = error.message || '';
    return acc;
  }, {} as Record<string, string>);

  // 处理表单字段变化
  const handleChange = (key: string, value: string | boolean | FormFile[] | undefined) => {
    setValue(key as keyof FarmFormData, value);
  };

  // 处理图片变化
  const handleImagesChange = (
    field: 'farm_images' | 'tail_water_images' | 'safety_info',
    files: FormFile[]
  ) => {
    setValue(field, files);
  };

  // 处理图片删除
  const handleImageRemove = (
    field: 'farm_images' | 'tail_water_images' | 'safety_info',
    index: number
  ) => {
    const currentFiles = getValues(field) || [];
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    setValue(field, updatedFiles);
  };

  // 验证表单
  const validate = async (): Promise<boolean> => {
    // 预处理表单数据，将空字符串转换为 undefined
    const currentValues = getValues();
    Object.keys(currentValues).forEach(key => {
      const value = currentValues[key as keyof FarmFormData];
      if (value === '') {
        setValue(key as keyof FarmFormData, undefined);
      }
    });
    
    const isValid = await trigger();
    return isValid;
  };

  // 设置原始文件
  const setOriginalFilesCallback = useCallback((files: FarmFile[]) => {
    setOriginalFiles(files);
  }, []);

  // 提交表单
  const submit = async (id?: string): Promise<boolean> => {
    console.log('submit - originalFiles:', originalFiles);
    
    // 预处理表单数据，将空字符串转换为 undefined
    const currentValues = getValues();
    Object.keys(currentValues).forEach(key => {
      const value = currentValues[key as keyof FarmFormData];
      if (value === '') {
        setValue(key as keyof FarmFormData, undefined);
      }
    });
    
    // 验证表单
    const isValid = await trigger();
    console.log('submit - isValid:', isValid);
    console.log('submit - errors:', formErrors);
    if (!isValid) {
      setMessage('请检查表单填写是否正确');
      setMessageType('error');
      return false;
    }

    setLoading(true);
    setMessage(null);

    // 获取表单数据
    const currentFormData = getValues();
    console.log('submit - current formData:', currentFormData);
    console.log('submit - received id:', id);

    // 将可选数值字段和enum字段的空字符串转换为 undefined
    const submitData = {
      ...currentFormData,
      // 数值字段
      pond_count: currentFormData.pond_count || undefined,
      water_area_acre: currentFormData.water_area_acre || undefined,
      farm_area_acre: currentFormData.farm_area_acre || undefined,
      other_water_area_sqm: currentFormData.other_water_area_sqm || undefined,
      other_farm_area_acre: currentFormData.other_farm_area_acre || undefined,
      avg_water_depth: currentFormData.avg_water_depth || undefined,
      output: currentFormData.output || undefined,
      output_value: currentFormData.output_value || undefined,
      total_investment: currentFormData.total_investment || undefined,
      treatment_facility_area: currentFormData.treatment_facility_area || undefined,
      treated_discharge_volume: currentFormData.treated_discharge_volume || undefined,
      // enum字段
      operation_status: currentFormData.operation_status || undefined,
      treatment_method: currentFormData.treatment_method || undefined,
      final_destination: currentFormData.final_destination || undefined,
    };
    console.log('submitData', submitData);

    try {
      let result;
      if (id) {
        result = await dataService.updateFarm(id, submitData, originalFiles);
        console.log('update', submitData);
      } else {
        console.log('add', submitData);
        result = await dataService.addFarm(submitData);
      }

      if (result) {
        toast.success('保存成功，即将返回列表');
        onSuccess?.();
        return true;
      } else {
        toast.error('保存失败，请稍后重试');
        return false;
      }
    } catch (error) {
      logger.error('useFarmForm', '保存失败:', error);
      toast.error('保存失败，请稍后重试');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 重置消息
  const resetMessage = () => {
    setMessage(null);
    setMessageType(null);
  };

  // 直接设置表单数据的方法，用于初始化或批量更新
  const setFormDataCallback = useCallback((data: Partial<FarmFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof FarmFormData, value);
    });
  }, [setValue]);

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
    setOriginalFiles: setOriginalFilesCallback,
    setFormData: setFormDataCallback,
  };
}
