// 文件工具类
// export const readFileContent = async (filePath: string) => {
//   try {
//     const content = await FileSystem.read(filePath, 'utf8');
//     return content;
//   } catch (error) {
//     console.error('读取文件内容失败:', error);
//     throw error;
//   }
// }
// 获取文件路径 去掉query参数
export const getFileUrl = (path: string) => {
  const url = new URL(path);
  return url.origin + url.pathname;
}
export function getContentTypeByExtension(filename: string): string {
  // 从文件名中提取扩展名
  const extension = filename.split('.').pop()?.toLowerCase();

  if (!extension) {
    return 'application/octet-stream';
  }

  // 常见文件类型的contentType映射
  const contentTypeMap: Record<string, string> = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',

    // 文档
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    md: 'text/markdown',

    // 音频
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',

    // 视频
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',

    // 压缩文件
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',

    // 其他
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ts: 'application/typescript',
    exe: 'application/x-msdownload',
    dmg: 'application/x-apple-diskimage',
  };

  // 返回对应的contentType，如果没有找到则返回默认值
  return contentTypeMap[extension] || 'application/octet-stream';
}

// 从文件路径或URL中获取文件名
export function getFileNameFromPath(path: string): string {
  // 处理URL
  if (path.includes('://')) {
    const url = new URL(path);
    path = url.pathname;
  }

  // 从路径中提取文件名
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}

// 生成唯一的文件名
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');

  return `${baseName}_${timestamp}_${random}${extension ? `.${extension}` : ''}`;
}

// 将文件路径转换为Blob
export async function fileToBlob(fileUri: string, mimeType: string): Promise<Blob> {
  try {
    // 检查是否在React Native环境中
    // if (typeof window === 'undefined' && typeof global !== 'undefined') {
    //   // React Native环境
    //   const { readAsStringAsync } = require('expo-file-system');
      
    //   // 读取文件内容为Base64
    //   const fileContent = await readAsStringAsync(fileUri, {
    //     encoding: 'base64',
    //   });
      
    //   // 将Base64转换为Blob
    //   const blob = new Blob([Uint8Array.from(atob(fileContent), c => c.charCodeAt(0))], {
    //     type: mimeType,
    //   });
      
    //   return blob;
    // } else {
      // Web环境
      console.log('Web环境', fileUri)
      const response = await fetch(fileUri);
      const blob = await response.blob();
      
      // 确保Blob的MIME类型正确
      if (blob.type !== mimeType) {
        const arrayBuffer = await blob.arrayBuffer();
        return new Blob([arrayBuffer], { type: mimeType });
      }
      
      return blob;
    // }
  } catch (error) {
    console.error('文件转换为Blob失败:', error);
    throw error;
  }
}
