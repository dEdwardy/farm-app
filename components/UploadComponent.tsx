import { commonStyles } from '@/styles/commonStyles';
import { theme } from '@/styles/theme';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  status: 'ready' | 'uploading' | 'success' | 'error';
  progress?: number;
}

// 文件信息接口
export interface FileInfo {
  url: string;
  name: string;
  size?: number;
}

interface UploadComponentProps {
  onUploadComplete: (files: FileItem[]) => void;
  onFileRemove?: (file: FileItem, index: number) => void;
  onProgress?: (file: FileItem, progress: number) => void;
  onSuccess?: (file: FileItem) => void;
  maxFiles?: number;
  maxFileSize?: number; // 单位：字节
  autoUpload?: boolean;
  capture?: boolean;
  disabled?: boolean;
  uploadType?: 'image' | 'file'; // image: 图片上传, file: 文件上传
  previewType?: 'list' | 'picture'; // list: 列表模式, picture: 九宫格模式
  initialFiles?: (string | FileInfo)[]; // 初始文件URL数组或FileInfo数组
}

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
  fileList: {
    maxHeight: 240,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden'
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider
  },
  fileItemHover: {
    backgroundColor: 'rgba(25, 118, 210, 0.05)'
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
  removeButtonHover: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  removeIcon: {
    fontSize: 18,
    color: theme.colors.error,
    fontWeight: '600'
  },
  uploadButton: {
    marginTop: theme.spacing.lg
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
  },
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
  },
  addButton: {
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonHover: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(25, 118, 210, 0.05)'
  },
  addIcon: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: '300'
  },
  addText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.primary,
    fontSize: 12
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
      const newFiles = result.assets.map(asset => {
        const item = {
          id: generateFileId(),
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          type: 'image',
          uri: asset.uri,
          status: 'ready' as const,
        }
        return item
      });
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

  const removeFile = (id: string) => {
    if (disabled) return;

    // 找到要删除的文件及其索引
    const removedFileIndex = selectedFiles.findIndex(file => file.id === id);
    const removedFile = selectedFiles[removedFileIndex];

    // 过滤掉要删除的文件
    const newFiles = selectedFiles.filter(file => file.id !== id);
    setSelectedFiles(newFiles);

    // 调用文件删除回调，传入文件和索引
    if (removedFile) {
      onFileRemove?.(removedFile, removedFileIndex);
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
          {uploadType === 'file' && (
            <View style={styles.container}>
              {/* 仅在非disabled状态下展示文案 */}
              {!disabled && (
                <Text style={[commonStyles.subtitle, { marginBottom: theme.spacing.sm, fontWeight: '500' }]}>已选择 {selectedFiles.length} 个文件</Text>
              )}
              {selectedFiles.length > 0 && (
                <ScrollView style={[styles.fileList, { borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border }]}>
                  {selectedFiles.map((file) => (
                    <TouchableOpacity
                      key={file.id}
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
                        {!disabled && (
                          <TouchableOpacity
                            onPress={() => removeFile(file.id)}
                            style={[styles.removeButton, { padding: theme.spacing.sm }]}
                            disabled={disabled}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.removeIcon}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
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
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,
                  elevation: 5,
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
          {uploadType === 'file' && (
            <Text style={[commonStyles.subtitle, { marginTop: theme.spacing.md, fontSize: 11, textAlign: 'center', color: theme.colors.text.secondary }]}>支持上传图片、PDF、Word、Excel等文件</Text>
          )}
        </>
      ) : (
        // picture模式 - 九宫格布局
        <>
          <View style={styles.container}>
            {/* 仅在上传类型为文件且非disabled状态下展示已选择文件数量 */}
            {uploadType === 'file' && !disabled && (
              <Text style={[commonStyles.subtitle, { marginBottom: theme.spacing.sm }]}>已选择 {selectedFiles.length} 个文件</Text>
            )}
            <View style={styles.gridContainer}>
              {/* 已选择的图片 */}
              {selectedFiles.map((file) => (
                <View
                  key={file.id}
                  style={styles.gridItem}
                >
                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => setPreviewImage(file.uri)}
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
                  {!disabled && (
                    <TouchableOpacity
                      onPress={() => removeFile(file.id)}
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
                </View>
              ))}

              {/* 添加按钮 */}
              {selectedFiles.length < maxFiles && !disabled && (
                <View style={styles.gridItem}>
                  <TouchableOpacity
                    style={[styles.addButton]}
                    onPress={pickImage}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addIcon}>+</Text>
                    {uploadType === 'file' && (
                      <Text style={[commonStyles.subtitle, styles.addText, { fontWeight: '500' }]}>添加图片</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* 仅在上传类型为文件时展示上传按钮 */}
          {uploadType === 'file' && !autoUpload && selectedFiles.length > 0 && (
            <TouchableOpacity
              style={[
                commonStyles.primaryButton,
                styles.uploadButton,
                (uploading || disabled) && { opacity: 0.6 }
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
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
              onPress={() => setPreviewImage(null)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
            {/* 预览图片 */}
            <Image
              resizeMode="contain"
              source={{ uri: previewImage }}
              style={{ flex: 1, width: '100%', height: '100%' }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}
