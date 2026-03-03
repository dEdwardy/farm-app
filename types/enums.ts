// 生产运行情况枚举
export const OPERATION_STATUS_OPTIONS = [
  { label: '正常生产', value: '正常生产' },
  { label: '临时性停产', value: '临时性停产' },
  { label: '永久性停产', value: '永久性停产' },
];

// 尾水处理方式枚举
export const TREATMENT_METHOD_OPTIONS = [
  { label: '沉淀池', value: '沉淀池' },
  { label: '生态沟渠', value: '生态沟渠' },
  { label: '池塘鱼菜共生', value: '池塘鱼菜共生' },
  { label: '多级人工湿地', value: '多级人工湿地' },
  { label: '其他资源化利用方式', value: '其他资源化利用方式' },
];

// 养殖尾水最终去向枚举
export const FINAL_DESTINATION_OPTIONS = [
  { label: '瓜果林地', value: '瓜果林地' },
  { label: '江河湖库', value: '江河湖库' },
  { label: '农田灌溉', value: '农田灌溉' },
  { label: '其他', value: '其他' },
];
