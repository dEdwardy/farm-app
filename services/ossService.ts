// import OSS from 'ali-oss';
import { supabase } from '../lib/supabase';

// 阿里云OSS配置
const ossConfig = {
  region: 'your-oss-region', // 例如：oss-cn-hangzhou
  bucket: 'your-bucket-name',
};

const UINFO_KEY = 'user_info';

// 获取OSS STS凭证
export async function getOssStsToken(): Promise<any> {
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    // 调用Supabase Edge Function获取OSS临时凭证
    const { data, error } = await supabase.functions.invoke('aliyun-oss', {
        // body: { name: 'Functions' },
        // headers: {
        //   'Content-Type': 'application/json',
        // },
    });
    if (error) {
      throw error;
    }

    console.log('获取OSS STS凭证成功:', data);
    return data;
  } catch (error) {
    console.error('获取OSS STS凭证失败:', error);
    throw error;
  }
}

// 创建OSS实例（使用STS凭证）
// export function createOssClient(stsToken: any): OSS {
//   return new OSS({
//     ...ossConfig,
//     accessKeyId: stsToken.AccessKeyId,
//     accessKeySecret: stsToken.AccessKeySecret,
//     stsToken: stsToken.SecurityToken,
//   });
// }

// 上传文件到OSS
// export async function uploadToOSS(file: any, stsToken: any): Promise<string> {
//   try {
//     // 创建OSS客户端
//     const client = createOssClient(stsToken);

//     // 生成唯一的文件名
//     const fileName = `uploads/${Date.now()}_${Math.floor(Math.random() * 10000)}_${file.name}`;

//     // 上传文件
//     const result = await client.put(fileName, file.uri);

//     // 返回文件的URL
//     return result.url;
//   } catch (error) {
//     console.error('OSS上传失败:', error);
//     throw error;
//   }
// }

// 批量上传文件到OSS
// export async function uploadMultipleToOSS(files: any[], stsToken: any): Promise<string[]> {
//   const uploadPromises = files.map(file => uploadToOSS(file, stsToken));
//   return await Promise.all(uploadPromises);
// }

// 获取文件预签名URL
export async function getOssPresignedUrl(originalFileName: string, contentType: string): Promise<{ uploadUrl: string; objectKey: string; originalName: string }> {
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    
    // 调用Supabase Edge Function获取预签名URL
    const { data, error } = await supabase.functions.invoke(`aliyun-oss-sts?fileName=${encodeURIComponent(originalFileName)}&fileType=${encodeURIComponent(contentType)}`, {
      body: {
        name:"Functions",
      },
    });

    if (error) {
      throw error;
    }

    console.log('获取OSS预签名URL成功:', data);
    return data;
  } catch (error) {
    console.error('获取OSS预签名URL失败:', error);
    throw error;
  }
}
