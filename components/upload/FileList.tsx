import { commonStyles } from '@/styles/commonStyles';
import { theme } from '@/styles/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FileItemComponent } from './FileItem';
import { FileItem, FileListProps } from './types';

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md
  },
  fileList: {
    maxHeight: 400,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  }
});

export function FileList({ files, disabled, loading, onFileRemove }: FileListProps) {
  return (
    <View style={styles.container}>
      {/* 仅在非disabled状态下展示文案 */}
      {!disabled && files.length > 0 && (
        <Text style={[commonStyles.subtitle, { marginBottom: theme.spacing.sm, fontWeight: '500' }]}>已选择 {files.length} 个文件</Text>
      )}
      <ScrollView style={styles.fileList}>
        {files.map((file, index) => (
          <FileItemComponent 
            key={file.id} 
            file={file} 
            disabled={disabled}
            loading={loading}
            onRemove={(removedFile: FileItem) => onFileRemove?.(removedFile, index)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
