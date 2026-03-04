import { z } from 'zod';

// 文件信息接口
export interface FileInfo {
  url: string;
  name: string;
}

export const farmFormSchema = z.object({
  // 场所信息
  farm_name: z.string().min(1, '请输入养殖场(业主)名称'),
  address: z.string().min(1, '请输入详细地址'),
  longitude_latitude: z.string().optional(),
  responsible_person: z.string().min(1, '请输入负责人'),
  contact_phone: z.string().min(1, '请输入联系电话'),
  // 养殖情况
  pond_count: z.string().min(1, '请输入池塘口数'),
  water_area_acre: z.string().min(1, '请输入养殖水面面积'),
  farm_area_acre: z.string().min(1, '请输入养殖场占地面积'),
  other_water_area_sqm: z.string().min(1, '请输入其它养殖水面面积'),
  other_farm_area_acre: z.string().min(1, '请输入其它养殖占地面积'),
  avg_water_depth: z.string().min(1, '请输入平均水深'),
  main_species: z.string().min(1, '请输入主养品种'),
  farm_mode: z.string().min(1, '请输入养殖模式'),
  operation_status: z.string().min(1, '请选择生产运行情况'),
  output: z.string().optional(),
  output_value: z.string().optional(),
  total_investment: z.string().optional(),
  farm_images: z.array(z.object({
    url: z.string(),
    name: z.string(),
    size: z.number().optional()
  })).optional(),
  // 尾水处理
  has_treatment_facility: z.boolean(),
  treatment_method: z.string().min(1, '请选择尾水处理方式'),
  treatment_facility_area: z.string().min(1, '请输入尾水处理设施面积'),
  treated_discharge_volume: z.string().min(1, '请输入已完成尾水治理排放量'),
  final_destination: z.string().min(1, '请选择养殖尾水最终去向'),
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
