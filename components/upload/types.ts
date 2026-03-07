

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

// 上传组件属性接口
export interface UploadComponentProps {
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

// 文件列表属性接口
export interface FileListProps {
  files: FileItem[];
  disabled: boolean;
  onFileRemove?: (file: FileItem, index: number) => void;
}

// 图片网格属性接口
export interface ImageGridProps {
  files: FileItem[];
  disabled: boolean;
  maxFiles: number;
  onAddPress: () => void;
  onFileRemove?: (file: FileItem, index: number) => void;
  onImagePress: (uri: string) => void;
}

// 文件项属性接口
export interface FileItemProps {
  file: FileItem;
  disabled: boolean;
  onRemove?: (file: FileItem) => void;
}

// 图片项属性接口
export interface ImageItemProps {
  file: FileItem;
  disabled: boolean;
  onRemove?: (file: FileItem) => void;
  onImagePress: (uri: string) => void;
}

// 添加按钮属性接口
export interface AddButtonProps {
  onPress: () => void;
  uploadType: 'image' | 'file';
}
