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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
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
    default:
      return null;
  }
};

export function FileItemComponent({ file, disabled, loading, onRemove }: FileItemProps) {
  const isUploading = file.status === 'uploading';

  return (
    <TouchableOpacity 
      style={styles.fileItem}
      activeOpacity={0.7}
    >
      {getFileIcon(file.type)}
      <View style={styles.fileInfo}>
        <Text style={[commonStyles.bodyText, { fontWeight: '500' }]} numberOfLines={1} ellipsizeMode="middle">{file.name}</Text>
        <View style={styles.fileMeta}>
          <Text style={[commonStyles.subtitle, { fontSize: 12 }]}>{Math.round(file.size / 1024)} KB</Text>
          {file.status === 'uploading' && file.progress !== undefined && (
            <Text style={[commonStyles.subtitle, { marginLeft: theme.spacing.md, color: theme.colors.primary, fontSize: 12 }]}>上传中 {file.progress}%</Text>
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
