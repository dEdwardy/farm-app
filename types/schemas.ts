import { z } from 'zod';
import { FINAL_DESTINATION_OPTIONS, OPERATION_STATUS_OPTIONS, TREATMENT_METHOD_OPTIONS } from './enums';

// 文件信息接口
export interface FileInfo {
  url: string;
  name: string;
}

// 表单字段元数据
export interface FieldMeta {
  label: string;
  type: 'text' | 'number' | 'select' | 'switch';
  placeholder: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

// 表单字段元数据映射
export const fieldMetaMap: Record<string, FieldMeta> = {
  // 场所信息
  farm_name: {
    label: '养殖场(业主)名称',
    type: 'text',
    placeholder: '请输入养殖场(业主)名称',
    required: true,
  },
  address: {
    label: '详细地址(精确到村社)',
    type: 'text',
    placeholder: '请输入详细地址',
  },
  longitude_latitude: {
    label: '经纬度',
    type: 'text',
    placeholder: '请输入经纬度',
  },
  responsible_person: {
    label: '负责人',
    type: 'text',
    placeholder: '请输入负责人',
  },
  contact_phone: {
    label: '联系电话',
    type: 'text',
    placeholder: '请输入联系电话',
  },
  // 养殖情况
  pond_count: {
    label: '池塘口数',
    type: 'number',
    placeholder: '请输入池塘口数',
  },
  water_area_acre: {
    label: '养殖水面面积(亩)',
    type: 'number',
    placeholder: '请输入养殖水面面积',
  },
  farm_area_acre: {
    label: '养殖场占地面积(亩)',
    type: 'number',
    placeholder: '请输入养殖场占地面积',
  },
  other_water_area_sqm: {
    label: '其它养殖水面面积(平方米)',
    type: 'number',
    placeholder: '请输入其它养殖水面面积',
  },
  other_farm_area_acre: {
    label: '其它养殖占地面积(亩)',
    type: 'number',
    placeholder: '请输入其它养殖占地面积',
  },
  avg_water_depth: {
    label: '平均水深(米)',
    type: 'number',
    placeholder: '请输入平均水深',
  },
  main_species: {
    label: '主养品种',
    type: 'text',
    placeholder: '请输入主养品种',
  },
  farm_mode: {
    label: '养殖模式',
    type: 'text',
    placeholder: '请输入养殖模式',
  },
  operation_status: {
    label: '生产运行情况',
    type: 'select',
    placeholder: '请选择生产运行情况',
    options: OPERATION_STATUS_OPTIONS,
  },
  output: {
    label: '总产量（吨）',
    type: 'number',
    placeholder: '请输入总产量',
  },
  output_value: {
    label: '年总产值（万元）',
    type: 'number',
    placeholder: '请输入年总产值',
  },
  total_investment: {
    label: '年总投入（万元）',
    type: 'number',
    placeholder: '请输入年总投入',
  },
  // 尾水处理
  has_treatment_facility: {
    label: '有无尾水处理设施',
    type: 'switch',
    placeholder: '',
  },
  treatment_method: {
    label: '尾水处理方式',
    type: 'select',
    placeholder: '请选择尾水处理方式',
    options: TREATMENT_METHOD_OPTIONS,
  },
  treatment_facility_area: {
    label: '尾水处理设施面积(亩)',
    type: 'number',
    placeholder: '请输入尾水处理设施面积',
  },
  treated_discharge_volume: {
    label: '已完成尾水治理排放量(吨)',
    type: 'number',
    placeholder: '请输入已完成尾水治理排放量',
  },
  final_destination: {
    label: '养殖尾水最终去向',
    type: 'select',
    placeholder: '请选择养殖尾水最终去向',
    options: FINAL_DESTINATION_OPTIONS,
  },
};

export const farmFormSchema = z.object({
  // 场所信息
  farm_name: z.string().min(1, '请输入养殖场(业主)名称'),
  address: z.string().optional(),
  longitude_latitude: z.string().optional(),
  responsible_person: z.string().optional(),
  contact_phone: z.string().optional(),
  // 养殖情况
  pond_count: z.union([z.string(), z.undefined()]),
  water_area_acre: z.union([z.string(), z.undefined()]),
  farm_area_acre: z.union([z.string(), z.undefined()]),
  other_water_area_sqm: z.union([z.string(), z.undefined()]),
  other_farm_area_acre: z.union([z.string(), z.undefined()]),
  avg_water_depth: z.union([z.string(), z.undefined()]),
  main_species: z.string().optional(),
  farm_mode: z.string().optional(),
  operation_status: z.union([z.string(), z.null(), z.undefined()]),
  output: z.union([z.string(), z.undefined()]),
  output_value: z.union([z.string(), z.undefined()]),
  total_investment: z.union([z.string(), z.undefined()]),
  farm_images: z.array(z.object({
    url: z.string(),
    name: z.string(),
    size: z.number().optional()
  })).optional(),
  // 尾水处理
  has_treatment_facility: z.boolean().optional(),
  treatment_method: z.union([z.string(), z.null(), z.undefined()]),
  treatment_facility_area: z.union([z.string(), z.undefined()]),
  treated_discharge_volume: z.union([z.string(), z.undefined()]),
  final_destination: z.union([z.string(), z.null(), z.undefined()]),
  tail_water_images: z.array(z.object({
    url: z.string(),
    name: z.string(),
    size: z.number().optional()
  })).optional(),
  // 安全信息
  safety_info: z.array(z.object({
    url: z.string(),
    name: z.string(),
    size: z.number().optional()
  })).optional(),
});

export type FarmFormData = z.infer<typeof farmFormSchema>;
