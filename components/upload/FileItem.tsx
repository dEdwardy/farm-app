import { commonStyles } from '@/styles/commonStyles';
import { theme } from '@/styles/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FileItemProps } from './types';

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider
  },
  fileInfo: {
    flex: 1
  },
  fileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  removeButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  removeIcon: {
    fontSize: 18,
    color: theme.colors.error,
    fontWeight: '600'
  }
});

const getFileIcon = (type: string) => {
  const icon = type.includes('image') ? '🖼️' : 
              type.includes('pdf') ? '📄' : 
              type.includes('word') || type.includes('doc') ? '📃' : 
              type.includes('excel') || type.includes('xlsx') ? '📊' : '📁';
  return <Text style={{ fontSize: 24, color: theme.colors.primary, marginRight: theme.spacing.md }}>{icon}</Text>;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'uploading':
      return <ActivityIndicator size="small" color={theme.colors.primary} />;
    case 'success':
      return <Text style={{ fontSize: 16, color: theme.colors.success, marginLeft: theme.spacing.sm }}>✓</Text>;
    case 'error':
      return <Text style={{ fontSize: 16, color: theme.colors.error, marginLeft: theme.spacing.sm }}>✕</Text>;
    default:
      return null;
  }
};

export function FileItemComponent({ file, disabled, onRemove }: FileItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.fileItem, file.status === 'error' ? { backgroundColor: 'rgba(220, 53, 69, 0.05)' } : {}]}
      activeOpacity={0.7}
    >
      {getFileIcon(file.type)}
      <View style={styles.fileInfo}>
        <Text style={[commonStyles.bodyText, { fontWeight: '500' }]} numberOfLines={1}>{file.name}</Text>
        <View style={styles.fileMeta}>
          <Text style={[commonStyles.subtitle, { fontSize: 12 }]}>{Math.round(file.size / 1024)} KB</Text>
          {file.status === 'uploading' && file.progress !== undefined && (
            <Text style={[commonStyles.subtitle, { marginLeft: theme.spacing.md, color: theme.colors.primary, fontSize: 12 }]}>上传中 {file.progress}%</Text>
          )}
          {file.status === 'success' && (
            <Text style={[commonStyles.subtitle, { marginLeft: theme.spacing.md, color: theme.colors.success, fontWeight: '500', fontSize: 12 }]}>上传成功</Text>
          )}
          {file.status === 'error' && (
            <Text style={[commonStyles.subtitle, { marginLeft: theme.spacing.md, color: theme.colors.error, fontWeight: '500', fontSize: 12 }]}>上传失败</Text>
          )}
        </View>
      </View>
      <View style={styles.statusContainer}>
        {getStatusIcon(file.status)}
        {!disabled && onRemove && (
          <TouchableOpacity 
            onPress={() => onRemove(file)} 
            style={styles.removeButton}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
