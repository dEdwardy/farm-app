

// 文件项接口
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  // 可选：文件对象，可能是 Expo FileSystem 的 File 实例、ImagePickerAsset 或 DocumentPickerAsset
  file?: any;
  status: 'ready' | 'uploading' | 'success' | 'error';
  progress?: number;
}

// 文件信息接口
export interface FileInfo {
  url: string;
  name: string;
  size?: number;
}

// 文件状态变更回调类型
export type FileStatusChangeCallback = (fileId: string, status: FileItem['status'], progress?: number) => void;

// 图片压缩配置接口
export interface ImageCompressionConfig {
  enabled: boolean; // 是否启用压缩
  quality?: number; // 压缩质量 (0-1)
  maxWidth?: number; // 最大宽度
  maxHeight?: number; // 最大高度
  compressionMethod?: 'auto' | 'manual'; // 压缩方法
}

// 上传组件属性接口
export interface UploadComponentProps {
  onUploadComplete: (files: FileItem[], onFileStatusChange?: FileStatusChangeCallback) => void;
  onFileRemove?: (file: FileItem, index: number) => void;
  onProgress?: (file: FileItem, progress: number) => void;
  onSuccess?: (file: FileItem) => void;
  onFileStatusChange?: FileStatusChangeCallback; // 文件状态变更回调
  maxFiles?: number;
  maxFileSize?: number; // 单位：字节
  autoUpload?: boolean;
  capture?: boolean;
  disabled?: boolean;
  loading?: boolean; // 全局loading状态
  uploadType?: 'image' | 'file'; // image: 图片上传, file: 文件上传
  previewType?: 'list' | 'picture'; // list: 列表模式, picture: 九宫格模式
  initialFiles?: (string | FileInfo)[]; // 初始文件URL数组或FileInfo数组
  imageCompression?: ImageCompressionConfig; // 图片压缩配置
}

// 文件列表属性接口
export interface FileListProps {
  files: FileItem[];
  disabled: boolean;
  loading?: boolean;
  onFileRemove?: (file: FileItem, index: number) => void;
}

// 图片网格属性接口
export interface ImageGridProps {
  files: FileItem[];
  disabled: boolean;
  loading?: boolean;
  maxFiles: number;
  onAddPress: () => void;
  onFileRemove?: (file: FileItem, index: number) => void;
  onImagePress: (uri: string) => void;
}

// 文件项属性接口
export interface FileItemProps {
  file: FileItem;
  disabled: boolean;
  loading?: boolean;
  onRemove?: (file: FileItem) => void;
}

// 图片项属性接口
export interface ImageItemProps {
  file: FileItem;
  disabled: boolean;
  loading?: boolean;
  onRemove?: (file: FileItem) => void;
  onImagePress: (uri: string) => void;
}

// 添加按钮属性接口
export interface AddButtonProps {
  onPress: () => void;
  uploadType: 'image' | 'file';
}
