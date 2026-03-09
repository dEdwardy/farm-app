import { theme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AddButton } from './AddButton';
import { ImageItem } from './ImageItem';
import { FileItem, ImageGridProps } from './types';

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
    marginHorizontal: -theme.spacing.xs
  },
  gridItem: {
    width: '33.33%',
    padding: theme.spacing.xs,
    position: 'relative'
  }
});

export function ImageGrid({ files, disabled, loading, maxFiles, onAddPress, onFileRemove, onImagePress }: ImageGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {/* 已选择的图片 */}
        {files.map((file, index) => (
          <View key={file.id} style={styles.gridItem}>
            <ImageItem 
              file={file} 
              disabled={disabled}
              loading={loading}
              onRemove={(removedFile: FileItem) => onFileRemove?.(removedFile, index)}
              onImagePress={onImagePress}
            />
          </View>
        ))}
        
        {/* 添加按钮 */}
        {files.length < maxFiles && !disabled && (
          <View style={styles.gridItem}>
            <AddButton onPress={onAddPress} uploadType="image" />
          </View>
        )}
      </View>
    </View>
  );
}
