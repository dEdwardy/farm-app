import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { startNetworkLogging } from 'react-native-network-logger';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 启动网络日志记录
startNetworkLogging();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);

  // 首次进入应用或路由变化时进行权限校验：
  //  - 未登录且当前路由不是 login，则强制跳转到 /login
  //  - 已登录但在 login 页，则跳转到 /(tabs)
  useEffect(() => {
    const runAuthGuard = async () => {
      try {
        const isAuthenticated = await authService.checkAuthStatus();

        const firstSegment = segments[0] as string | undefined;
        const onLoginScreen = firstSegment === 'login';

        if (!isAuthenticated && !onLoginScreen) {
          router.replace('/login');
        } else if (isAuthenticated && onLoginScreen) {
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.error('Auth guard error:', e);
      } finally {
        // 无论鉴权是否出错，都允许应用继续渲染，避免白屏
        setAuthChecked(true);
      }
    };

    runAuthGuard();
  }, [segments, router]);

  useEffect(() => {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          router.replace('/(tabs)');
        } else if (event === 'SIGNED_OUT') {
          router.replace('/login');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [router]);

  // 在完成一次权限检查前，避免闪屏，暂时什么都不渲染
  if (!authChecked) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* 简单的启动占位，方便确认不是空白渲染 */}
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}
