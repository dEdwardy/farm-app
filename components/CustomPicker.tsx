import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, FlatList, Pressable } from 'react-native';

interface CustomPickerProps {
  label: string;
  value: string;
  placeholder: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  disabled = false,
  required = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // 获取当前选中的选项
  const selectedOption = options.find(option => option.value === value);
  
  // 处理选择
  const handleSelect = (val: string) => {
    onChange(val);
    setIsVisible(false);
  };
  
  // 渲染选项项
  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={[styles.optionItem, value === item.value && styles.selectedOptionItem]}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={[styles.optionText, value === item.value && styles.selectedOptionText]}>
        {item.label}
      </Text>
      {value === item.value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredMark}>*</Text>}
      </View>
      <TouchableOpacity
        style={[styles.selectContainer, disabled && styles.disabledSelect, error && styles.selectError]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>{label}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsVisible(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
  },
  requiredMark: {
    color: '#dc3545',
    marginLeft: 4,
    fontSize: 14,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  disabledSelect: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  selectError: {
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '85%',
    borderRadius: 12,
    padding: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  pickerContainer: {
    padding: 0,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOptionItem: {
    backgroundColor: '#f5f9ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: '500',
    color: '#1976d2',
  },
  checkmark: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
    marginLeft: 4,
  },
});
