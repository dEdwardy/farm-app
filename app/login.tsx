import { Input } from '@rneui/base';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authService } from '@/services/authService';


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoChecking, setAutoChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isAuthenticated = await authService.checkAuthStatus();
        if (isAuthenticated){
          router.replace('/(tabs)');
          return;
        }
      } catch (_) {
        // ignore
      } finally {
        setAutoChecking(false);
      }
    };

    checkToken();
  }, [router]);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    // 表单验证
    if (!email.trim()) {
      setError('请输入邮箱');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('请输入密码');
      setLoading(false);
      return;
    }

    if (email.length < 6 || email.length > 18) {
      setError('邮箱长度必须在6-18位之间');
      setLoading(false);
      return;
    }

    if (password.length < 6 || password.length > 18) {
      setError('密码长度必须在6-18位之间');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to login with:', email);
      const response = await authService.login({ email, password });

      if (response.success) {
        console.log('Login successful',response);
        router.replace('/(tabs)');
      } else {
        console.log('Login failed:', response.error);
        setError(response.error || '登录失败，请稍后重试');
      }
    } catch (e) {
      console.error('Login error:', e);
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    setError(null);
    setLoading(true);

    // 表单验证
    if (!email.trim()) {
      setError('请输入邮箱');
      setLoading(false);
      return;
    }

    if (email.length < 6 || email.length > 18) {
      setError('邮箱长度必须在6-18位之间');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending magic link to:', email);
      const response = await authService.loginWithMagicLink(email);

      if (response.success) {
        console.log('Magic link sent successfully');
        setError('登录链接已发送到您的邮箱，请点击链接登录');
      } else {
        console.log('Magic link failed:', response.error);
        setError(response.error || '发送登录链接失败，请稍后重试');
      }
    } catch (e) {
      console.error('Magic link error:', e);
      setError('发送登录链接失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 自动检查登录状态时显示全屏 loading
  if (autoChecking) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={[styles.loginButton, { opacity: 0.6 }]}
            disabled
            activeOpacity={1}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>正在检查登录状态...</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.centerContainer}>
          <View style={styles.formContainer}>
            {/* 预留 Logo 区域 */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>A</Text>
              </View>
              <Text style={styles.heading}>欢迎回来</Text>
              <Text style={styles.subheading}>请输入邮箱和密码登录</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>邮箱</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="请输入邮箱"
                containerStyle={styles.inputBox}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>密码</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="请输入密码"
                containerStyle={styles.inputBox}
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{loading ? "正在登录..." : "登录"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { marginTop: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#1976d2' }]}
              onPress={handleMagicLinkLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {loading && <ActivityIndicator size="small" color="#1976d2" style={{ marginRight: 8 }} />}
                <Text style={{ color: '#1976d2', fontWeight: '600', fontSize: 16 }}>{loading ? "发送登录链接..." : "使用邮箱链接登录"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  inputBox: {
    width: '100%',
  },
  errorContainer: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#1976d2',
  } as any,
});

