import { theme } from '@/styles/theme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ImageItemProps } from './types';

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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successIndicator: {
    backgroundColor: 'rgba(40, 167, 69, 0.95)'
  },
  errorIndicator: {
    backgroundColor: 'rgba(220, 53, 69, 0.95)'
  },
  statusIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  }
});

export function ImageItem({ file, disabled, onRemove, onImagePress }: ImageItemProps) {
  return (
    <>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => onImagePress(file.uri)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: file.uri }} 
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
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
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      )}
      {file.status === 'success' && (
        <View style={[styles.statusIndicator, styles.successIndicator]}>
          <Text style={styles.statusIcon}>✓</Text>
        </View>
      )}
      {file.status === 'error' && (
        <View style={[styles.statusIndicator, styles.errorIndicator]}>
          <Text style={styles.statusIcon}>✕</Text>
        </View>
      )}
    </>
  );
}
