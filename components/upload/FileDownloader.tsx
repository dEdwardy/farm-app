import { theme } from '@/styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { FileUtils } from './FileUtils';

export interface FileDownloaderProps {
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  disabled?: boolean;
  onShareComplete?: () => void;
  onShareError?: (error: Error) => void;
}

export function FileDownloader({ 
  fileUrl, 
  fileName, 
  disabled = false,
  onShareComplete,
  onShareError
}: FileDownloaderProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (disabled || sharing) return;

    setSharing(true);

    try {
      const filePath = await FileUtils.downloadFile(fileUrl, fileName);
      const success = await FileUtils.shareFile(filePath);
      
      if (success) {
        onShareComplete?.();
      } else {
        throw new Error('分享失败');
      }
    } catch (error) {
      onShareError?.(error as Error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.shareButton}
      onPress={handleShare}
      disabled={disabled || sharing}
      activeOpacity={0.7}
    >
      {sharing ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <MaterialIcons name="share" size={16} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
  },
});
