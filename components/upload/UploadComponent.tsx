import { commonStyles } from '@/styles/commonStyles';
import { theme } from '@/styles/theme';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FileList } from './FileList';
import { ImageGrid } from './ImageGrid';
import { FileItem, UploadComponentProps } from './types';

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
  }
});

export function UploadComponent({ 
  onUploadComplete,
  onFileRemove,
  onProgress,
  onSuccess,
  maxFiles = 5, 
  maxFileSize = Number.MAX_VALUE,
  autoUpload = true,
  capture = false,
  disabled = false,
  uploadType = 'file', // 默认文件上传
  previewType, // 可选，不设置则根据uploadType自动决定
  initialFiles = [] // 初始文件URL数组
}: UploadComponentProps) {
  // 根据uploadType自动设置previewType
  const effectivePreviewType = previewType || (uploadType === 'image' ? 'picture' : 'list');
  // 初始化时将初始文件URL或FileInfo转换为FileItem数组
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>(() => {
    return initialFiles.map((item, index) => {
      if (typeof item === 'string') {
        // 处理字符串类型的URL
        return {
          id: `initial-${index}-${Date.now()}`,
          name: item.split('/').pop() || `file-${index}`,
          size: 0,
          type: 'image',
          uri: item,
          status: 'success'
        };
      } else {
        // 处理FileInfo类型的对象
        return {
          id: `initial-${index}-${Date.now()}`,
          name: item.name,
          size: 'size' in item && typeof item.size === 'number' ? item.size : 0,
          type: 'image',
          uri: item.url,
          status: 'success'
        };
      }
    });
  });
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileIdRef = useRef(0);

  const generateFileId = () => {
    return `file_${++fileIdRef.current}_${Date.now()}`;
  };

  const pickImage = async () => {
    if (disabled) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相册权限才能选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: !capture,
      quality: 1,
    });

    if (!result.canceled) {
      const newFiles = result.assets.map(asset => ({
        id: generateFileId(),
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        type: 'image',
        uri: asset.uri,
        status: 'ready' as const
      }));
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
        const newFiles = result.assets.map(asset => ({
          id: generateFileId(),
          name: asset.name,
          size: asset.size || 0,
          type: asset.mimeType || 'file',
          uri: asset.uri,
          status: 'ready' as const
        }));
        processNewFiles(newFiles);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const processNewFiles = (newFiles: FileItem[]) => {
    // 检查文件数量限制
    const combinedFiles = [...selectedFiles, ...newFiles];
    if (combinedFiles.length > maxFiles) {
      alert(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    // 检查文件大小限制
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      alert(`文件 ${oversizedFiles[0].name} 超过大小限制`);
      return;
    }

    setSelectedFiles(combinedFiles);

    // 调用上传完成回调，返回选择的文件
    onUploadComplete(combinedFiles);
  };

  const removeFile = (file: FileItem) => {
    if (disabled) return;
    
    // 找到要删除的文件及其索引
    const removedFileIndex = selectedFiles.findIndex(f => f.id === file.id);
    
    // 过滤掉要删除的文件
    const newFiles = selectedFiles.filter(f => f.id !== file.id);
    setSelectedFiles(newFiles);
    
    // 调用文件删除回调，传入文件和索引
    if (removedFileIndex !== -1) {
      onFileRemove?.(file, removedFileIndex);
    }
  };

  const uploadFiles = async (): Promise<FileItem[]> => {
    if (selectedFiles.length === 0 || uploading) return [];

    setUploading(true);

    try {
      // 直接返回选择的文件，上传逻辑由外部处理
      const filesToUpload = selectedFiles.filter(file => file.status === 'ready');
      
      setUploading(false);
      onUploadComplete(filesToUpload);
      return filesToUpload;
    } catch (error) {
      console.error('上传失败:', error);
      setUploading(false);
      return [];
    }
  };

  return (
    <View style={[disabled && { opacity: 1 }]}>
      {/* 根据effectivePreviewType决定渲染方式 */}
      {effectivePreviewType === 'list' ? (
        <>
          {/* 仅在非disabled状态下显示选择文件按钮 */}
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

          {/* 仅在上传类型为文件时展示已选择文件 */}
          {uploadType === 'file' && selectedFiles.length > 0 && (
            <FileList 
              files={selectedFiles} 
              disabled={disabled}
              onFileRemove={onFileRemove}
            />
          )}

          {/* 仅在上传类型为文件时展示上传按钮 */}
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
          
          {/* 仅在上传类型为文件时展示文件类型提示 */}
          {uploadType === 'file' && !disabled && (
            <Text style={[commonStyles.subtitle, { marginTop: theme.spacing.md, fontSize: 11, textAlign: 'center', color: theme.colors.text.secondary }]}>支持上传图片、PDF、Word、Excel等文件</Text>
          )}
        </>
      ) : (
        // picture模式 - 九宫格布局
        <>
          <View style={styles.container}>
            {/* 仅在上传类型为文件且非disabled状态下展示已选择文件数量 */}
            {uploadType === 'file' && !disabled && selectedFiles.length > 0 && (
              <Text style={[commonStyles.subtitle, { marginBottom: theme.spacing.sm }]}>已选择 {selectedFiles.length} 个文件</Text>
            )}
            <ImageGrid 
              files={selectedFiles}
              disabled={disabled}
              maxFiles={maxFiles}
              onAddPress={pickImage}
              onFileRemove={onFileRemove}
              onImagePress={(uri) => setPreviewImage(uri)}
            />
          </View>
          
          {/* 仅在上传类型为文件时展示上传按钮 */}
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
      
      {/* 图片预览模态框 */}
      {previewImage && (
        <Modal
          visible={true}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setPreviewImage(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            {/* 关闭按钮 */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setPreviewImage(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            
            {/* 预览图片 */}
            <View style={styles.modalContainer}>
              <Image 
                source={{ uri: previewImage }} 
                style={styles.previewImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
