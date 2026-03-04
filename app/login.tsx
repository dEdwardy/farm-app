import { Input } from '@rneui/base';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/AppLogo';
import { authService } from '@/services/authService';
import { useTheme } from '../contexts/ThemeContext';


export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoChecking, setAutoChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await authService.login({ email, password });

      if (response.success) {
        router.replace('/(tabs)');
      } else {
        setError(response.error || '登录失败，请稍后重试');
      }
    } catch (e) {
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
      const response = await authService.loginWithMagicLink(email);

      if (response.success) {
        setError('登录链接已发送到您的邮箱，请点击链接登录');
      } else {
        setError(response.error || '发送登录链接失败，请稍后重试');
      }
    } catch (e) {
      setError('发送登录链接失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const currentStyles = styles(theme);

  // 自动检查登录状态时显示全屏 loading
  if (autoChecking) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={currentStyles.centerContainer}>
          <TouchableOpacity
            style={[currentStyles.loginButton, { opacity: 0.6 }]}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={currentStyles.centerContainer}>
          <View style={currentStyles.formContainer}>
            {/* Logo 区域 */}
            <View style={currentStyles.logoContainer}>
              <AppLogo size={100} style={currentStyles.logoIcon} />
              <Text style={currentStyles.logoText}>渔场管家</Text>
              <Text style={currentStyles.logoSubtext}>智能水产养殖管理专家</Text>
            </View>

            <View style={currentStyles.formGroup}>
              <Text style={currentStyles.label}>用户名</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="请输入用户名"
                containerStyle={currentStyles.inputBox}
                inputContainerStyle={currentStyles.inputInner}
              />
            </View>

            <View style={currentStyles.formGroup}>
              <Text style={currentStyles.label}>密码</Text>
              <View style={currentStyles.passwordContainer}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="请输入密码"
                  containerStyle={currentStyles.inputBox}
                  inputContainerStyle={currentStyles.inputInner}
                />
                <TouchableOpacity 
                  style={currentStyles.togglePassword} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={currentStyles.togglePasswordIcon}>{showPassword ? '👁️‍🗨️' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={currentStyles.rememberContainer}>
              <Switch
                value={rememberPassword}
                onValueChange={setRememberPassword}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={rememberPassword ? '#FFFFFF' : '#F4F3F4'}
              />
              <Text style={currentStyles.rememberText}>记住密码</Text>
            </View>

            {error && (
              <View style={currentStyles.errorContainer}>
                <Text style={currentStyles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[currentStyles.loginButton, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{loading ? "正在登录..." : "登录"}</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[currentStyles.loginButton, { marginTop: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary }]}
              onPress={handleMagicLinkLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {loading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 8 }} />}
                <Text style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 16 }}>{loading ? "发送登录链接..." : "使用邮箱链接登录"}</Text>
              </View>
            </TouchableOpacity> */}

            <View style={currentStyles.registerLink}>
              <Text style={currentStyles.registerText}>还没有账号？ <Text style={currentStyles.registerButton}>注册</Text>（暂时关闭）</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    padding: 32,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadow.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  inputBox: {
    width: '100%',
    padding: 0,
  },
  inputInner: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordContainer: {
    position: 'relative',
  },
  togglePassword: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  togglePasswordIcon: {
    fontSize: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 8,
  },
  errorContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  registerButton: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
});

