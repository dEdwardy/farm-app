import { UploadComponent } from '@/components/UploadComponent';
import { getOssPresignedUrl, getOssStsToken } from '@/services/ossService';
import { commonStyles } from '@/styles/commonStyles';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DemoScreen() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [stsToken, setStsToken] = useState<any>(null);
  const [presignedUrl, setPresignedUrl] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (files: any[]) => {
    console.log('上传完成:', files);
    setUploadedFiles(files);
  };

  const handleGetStsToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 调用封装的函数获取OSS临时凭证
      const token = await getOssStsToken();
      token && setStsToken(token);
    } catch (err) {
      console.error('获取OSS STS凭证失败:', err);
      setError('获取OSS STS凭证失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGetPresignedUrl = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 调用封装的函数获取OSS预签名URL
      const url = await getOssPresignedUrl('test.jpg', 'image/jpeg');
      url && setPresignedUrl(url);
    } catch (err) {
      console.error('获取OSS预签名URL失败:', err);
      setError('获取OSS预签名URL失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.heading}>文件上传演示</Text>
          <Text style={commonStyles.subtitle}>测试文件上传功能</Text>
        </View>
        
        <UploadComponent
          onUploadComplete={handleUploadComplete}
          maxFiles={5}
          uploadType="image"
        />
        
        <View style={{ marginTop: 32 }}>
          <UploadComponent
            onUploadComplete={handleUploadComplete}
            maxFiles={5}
            uploadType="file"
          />
        </View>
        
        {/* 获取OSS STS凭证按钮 */}
        <View style={{ marginTop: 32, marginBottom: 32 }}>
          <Text style={commonStyles.heading}>阿里云OSS STS凭证</Text>
          <Text style={commonStyles.subtitle}>获取临时访问凭证，用于安全上传文件</Text>
          
          <TouchableOpacity
            style={[commonStyles.primaryButton, loading && { opacity: 0.6 }]}
            onPress={handleGetStsToken}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={commonStyles.buttonText}>{loading ? '获取中...' : '获取OSS STS凭证'}</Text>
          </TouchableOpacity>
          
          {/* 错误提示 */}
          {error && (
            <View style={commonStyles.errorContainer}>
              <Text style={commonStyles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* STS凭证信息 */}
          {stsToken && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>获取到的STS凭证:</Text>
              <Text style={commonStyles.bodyText}>AccessKeyId: {stsToken.AccessKeyId}</Text>
              <Text style={commonStyles.bodyText}>AccessKeySecret: {stsToken.AccessKeySecret}</Text>
              <Text style={commonStyles.bodyText}>SecurityToken: {stsToken.SecurityToken}</Text>
              <Text style={commonStyles.bodyText}>Expiration: {new Date(stsToken.Expiration).toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* 获取OSS预签名URL按钮 */}
        <View style={{ marginTop: 32, marginBottom: 32 }}>
          <Text style={commonStyles.heading}>阿里云OSS预签名URL</Text>
          <Text style={commonStyles.subtitle}>获取预签名URL，用于直接上传文件</Text>
          
          <TouchableOpacity
            style={[commonStyles.primaryButton, loading && { opacity: 0.6 }]}
            onPress={handleGetPresignedUrl}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={commonStyles.buttonText}>{loading ? '获取中...' : '获取OSS预签名URL'}</Text>
          </TouchableOpacity>
          
          {/* 预签名URL信息 */}
          {presignedUrl && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>获取到的预签名URL:</Text>
              <Text style={commonStyles.bodyText}>Upload URL: {presignedUrl.uploadUrl}</Text>
              <Text style={commonStyles.bodyText}>Object Key: {presignedUrl.objectKey}</Text>
              <Text style={commonStyles.bodyText}>Original Name: {presignedUrl.originalName}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
