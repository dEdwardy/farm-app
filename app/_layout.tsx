import { useColorScheme } from '@/hooks/use-color-scheme';
import { getSupabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import { permissionService } from '@/services/permissionService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import ToastManager from 'toastify-react-native';
import { ThemeProvider } from '../contexts/ThemeContext';
import { PermissionRequestModal } from '../components/PermissionRequestModal';

interface RouteState {
  firstSegment: string | undefined;
  onLoginScreen: boolean;
  onOnboardingScreen: boolean;
  onSplashScreen: boolean;
  onIndexScreen: boolean;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [onboardingChecked, setOnboardingChecked] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [permissionName, setPermissionName] = useState<string>('');
  const [permissionDescription, setPermissionDescription] = useState<string>('');
  const [shouldRequestPermissions, setShouldRequestPermissions] = useState<boolean>(false);
  const [splashCompleted, setSplashCompleted] = useState<boolean>(false);

  // 请求权限的函数
  const requestPermissions = async () => {
    console.log('开始请求权限...');
    try {
      // 请求相机权限
      const cameraStatus = await permissionService.requestCameraPermission();
      console.log('相机权限请求结果:', cameraStatus);

      // 请求媒体库权限
      const mediaLibraryStatus = await permissionService.requestMediaLibraryPermission();
      console.log('媒体库权限请求结果:', mediaLibraryStatus);

      // 检查权限状态，如果被拒绝或未被授予，显示弹窗
      if (cameraStatus !== 'granted') {
        console.log('相机权限未授予，显示弹窗');
        setPermissionName('相机');
        setPermissionDescription('用于拍摄养殖场照片');
        setShowPermissionModal(true);
      } else if (mediaLibraryStatus !== 'granted') {
        console.log('媒体库权限未授予，显示弹窗');
        setPermissionName('媒体库');
        setPermissionDescription('用于选择和保存养殖场照片');
        setShowPermissionModal(true);
      } else {
        console.log('所有权限已授予');
      }
    } catch (error) {
      console.error('请求权限时出错:', error);
    }
  };

  // 获取路由状态
  const getRouteState = useCallback((): RouteState => {
    const firstSegment = segments[0];
    return {
      firstSegment,
      onLoginScreen: firstSegment === 'login',
      onOnboardingScreen: firstSegment === 'onboarding',
      onSplashScreen: firstSegment === 'splash',
      onIndexScreen: firstSegment === undefined,
    };
  }, [segments]);

  // Splash 页面3秒后自动标记为完成
  useEffect(() => {
    const routeState = getRouteState();
    if (routeState.onSplashScreen) {
      const timer = setTimeout(() => {
        console.log('Splash 页面3秒倒计时完成');
        setSplashCompleted(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [segments, getRouteState]);

  useEffect(() => {
    const runAuthGuard = async () => {
      try {
        const isAuthenticated = await authService.checkAuthStatus();
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        const routeState = getRouteState();

        // 如果在index页面，重定向到splash
        if (routeState.onIndexScreen) {
          console.log('在index页面，重定向到splash');
          router.replace('/splash');
          return;
        }

        // 如果在启动页且未完成3秒倒计时，不做任何操作
        if (routeState.onSplashScreen && !splashCompleted) {
          console.log('在splash页面，等待3秒倒计时');
          setAuthChecked(true);
          setOnboardingChecked(true);
          return;
        }

        // Splash 3秒倒计时完成后，或者在其他页面，执行路由守卫逻辑
        if (splashCompleted || !routeState.onSplashScreen) {
          // 未完成引导页 -> 去引导页（不管是否登录）
          if (!hasCompletedOnboarding && !routeState.onOnboardingScreen) {
            console.log('未完成引导页，跳转到引导页');
            router.replace('/onboarding');
          }
          // 已完成引导页但未登录 -> 去登录页
          else if (hasCompletedOnboarding && !isAuthenticated && !routeState.onLoginScreen) {
            console.log('已完成引导页但未登录，跳转到登录页');
            router.replace('/login');
          }
          // 已完成引导页且已登录 -> 去主页
          else if (hasCompletedOnboarding && isAuthenticated && (routeState.onLoginScreen || routeState.onOnboardingScreen || routeState.onSplashScreen)) {
            console.log('已完成引导页且已登录，跳转到主页');
            router.replace('/(tabs)');
          }
        }
      } catch (error) {
        console.warn('Auth guard error:', error);
      } finally {
        setAuthChecked(true);
        setOnboardingChecked(true);
      }
    };

    runAuthGuard();
  }, [segments, router, getRouteState, splashCompleted]);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const setupAuthListener = async () => {
      try {
        const client = await getSupabase();
        if (!client) return;

        const { data: { subscription: sub } } = client.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            // 登录成功后，检查是否完成引导页
            AsyncStorage.getItem('hasCompletedOnboarding').then(hasCompleted => {
              if (!hasCompleted) {
                router.replace('/onboarding');
              } else {
                // 登录成功后请求权限
                console.log('登录成功，准备请求权限');
                setShouldRequestPermissions(true);
                router.replace('/(tabs)');
              }
            }).catch(error => {
              console.error('检查引导页状态失败:', error);
            });
          } else if (event === 'SIGNED_OUT') {
            router.replace('/login');
          }
        });

        subscription = sub;
      } catch (error) {
        console.error('设置认证监听器失败:', error);
      }
    };

    setupAuthListener();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  // 监听 shouldRequestPermissions 状态，触发权限请求
  useEffect(() => {
    if (shouldRequestPermissions) {
      requestPermissions();
      setShouldRequestPermissions(false); // 只请求一次
    }
  }, [shouldRequestPermissions]);

  // 监听路由变化，在进入 onboarding 页面时请求权限
  useEffect(() => {
    const routeState = getRouteState();

    if (routeState.onOnboardingScreen && onboardingChecked) {
      // 在 onboarding 页面时，检查是否需要请求权限
      AsyncStorage.getItem('hasRequestedPermissions').then(hasRequested => {
        if (!hasRequested) {
          console.log('首次进入 onboarding 页面，准备请求权限');
          setShouldRequestPermissions(true);
          AsyncStorage.setItem('hasRequestedPermissions', 'true');
        }
      }).catch(error => {
        console.error('检查权限请求状态失败:', error);
      });
    }
  }, [segments, onboardingChecked, getRouteState]);

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
        
        {/* 权限请求弹窗 - 全局显示 */}
        <PermissionRequestModal
          visible={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          permissionName={permissionName}
          permissionDescription={permissionDescription}
        />
      </View>
    </ThemeProvider>
  );
}
