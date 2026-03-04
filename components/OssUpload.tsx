import { getOssPresignedUrl } from '@/services/ossService';
import { getContentTypeByExtension, getFileUrl } from '@/utils/fileUtils';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import React, { useState } from 'react';
import { UploadComponent } from './upload';
import { FileInfo, FileItem } from './upload/types';

interface OssUploadProps {
  onUploadComplete: (files: { url: string; name: string; size: number }[]) => void;
  onFileRemove?: (file: { url: string; name: string; size: number }, index: number) => void;
  onUploading?: (uploading: boolean) => void;
  maxFiles?: number;
  maxFileSize?: number;
  autoUpload?: boolean;
  capture?: boolean;
  disabled?: boolean;
  uploadType?: 'image' | 'file';
  previewType?: 'list' | 'picture';
  initialFiles?: (string | FileInfo)[];
  loading?: boolean;
}

export function OssUpload({ 
  onUploadComplete,
  onFileRemove,
  onUploading,
  maxFiles = 5, 
  maxFileSize = Number.MAX_VALUE,
  autoUpload = true,
  capture = false,
  disabled = false,
  uploadType = 'file',
  previewType,
  initialFiles = [],
  loading = false
}: OssUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUploadComplete = async (files: FileItem[]) => {
    if (loading) return;
    
    const filesToUpload = files.filter(file => file.status === 'ready');
    
    if (filesToUpload.length === 0) {
      const currentFiles = files.map(file => ({
        url: file.uri,
        name: file.name,
        size: file.size
      }));
      onUploadComplete(currentFiles);
      return;
    }

    setUploading(true);
    onUploading?.(true);

    try {
      const uploadedFiles: { url: string; name: string; size: number }[] = [];
      
      for (const file of filesToUpload) {
        const fileName = file.name;
        const fileType = getContentTypeByExtension(fileName);
        
        const presignedResult = await getOssPresignedUrl(fileName, fileType);
        
        if (!presignedResult || !presignedResult.uploadUrl) {
          throw new Error('获取预签名URL失败');
        }
        
        const { uploadUrl } = presignedResult;
        console.log('uploadUrl:', uploadUrl,file.uri,file.name,file.size);
        const uploadResult = await uploadAsync(uploadUrl, file.uri, {
          httpMethod: 'PUT',
          uploadType: FileSystemUploadType.BINARY_CONTENT,
          // headers: {
          //   'Content-Type': fileType,
          // },
        });
        
        if (uploadResult && (uploadResult.status === 200 || uploadResult.status === 204)) {
          const fileUrl = getFileUrl(uploadUrl);
          uploadedFiles.push({ url: fileUrl, name: fileName, size: file.size });
        } else {
          throw new Error(`上传失败: HTTP ${uploadResult?.status || 'unknown'}`);
        }
      }
      
      const existingFiles = files
        .filter(file => file.status === 'success')
        .map(file => ({ url: file.uri, name: file.name, size: file.size }));
      
      const allFiles = [...existingFiles, ...uploadedFiles];
      onUploadComplete(allFiles);
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
      onUploading?.(false);
    }
  };

  const handleFileRemove = (file: FileItem, index: number) => {
    if (loading) return;
    
    onFileRemove?.({
      url: file.uri,
      name: file.name,
      size: file.size
    }, index);
  };

  return (
    <UploadComponent
      onUploadComplete={handleUploadComplete}
      onFileRemove={handleFileRemove}
      maxFiles={maxFiles}
      maxFileSize={maxFileSize}
      autoUpload={autoUpload}
      capture={capture}
      disabled={disabled || loading || uploading}
      uploadType={uploadType}
      previewType={previewType}
      initialFiles={initialFiles}
    />
  );
}
