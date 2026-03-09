import { theme } from '@/styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ImageItemProps } from './types';

export function ImageItem({ file, disabled, onRemove, onImagePress }: ImageItemProps) {
  console.log('[ImageItem] 渲染 file:', file);
  const isUploading = file.status === 'uploading';
  const [imageError, setImageError] = React.useState(false);

  const handleImagePress = () => {
    // 上传中不允许预览
    if (isUploading) return;
    onImagePress(file.uri);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={handleImagePress}
        activeOpacity={0.9}
        disabled={isUploading}
      >
        {imageError ? (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
            <MaterialIcons name="image" size={40} color="#999" />
          </View>
        ) : (
          <Image 
            source={{ uri: file.uri }} 
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            onError={() => {
              console.log('[ImageItem] 图片加载失败:', file.uri);
              setImageError(true);
            }}
          />
        )}
        {/* 上传中状态指示器 */}
        {file.status === 'uploading' && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
        
        {/* 上传进度条 */}
        {file.status === 'uploading' && file.progress !== undefined && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${file.progress}%` }]} />
          </View>
        )}
      </TouchableOpacity>
      {!disabled && onRemove && (
        <TouchableOpacity 
          onPress={() => onRemove(file)} 
          style={styles.deleteButton}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={18} color="white" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 8,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
