// 文件工具类

// 获取文件路径 去掉query参数
export const getFileUrl = (path: string) => {
  try {
    console.log('[getFileUrl] 输入 path:', path);
    const url = new URL(path);
    const result = url.origin + url.pathname;
    console.log('[getFileUrl] 输出 result:', result);
    return result;
  } catch (error) {
    console.error('[getFileUrl] 解析 URL 失败:', error, 'path:', path);
    return path;
  }
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


