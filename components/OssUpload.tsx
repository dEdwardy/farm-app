import { getOssPresignedUrl } from '@/services/ossService';
import { fileToBlob, getContentTypeByExtension, getFileUrl } from '@/utils/fileUtils';
import { encode } from 'js-base64';
import React, { useState } from 'react';
import { UploadComponent } from './upload';
import { FileInfo, FileItem } from './upload/types';

interface OssUploadProps {
  onUploadComplete: (files: { url: string; name: string; size: number }[]) => void;
  onFileRemove?: (file: { url: string; name: string; size: number }, index: number) => void;
  onUploading?: (uploading: boolean) => void;
  maxFiles?: number;
  maxFileSize?: number; // 单位：字节
  autoUpload?: boolean;
  capture?: boolean;
  disabled?: boolean;
  uploadType?: 'image' | 'file'; // image: 图片上传, file: 文件上传
  previewType?: 'list' | 'picture'; // list: 列表模式, picture: 九宫格模式
  initialFiles?: (string | FileInfo)[]; // 初始文件URL数组或FileInfo数组
  loading?: boolean; // 控制上传状态
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
  uploadType = 'file', // 默认文件上传
  previewType, // 可选，不设置则根据uploadType自动决定
  initialFiles = [], // 初始文件URL数组
  loading = false
}: OssUploadProps) {
  const [uploading, setUploading] = useState(false);

  // 处理上传完成回调
  const handleUploadComplete = async (files: FileItem[]) => {
    if (loading) return;
    
    // 只处理状态为ready的文件
    const filesToUpload = files.filter(file => file.status === 'ready');
    
    if (filesToUpload.length === 0) {
      // 如果没有需要上传的文件，直接返回当前文件列表
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
      const uploadedFiles = [];
      
      // 逐个上传文件
      for (const file of filesToUpload) {
        try {
          const fileName = file.name;
          const fileType = getContentTypeByExtension(fileName);
          const { uploadUrl, originalName } = await getOssPresignedUrl(fileName, fileType);
          
          // 转换文件为blob
          const fileBlob = await fileToBlob(file.uri, fileType);
          
          // 上传文件到OSS
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': fileType,
              'x-oss-meta-original-name': encode(originalName),
            },
            body: fileBlob,
          });
          
          // 获取文件的访问URL
          const fileUrl = getFileUrl(uploadUrl);
          uploadedFiles.push({ url: fileUrl, name: fileName, size: file.size });
        } catch (error) {
          console.error('上传文件失败:', error);
          // 继续上传其他文件，不因为单个文件失败而中断
        }
      }
      
      // 合并已上传的文件和之前的文件
      const existingFiles = files
        .filter(file => file.status === 'success')
        .map(file => ({ url: file.uri, name: file.name, size: file.size }));
      
      const allFiles = [...existingFiles, ...uploadedFiles];
      onUploadComplete(allFiles);
    } catch (error) {
      console.error('上传过程失败:', error);
    } finally {
      setUploading(false);
      onUploading?.(false);
    }
  };

  // 处理文件删除回调
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
