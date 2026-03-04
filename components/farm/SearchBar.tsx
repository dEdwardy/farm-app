import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import { indexStyles } from '@/styles/indexStyles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = '输入养殖场名称或地址...',
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChangeText = useCallback((text: string) => {
    setLocalValue(text);
    onChangeText(text);
  }, [onChangeText]);

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <View style={indexStyles.searchSection}>
      <View style={indexStyles.searchBar}>
        <View style={indexStyles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#999" style={indexStyles.searchIcon} />
          <TextInput
            value={localValue}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder}
            style={indexStyles.searchInput}
            placeholderTextColor="#999"
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={indexStyles.searchButton} onPress={handleSubmit}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
