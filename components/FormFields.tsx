import { Input } from '@rneui/base';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { FINAL_DESTINATION_OPTIONS, OPERATION_STATUS_OPTIONS, TREATMENT_METHOD_OPTIONS } from '../types/enums';
import { CustomPicker } from './CustomPicker';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'switch';
  placeholder: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
}

export const formFields: FormField[] = [
  // 场所信息
  {
    name: 'farm_name',
    label: '养殖场(业主)名称',
    type: 'text',
    placeholder: '请输入养殖场(业主)名称',
    required: true,
  },
  {
    name: 'address',
    label: '详细地址(精确到村社)',
    type: 'text',
    placeholder: '请输入详细地址',
    required: true,
  },
  {
    name: 'longitude_latitude',
    label: '经纬度',
    type: 'text',
    placeholder: '请输入经纬度',
    required: false,
  },
  {
    name: 'responsible_person',
    label: '负责人',
    type: 'text',
    placeholder: '请输入负责人',
    required: true,
  },
  {
    name: 'contact_phone',
    label: '联系电话',
    type: 'text',
    placeholder: '请输入联系电话',
    required: true,
  },
  // 养殖情况
  {
    name: 'pond_count',
    label: '池塘口数',
    type: 'number',
    placeholder: '请输入池塘口数',
    required: true,
  },
  {
    name: 'water_area_acre',
    label: '养殖水面面积(亩)',
    type: 'number',
    placeholder: '请输入养殖水面面积',
    required: true,
  },
  {
    name: 'farm_area_acre',
    label: '养殖场占地面积(亩)',
    type: 'number',
    placeholder: '请输入养殖场占地面积',
    required: true,
  },
  {
    name: 'other_water_area_sqm',
    label: '其它养殖水面面积(平方米)',
    type: 'number',
    placeholder: '请输入其它养殖水面面积',
    required: true,
  },
  {
    name: 'other_farm_area_acre',
    label: '其它养殖占地面积(亩)',
    type: 'number',
    placeholder: '请输入其它养殖占地面积',
    required: true,
  },
  {
    name: 'avg_water_depth',
    label: '平均水深(米)',
    type: 'number',
    placeholder: '请输入平均水深',
    required: true,
  },
  {
    name: 'main_species',
    label: '主养品种',
    type: 'text',
    placeholder: '请输入主养品种',
    required: true,
  },
  {
    name: 'farm_mode',
    label: '养殖模式',
    type: 'text',
    placeholder: '请输入养殖模式',
    required: true,
  },
  {
    name: 'operation_status',
    label: '生产运行情况',
    type: 'select',
    placeholder: '请选择生产运行情况',
    required: true,
    options: OPERATION_STATUS_OPTIONS,
  },
  {
    name: 'output',
    label: '总产量（吨）',
    type: 'number',
    placeholder: '请输入总产量',
    required: false,
  },
  {
    name: 'output_value',
    label: '年总产值（万元）',
    type: 'number',
    placeholder: '请输入年总产值',
    required: false,
  },
  {
    name: 'total_investment',
    label: '年总投入（万元）',
    type: 'number',
    placeholder: '请输入年总投入',
    required: false,
  },
  // 尾水处理
  {
    name: 'has_treatment_facility',
    label: '有无尾水处理设施',
    type: 'switch',
    placeholder: '',
    required: true,
  },
  {
    name: 'treatment_method',
    label: '尾水处理方式',
    type: 'select',
    placeholder: '请选择尾水处理方式',
    required: true,
    options: TREATMENT_METHOD_OPTIONS,
  },
  {
    name: 'treatment_facility_area',
    label: '尾水处理设施面积(亩)',
    type: 'number',
    placeholder: '请输入尾水处理设施面积',
    required: true,
  },
  {
    name: 'treated_discharge_volume',
    label: '已完成尾水治理排放量(吨)',
    type: 'number',
    placeholder: '请输入已完成尾水治理排放量',
    required: true,
  },
  {
    name: 'final_destination',
    label: '养殖尾水最终去向',
    type: 'select',
    placeholder: '请选择养殖尾水最终去向',
    required: true,
    options: FINAL_DESTINATION_OPTIONS,
  },
];



export const renderFormField = (
  field: FormField,
  value: any,
  onChange: (name: string, value: any) => void,
  error: string | undefined,
  disabled: boolean = false
) => {
  switch (field.type) {
    case 'text':
    case 'number':
      return (
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{field.label}</Text>
            {field.required && <Text style={styles.requiredMark}>*</Text>}
          </View>
          <Input
                value={value}
                onChangeText={(text) => onChange(field.name, text)}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                containerStyle={styles.inputBox}
                inputStyle={styles.inputText}
                errorMessage={error}
                disabled={disabled}
              />
        </View>
      );
    case 'select':
      return (
        <CustomPicker
          label={field.label}
          value={value}
          placeholder={field.placeholder}
          options={field.options || []}
          onChange={(val: string) => onChange(field.name, val)}
          error={error}
          disabled={disabled}
          required={field.required}
        />
      );
    case 'switch':
      return (
        <View style={styles.inputContainer}>
          <View style={styles.switchContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{field.label}</Text>
              {field.required && <Text style={styles.requiredMark}>*</Text>}
            </View>
            <Switch
              value={value}
              onValueChange={(val) => onChange(field.name, val)}
              disabled={disabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  requiredMark: {
    color: '#FF5722',
    marginLeft: 4,
    fontSize: 14,
  },
  inputBox: {
    width: '100%',
    padding: 0,
  },
  inputText: {
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  errorText: {
    fontSize: 14,
    color: '#FF5722',
    marginTop: 4,
  },
});
