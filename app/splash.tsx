import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AppLogo } from '../components/AppLogo';

const SplashScreenComponent = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loadingDots = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('启动准备开始...');
        // 防止启动页自动隐藏
        await SplashScreen.preventAutoHideAsync();
        // 模拟一些初始化操作
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('启动准备失败:', e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      // 启动动画
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // 加载指示器动画
      loadingDots.forEach((dot, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 750,
              delay: index * 150,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 750,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });

      // 3秒后隐藏启动屏，让_layout.tsx的路由守卫决定跳转
      const timer = setTimeout(async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('SplashScreen hide error:', e);
        }
        // 不在这里跳转，让_layout.tsx的路由守卫处理
        // 设置一个标记表示启动屏已完成
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isReady, fadeAnim, scaleAnim, router, loadingDots]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <AppLogo size={180} />
        </View>
        
        {/* 应用名称 */}
        <Text style={styles.appName}>渔场管家</Text>
        <Text style={styles.slogan}>智能水产养殖管理专家</Text>
        
        {/* 加载指示器 */}
        <View style={styles.loadingIndicator}>
          {loadingDots.map((dot, index) => (
            <Animated.View
              key={index}
              style={[
                styles.loadingDot,
                {
                  opacity: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1]
                  }),
                  transform: [
                    {
                      scale: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2]
                      })
                    }
                  ]
                }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    // 使用渐变背景
    backgroundImage: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slogan: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 60,
  },
  loadingIndicator: {
    flexDirection: 'row',
    gap: 12,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default SplashScreenComponent;
