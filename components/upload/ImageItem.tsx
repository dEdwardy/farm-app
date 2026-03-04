import { theme } from '@/styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FileDownloader } from './FileDownloader';
import { ImageItemProps } from './types';

export function ImageItem({ file, disabled, onRemove, onImagePress }: ImageItemProps) {
  const isUploaded = file.status === 'success' && file.uri.startsWith('http');
  const showShare = disabled && isUploaded;

  return (
    <>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => onImagePress(file.uri)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: file.uri }} 
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
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
      {file.status === 'success' && !showShare && (
        <View style={styles.statusIndicator}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
        </View>
      )}
      {file.status === 'error' && (
        <View style={styles.statusIndicator}>
          <MaterialIcons name="error" size={24} color={theme.colors.error} />
        </View>
      )}
      {showShare && (
        <View style={styles.shareButtonContainer}>
          <FileDownloader
            fileUrl={file.uri}
            fileName={file.name}
            fileSize={file.size}
          />
        </View>
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
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  shareButtonContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  }
});
