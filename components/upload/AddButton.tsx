import { commonStyles } from '@/styles/commonStyles';
import { theme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AddButtonProps } from './types';

const styles = StyleSheet.create({
  addButton: {
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: '300'
  },
  addText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.primary,
    fontSize: 12
  }
});

export function AddButton({ onPress, uploadType }: AddButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.addButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.addIcon}>+</Text>
      {uploadType === 'file' && (
        <Text style={[commonStyles.subtitle, styles.addText, { fontWeight: '500' }]}>添加图片</Text>
      )}
    </TouchableOpacity>
  );
}
