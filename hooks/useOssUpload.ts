import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { useCallback, useState } from 'react';
import type { FileItem, FileStatusChangeCallback } from '../components/upload/types';
import { getOssPresignedUrl } from '../services/ossService';
import { getContentTypeByExtension, getFileUrl } from '../utils/fileUtils';

interface UseOssUploadResult {
  uploading: boolean;
  uploadFiles: (files: FileItem[], onFileStatusChange?: FileStatusChangeCallback) => Promise<{ url: string; name: string; size: number }[]>;
}

export function useOssUpload(): UseOssUploadResult {
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(async (
    files: FileItem[],
    onFileStatusChange?: FileStatusChangeCallback
  ): Promise<{ url: string; name: string; size: number }[]> => {
    const filesToUpload = files.filter(file => file.status === 'ready');
    
    if (filesToUpload.length === 0) {
      return files
        .filter(file => file.status === 'success')
        .map(file => ({ url: file.uri, name: file.name, size: file.size }));
    }

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        onFileStatusChange?.(file.id, 'uploading', 0);
        
        const fileName = file.name;
        const fileType = getContentTypeByExtension(fileName);
        
        const presignedResult = await getOssPresignedUrl(fileName, fileType);
        
        if (!presignedResult || !presignedResult.uploadUrl) {
          onFileStatusChange?.(file.id, 'error');
          throw new Error('获取预签名URL失败');
        }
        
        const { uploadUrl } = presignedResult;
        
        try {
          const uploadResult = await uploadAsync(uploadUrl, file.uri, {
            httpMethod: 'PUT',
            uploadType: FileSystemUploadType.BINARY_CONTENT,
          });
          
          if (uploadResult && (uploadResult.status === 200 || uploadResult.status === 204)) {
            const fileUrl = getFileUrl(uploadUrl);
            onFileStatusChange?.(file.id, 'success', 100);
            return { url: fileUrl, name: fileName, size: file.size };
          } else {
            onFileStatusChange?.(file.id, 'error');
            throw new Error(`上传失败: HTTP ${uploadResult?.status || 'unknown'}`);
          }
        } catch (uploadError: any) {
          onFileStatusChange?.(file.id, 'error');
          throw uploadError;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      const existingFiles = files
        .filter(file => file.status === 'success')
        .map(file => ({ url: file.uri, name: file.name, size: file.size }));
      
      return [...existingFiles, ...uploadedFiles];
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, uploadFiles };
}
