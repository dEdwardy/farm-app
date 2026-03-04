import { documentDirectory, downloadAsync, makeDirectoryAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// 下载路径
const DownloadPath = `${documentDirectory}downloads`;

/**
 * 下载选项接口
 */
export interface FileSystemDownloadOptions {
  progressInterval?: number;
  onProgress?: (downloadProgress: {
    totalBytesWritten: number;
    totalBytesExpectedToWrite: number;
  }) => void;
  headers?: Record<string, string>;
  cachePolicy?: 'reloadIgnoringLocalCacheData' | 'returnCacheDataElseLoad' | 'returnCacheDataDontLoad';
}

/**
 * 文件操作工具类
 */
export class FileUtils {
  /**
   * 确保下载目录存在
   */
  static async ensureDownloadDirectory() {
    try {
      await makeDirectoryAsync(DownloadPath, { intermediates: true });
    } catch (error) {
      // 目录已存在时会抛出错误，忽略
    }
  }

  /**
   * 下载文件
   * @param url 文件URL
   * @param fileName 文件名
   * @param options 下载选项
   * @returns 下载的文件路径
   */
  static async downloadFile(
    url: string,
    fileName: string,
    options?: FileSystemDownloadOptions
  ): Promise<string> {
    // 确保下载目录存在
    await this.ensureDownloadDirectory();
    
    const downloadUri = `${DownloadPath}/${fileName}`;
    
    try {
      const result = await downloadAsync(url, downloadUri, options);
      return result.uri;
    } catch (error) {
      console.error('下载文件失败:', error);
      throw error;
    }
  }

  /**
   * 分享文件
   * @param fileUri 文件路径
   * @returns 是否分享成功
   */
  static async shareFile(fileUri: string): Promise<boolean> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
        return true;
      }
      return false;
    } catch (error) {
      console.error('分享文件失败:', error);
      return false;
    }
  }

  /**
   * 获取文件扩展名
   * @param fileName 文件名
   * @returns 文件扩展名
   */
  static getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * 判断是否为图片文件
   * @param fileName 文件名
   * @returns 是否为图片
   */
  static isImageFile(fileName: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const extension = this.getFileExtension(fileName);
    return imageExtensions.includes(extension);
  }

  /**
   * 格式化文件大小
   * @param bytes 文件大小（字节）
   * @returns 格式化后的文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
