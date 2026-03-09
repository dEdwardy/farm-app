import React from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { fieldMetaMap } from '../types/schemas';
import { CustomPicker } from './CustomPicker';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'switch';
  placeholder: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

export const formFields: FormField[] = Object.keys(fieldMetaMap).map((key) => {
  const meta = fieldMetaMap[key];
  
  return {
    name: key,
    label: meta.label,
    type: meta.type,
    placeholder: meta.placeholder,
    required: meta.required || false,
    options: meta.options,
  };
});

export const renderFormField = (
  field: FormField,
  value: string | boolean | any,
  onChange: (name: string, value: string | boolean | any) => void,
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
          <TextInput
            value={String(value || '')}
            onChangeText={(text: string) => onChange(field.name, text)}
            placeholder={field.placeholder}
            placeholderTextColor="#999"
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            style={[styles.inputBox, error ? styles.inputError : null]}
            editable={!disabled}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      );
    case 'select':
      return (
        <CustomPicker
          label={field.label}
          value={String(value || '')}
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
              value={Boolean(value)}
              onValueChange={(val) => onChange(field.name, val)}
              disabled={disabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={Boolean(value) ? '#FFFFFF' : '#F4F3F4'}
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
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF5722',
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
