import { useColorScheme } from '@/hooks/use-color-scheme';
import { getSupabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import ToastManager from 'toastify-react-native';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    const runAuthGuard = async () => {
      try {
        const isAuthenticated = await authService.checkAuthStatus();
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

        const firstSegment = segments[0] as string | undefined;
        const onLoginScreen = firstSegment === 'login';
        const onOnboardingScreen = firstSegment === 'onboarding';
        const onSplashScreen = firstSegment === 'splash';

        // 如果在启动页，不做任何操作
        if (onSplashScreen) {
          setAuthChecked(true);
          setOnboardingChecked(true);
          return;
        }

        // 未完成引导页 -> 去引导页（不管是否登录）
        if (!hasCompletedOnboarding && !onOnboardingScreen) {
          router.replace('/onboarding');
        }
        // 已完成引导页但未登录 -> 去登录页
        else if (hasCompletedOnboarding && !isAuthenticated && !onLoginScreen) {
          router.replace('/login');
        }
        // 已完成引导页且已登录 -> 去主页
        else if (hasCompletedOnboarding && isAuthenticated && (onLoginScreen || onOnboardingScreen)) {
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.warn('Auth guard error:', e);
      } finally {
        setAuthChecked(true);
        setOnboardingChecked(true);
      }
    };

    runAuthGuard();
  }, [segments, router]);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    const setupAuthListener = async () => {
      const client = await getSupabase();
      if (!client) return;

      const { data: { subscription: sub } } = client.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // 登录成功后，检查是否完成引导页
          AsyncStorage.getItem('hasCompletedOnboarding').then(hasCompleted => {
            if (!hasCompleted) {
              router.replace('/onboarding');
            } else {
              router.replace('/(tabs)');
            }
          });
        } else if (event === 'SIGNED_OUT') {
          router.replace('/login');
        }
      });

      subscription = sub;
    };

    setupAuthListener();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (!authChecked || !onboardingChecked) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="splash">
            <Stack.Screen 
              name="splash" 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="login" 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="onboarding" 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="add" 
              options={{ 
                title: '新增养殖场',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 18,
                },
                headerBackTitle: '',
              }} 
            />
            <Stack.Screen 
              name="edit" 
              options={{ 
                title: '编辑养殖场',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 18,
                },
                headerBackTitle: '',
              }} 
            />
            <Stack.Screen 
              name="detail" 
              options={{ 
                title: '养殖场详情',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 18,
                },
                headerBackTitle: '',
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </NavigationThemeProvider>
        <ToastManager />
      </View>
    </ThemeProvider>
  );
}
