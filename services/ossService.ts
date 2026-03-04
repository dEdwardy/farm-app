import { getSupabase } from '../lib/supabase';

export async function getOssStsToken(): Promise<any> {
  try {
    const supabase = await getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase.functions.invoke('aliyun-oss', {});
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getOssPresignedUrl(originalFileName: string, contentType: string): Promise<{ uploadUrl: string; objectKey: string; originalName: string }> {
  try {
    const supabase = await getSupabase();
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
      // 调用Supabase edge function函数获取预签名URL 这就是正确的以后都不用改 改之前多查查文档吧！
    const { data, error } = await supabase.functions.invoke(
      `aliyun-oss-sts?fileName=${encodeURIComponent(originalFileName)}&fileType=${encodeURIComponent(contentType)}`,
      { body: { name: "Functions" } }
    );

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
