import { commonStyles } from '@/styles/commonStyles';
import { theme } from '@/styles/theme';
import { logger } from '@/utils/logger';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FileDownloader } from './FileDownloader';
import { FileList } from './FileList';
import { ImageGrid } from './ImageGrid';
import type { FileInfo, FileItem, UploadComponentProps } from './types';

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    fontSize: 20,
    marginRight: 12
  },
  uploadButton: {
    marginTop: theme.spacing.lg
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5.46,
    elevation: 10,
    zIndex: 1000,
  },
  closeIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold'
  },
  previewImage: {
    width: '95%',
    height: '85%',
    borderRadius: theme.borderRadius.md
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 999,
  },
  downloadButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  }
});

export function UploadComponent({ 
  onUploadComplete,
  onFileRemove,
  onProgress,
  onSuccess,
  onFileStatusChange,
  maxFiles = Number.MAX_VALUE, 
  maxFileSize = Number.MAX_VALUE,
  autoUpload = true,
  capture = false,
  disabled = false,
  loading = false,
  uploadType = 'file',
  previewType,
  initialFiles = []
}: UploadComponentProps) {
  logger.debug('UploadComponent', '初始化，initialFiles:', initialFiles);
  
  const effectivePreviewType = previewType || (uploadType === 'image' ? 'picture' : 'list');
  
  // 使用 ref 标记是否已初始化
  const initializedRef = useRef(false);
  
  // 处理 initialFiles 为 FileItem 的辅助函数
  const processInitialFiles = (files: (string | FileInfo)[]) => {
    logger.debug('UploadComponent', '处理 initialFiles，数量:', files.length);
    const processed = files.map((item: string | FileInfo, index: number) => {
      if (typeof item === 'string') {
        return {
          id: `initial-${index}`,
          name: item.split('/').pop() || `file-${index}`,
          size: 0,
          type: 'image',
          uri: item,
          status: 'success' as const
        };
      } else {
        return {
          id: `initial-${index}`,
          name: item.name,
          size: item.size || 0,
          type: 'image',
          uri: item.url,
          status: 'success' as const
        };
      }
    });
    logger.debug('UploadComponent', '最终 selectedFiles:', processed);
    return processed;
  };
  
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>(() => {
    const processed = processInitialFiles(initialFiles);
    return processed;
  });
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileIdRef = useRef(0);
  
  // 只在第一次初始化时使用 initialFiles，之后不再监听
  React.useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  }, []);

  const generateFileId = () => {
    return `file_${++fileIdRef.current}_${Date.now()}`;
  };

  const pickImage = async () => {
    if (disabled) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相册权限才能选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: !capture,
      quality: 1,
    });

    if (!result.canceled) {
      const newFiles: FileItem[] = [];
      
      for (const asset of result.assets) {
        const fileItem: FileItem = {
          id: generateFileId(),
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          type: 'image',
          uri: asset.uri,
          status: 'ready' as const,
        };
        newFiles.push(fileItem);
      }

      processNewFiles(newFiles);
    }
  };

  const pickDocument = async () => {
    if (disabled) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/*'],
      });

      if (!result.canceled) {
        const newFiles: FileItem[] = [];
        
        for (const asset of result.assets) {
          const fileItem: FileItem = {
            id: generateFileId(),
            name: asset.name,
            size: asset.size || 0,
            type: asset.mimeType || 'file',
            uri: asset.uri,
            status: 'ready' as const,
          };
          newFiles.push(fileItem);
        }

        processNewFiles(newFiles);
      }
    } catch {
      // 忽略错误
    }
  };

  const processNewFiles = (newFiles: FileItem[]) => {
    const combinedFiles = [...selectedFiles, ...newFiles];
    if (combinedFiles.length > maxFiles) {
      Alert.alert(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      Alert.alert(`文件 ${oversizedFiles[0].name} 超过大小限制`);
      return;
    }

    setSelectedFiles(combinedFiles);
    // 传递handleFileStatusChange给父组件，用于更新文件状态
    onUploadComplete(combinedFiles, handleFileStatusChange);
  };

  const removeFile = (file: FileItem, index?: number) => {
    if (disabled) return;

    const removedFileIndex = index !== undefined ? index : selectedFiles.findIndex(f => f.id === file.id);
    const newFiles = selectedFiles.filter(f => f.id !== file.id);
    
    setSelectedFiles(newFiles);
    
    if (removedFileIndex !== -1) {
      onFileRemove?.(file, removedFileIndex);
    }
  };

  // 处理文件状态变更
  const handleFileStatusChange = (fileId: string, status: FileItem['status'], progress?: number) => {
    setSelectedFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId 
          ? { ...file, status, progress: progress !== undefined ? progress : file.progress }
          : file
      )
    );
    onFileStatusChange?.(fileId, status, progress);
  };

  const uploadFiles = async (): Promise<FileItem[]> => {
    if (selectedFiles.length === 0 || uploading) return [];

    setUploading(true);

    try {
      const filesToUpload = selectedFiles.filter(file => file.status === 'ready');
      
      setUploading(false);
      // 传递handleFileStatusChange给父组件，用于更新文件状态
      onUploadComplete(filesToUpload, handleFileStatusChange);
      return filesToUpload;
    } catch {
      setUploading(false);
      return [];
    }
  };

  const getPreviewFile = () => {
    if (!previewImage) return null;
    return selectedFiles.find(f => f.uri === previewImage);
  };

  return (
    <View style={[disabled && { opacity: 1 }]}>
      {effectivePreviewType === 'list' ? (
        <>
          {!disabled && (
            <View style={styles.container}>
              <TouchableOpacity
                style={[
                  commonStyles.primaryButton, 
                  {
                    borderRadius: theme.borderRadius.md,
                    paddingVertical: theme.spacing.md,
                    backgroundColor: theme.colors.primary,
                  }
                ]}
                onPress={pickDocument}
                activeOpacity={0.8}
              >
                <View style={styles.buttonRow}>
                  <Text style={[styles.iconText, { color: 'white' }]}>📄</Text>
                  <Text style={[commonStyles.buttonText, { fontSize: 16, fontWeight: '600' }]}>选择文件</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {uploadType === 'file' && selectedFiles.length > 0 && (
            <FileList 
              files={selectedFiles} 
              disabled={disabled}
              loading={loading || uploading}
              onFileRemove={removeFile}
            />
          )}

          {uploadType === 'file' && !autoUpload && (
            <TouchableOpacity
              style={[
                commonStyles.primaryButton, 
                styles.uploadButton, 
                (selectedFiles.length === 0 || uploading || disabled) && { opacity: 0.6 },
                {
                  borderRadius: theme.borderRadius.md,
                  paddingVertical: theme.spacing.md,
                  backgroundColor: theme.colors.primary,
                }
              ]}
              onPress={uploadFiles}
              disabled={selectedFiles.length === 0 || uploading || disabled}
              activeOpacity={0.8}
            >
              <View style={styles.buttonRow}>
                {uploading ? (
                  <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
                ) : (
                  <Text style={[styles.iconText, { color: 'white' }]}>☁️</Text>
                )}
                <Text style={[commonStyles.buttonText, { fontWeight: '600', fontSize: 16 }]}>{uploading ? '上传中...' : '上传文件'}</Text>
              </View>
            </TouchableOpacity>
          )}
          
          {uploadType === 'file' && !disabled && (
            <Text style={[commonStyles.subtitle, { marginTop: theme.spacing.md, fontSize: 11, textAlign: 'center', color: theme.colors.text.secondary }]}>支持上传图片、PDF、Word、Excel等文件</Text>
          )}
        </>
      ) : (
        <>
          <View style={styles.container}>
            {uploadType === 'file' && !disabled && selectedFiles.length > 0 && (
              <Text style={[commonStyles.subtitle, { marginBottom: theme.spacing.sm }]}>已选择 {selectedFiles.length} 个文件</Text>
            )}
            <ImageGrid 
              files={selectedFiles}
              disabled={disabled}
              loading={loading || uploading}
              maxFiles={maxFiles}
              onAddPress={pickImage}
              onFileRemove={removeFile}
              onImagePress={(uri) => setPreviewImage(uri)}
            />
          </View>
          
          {uploadType === 'file' && !autoUpload && selectedFiles.length > 0 && (
            <TouchableOpacity
              style={[
                commonStyles.primaryButton, 
                styles.uploadButton, 
                (uploading || disabled) && { opacity: 0.6 },
                {
                  backgroundColor: theme.colors.primary,
                }
              ]}
              onPress={uploadFiles}
              disabled={uploading || disabled}
              activeOpacity={0.8}
            >
              <View style={styles.buttonRow}>
                {uploading ? (
                  <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
                ) : (
                  <Text style={[styles.iconText, { color: 'white' }]}>☁️</Text>
                )}
                <Text style={[commonStyles.buttonText, { fontWeight: '600' }]}>{uploading ? '上传中...' : '上传文件'}</Text>
              </View>
            </TouchableOpacity>
          )}
        </>
      )}
      
      {previewImage && (
        <Modal
          visible={true}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setPreviewImage(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setPreviewImage(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.modalContainer}>
              <Image 
                source={{ uri: previewImage }} 
                style={styles.previewImage}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </View>

            {disabled && getPreviewFile() && (
              <View style={styles.downloadButtonContainer}>
                <FileDownloader
                  fileUrl={previewImage}
                  fileName={getPreviewFile()!.name}
                  fileSize={getPreviewFile()!.size}
                />
              </View>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
}
