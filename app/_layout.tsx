import { getSupabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import ToastManager from 'toastify-react-native';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);

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
      } finally {
        setAuthChecked(true);
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
          router.replace('/(tabs)');
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

  if (!authChecked) {
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
          <Stack initialRouteName="login">
            <Stack.Screen 
              name="login" 
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
