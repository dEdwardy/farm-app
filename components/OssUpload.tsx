import { toast } from '@/utils/toast';
import { useOssUpload } from '../hooks/useOssUpload';
import { UploadComponent } from './upload';
import type { FileInfo, FileItem, FileStatusChangeCallback, ImageCompressionConfig } from './upload/types';

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
  imageCompression?: ImageCompressionConfig;
}

export function OssUpload({ 
  onUploadComplete,
  onFileRemove,
  onUploading,
  maxFiles,
  maxFileSize = Number.MAX_VALUE,
  autoUpload = true,
  capture = false,
  disabled = false,
  uploadType = 'file',
  previewType,
  initialFiles = [],
  loading = false,
  imageCompression = { enabled: true, quality: 0.8 }
}: OssUploadProps) {
  const { uploading, uploadFiles } = useOssUpload();
  
  // 默认不限制数量，除非显式指定
  const effectiveMaxFiles = maxFiles ?? Number.MAX_VALUE;

  const handleUploadComplete = async (
    files: FileItem[], 
    onFileStatusChange?: FileStatusChangeCallback
  ) => {
    if (loading) return;
    
    onUploading?.(true);

    try {
      const allFiles = await uploadFiles(files, onFileStatusChange);
      onUploadComplete(allFiles);
    } catch (error: any) {
      console.error('上传失败:', error);
      toast.error(error?.message || '上传失败，请稍后重试');
    } finally {
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
      maxFiles={effectiveMaxFiles}
      maxFileSize={maxFileSize}
      autoUpload={autoUpload}
      capture={capture}
      disabled={disabled || loading || uploading}
      loading={loading || uploading}
      uploadType={uploadType}
      previewType={previewType}
      initialFiles={initialFiles}
      imageCompression={imageCompression}
    />
  );
}
