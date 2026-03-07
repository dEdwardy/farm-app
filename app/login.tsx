import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/AppLogo';
import { authService } from '@/services/authService';
import { useTheme } from '../contexts/ThemeContext';

const MIN_INPUT_LENGTH = 6;
const MAX_INPUT_LENGTH = 18;

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [autoChecking, setAutoChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isAuthenticated = await authService.checkAuthStatus();
        if (isAuthenticated){
          router.replace('/(tabs)');
          return;
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      } finally {
        setAutoChecking(false);
      }
    };

    checkToken();
  }, [router]);

  const validateEmail = (emailValue: string): string | null => {
    if (!emailValue.trim()) {
      return '请输入邮箱';
    }
    if (emailValue.length < MIN_INPUT_LENGTH || emailValue.length > MAX_INPUT_LENGTH) {
      return `邮箱长度必须在${MIN_INPUT_LENGTH}-${MAX_INPUT_LENGTH}位之间`;
    }
    return null;
  };

  const validatePassword = (passwordValue: string): string | null => {
    if (!passwordValue.trim()) {
      return '请输入密码';
    }
    if (passwordValue.length < MIN_INPUT_LENGTH || passwordValue.length > MAX_INPUT_LENGTH) {
      return `密码长度必须在${MIN_INPUT_LENGTH}-${MAX_INPUT_LENGTH}位之间`;
    }
    return null;
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    // 表单验证
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
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
    } catch (error) {
      console.error('登录失败:', error);
      setError('登录失败，请稍后重试');
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

            {/* TODO: 后续优化 - 解决Android密码管理器自动填充导致的黄色背景问题 */}
            <View style={currentStyles.formGroup}>
              <Text style={currentStyles.label}>邮箱</Text>
              <View style={currentStyles.inputContainer}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="请输入邮箱"
                  placeholderTextColor={theme.colors.text.secondary}
                  style={currentStyles.input}
                  editable={true}
                />
              </View>
            </View>

            <View style={currentStyles.formGroup}>
              <Text style={currentStyles.label}>密码</Text>
              <View style={currentStyles.inputContainer}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="请输入密码"
                  placeholderTextColor={theme.colors.text.secondary}
                  style={currentStyles.input}
                  editable={true}
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
    flex:1,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  togglePassword: {
    padding: 8,
  },
  togglePasswordIcon: {
    fontSize: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  errorContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: theme.colors.error + '15',
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: '600',
  },
});
