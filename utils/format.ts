// 格式化显示值，无数据时显示 "-"
export const formatDisplayValue = (
  value: string | number | boolean | undefined | null,
  defaultValue: string = '-'
): string => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return String(value);
};

// 格式化带单位的显示值，无数据时显示 "-"
export const formatValueWithUnit = (
  value: string | number | undefined | null,
  unit: string
): string => {
  if (value === undefined || value === null || value === '') {
    return '-';
  }
  return `${value} ${unit}`;
};

// 格式化电话号码（隐私保护）
export const formatPhone = (phone?: string): string => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};