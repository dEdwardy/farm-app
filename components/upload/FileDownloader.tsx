import { theme } from '@/styles/theme';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FileUtils } from './FileUtils';

export interface FileDownloaderProps {
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  disabled?: boolean;
  onDownloadComplete?: (filePath: string) => void;
  onDownloadError?: (error: Error) => void;
  onShareComplete?: () => void;
  onShareError?: (error: Error) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadButton: {
    backgroundColor: theme.colors.primary,
  },
  shareButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonError: {
    backgroundColor: theme.colors.error,
  },
  icon: {
    fontSize: 18,
  },
  progressContainer: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
  },
  tooltip: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  loadingIndicator: {
    width: 20,
    height: 20,
  },
});

export function FileDownloader({ 
  fileUrl, 
  fileName, 
  fileSize,
  disabled = false,
  onDownloadComplete,
  onDownloadError,
  onShareComplete,
  onShareError
}: FileDownloaderProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const handleDownload = async () => {
    if (disabled || downloading) return;

    setDownloading(true);
    setProgress(0);
    setDownloadError(null);

    try {
      const filePath = await FileUtils.downloadFile(
        fileUrl,
        fileName,
        {
          progressInterval: 100,
          onProgress: (downloadProgress) => {
            const progressValue = Math.round(
              (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
            );
            setProgress(progressValue);
          },
        }
      );

      onDownloadComplete?.(filePath);
    } catch (error) {
      console.error('下载失败:', error);
      setDownloadError('下载失败');
      onDownloadError?.(error as Error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (disabled || sharing) return;

    setSharing(true);
    setShareError(null);

    try {
      // 先下载文件再分享
      const filePath = await FileUtils.downloadFile(fileUrl, fileName);
      const success = await FileUtils.shareFile(filePath);
      
      if (success) {
        onShareComplete?.();
      } else {
        throw new Error('分享失败');
      }
    } catch (error) {
      console.error('分享失败:', error);
      setShareError('分享失败');
      onShareError?.(error as Error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 下载按钮 */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.downloadButton,
          disabled && styles.buttonDisabled,
          downloadError && styles.buttonError,
        ]}
        onPress={handleDownload}
        disabled={disabled || downloading}
        activeOpacity={0.7}
        onLongPress={() => setShowDownloadTooltip(true)}
        onPressOut={() => setShowDownloadTooltip(false)}
      >
        {downloading ? (
          <ActivityIndicator 
            size="small" 
            color="white" 
            style={styles.loadingIndicator} 
          />
        ) : downloadError ? (
          <Text style={[styles.icon, { color: 'white' }]}>❌</Text>
        ) : (
          <Text style={[styles.icon, { color: 'white' }]}>📥</Text>
        )}
        {downloading && progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
        {showDownloadTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>下载</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 分享按钮 */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.shareButton,
          disabled && styles.buttonDisabled,
          shareError && styles.buttonError,
        ]}
        onPress={handleShare}
        disabled={disabled || sharing}
        activeOpacity={0.7}
        onLongPress={() => setShowShareTooltip(true)}
        onPressOut={() => setShowShareTooltip(false)}
      >
        {sharing ? (
          <ActivityIndicator 
            size="small" 
            color="white" 
            style={styles.loadingIndicator} 
          />
        ) : shareError ? (
          <Text style={[styles.icon, { color: 'white' }]}>❌</Text>
        ) : (
          <Text style={[styles.icon, { color: 'white' }]}>📤</Text>
        )}
        {showShareTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>分享</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
