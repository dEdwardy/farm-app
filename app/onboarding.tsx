import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { AppLogo } from '../components/AppLogo';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ANIMATION_DURATION = 800;
const SLIDE_INTERVAL = 3000;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    // 使用渐变背景
    backgroundImage: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    letterSpacing: 1,
  },
  slogan: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    width: 24,
    backgroundColor: 'white',
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttons: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: '养殖场管理',
    description: '轻松添加、编辑和管理您的养殖场信息',
    icon: (
      <View style={styles.stepIcon}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M9 22V12H15V22" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </View>
    ),
  },
  {
    title: '数据监测',
    description: '实时掌握养殖环境数据，科学管理',
    icon: (
      <View style={styles.stepIcon}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M12 8V12" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M12 16H12.01" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </View>
    ),
  },
  {
    title: '安全管理',
    description: '规范管理安全信息，保障养殖安全',
    icon: (
      <View style={styles.stepIcon}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </View>
    ),
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const slideAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const scaleAnim = useRef<Animated.Value>(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 启动动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 自动轮播
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ONBOARDING_STEPS.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [fadeAnim, scaleAnim]);

  const handleStart = async () => {
    try {
      // 标记引导页已完成
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('标记引导页完成失败:', error);
    }
  };

  const handleSkip = async () => {
    try {
      // 直接跳过引导页
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('跳过引导页失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              }) }
            ]
          }
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <AppLogo size={120} />
        </View>
        
        {/* 标题 */}
        <Text style={styles.title}>渔场管家</Text>
        <Text style={styles.slogan}>智能水产养殖管理专家</Text>
        
        {/* 步骤指示器 */}
        <View style={styles.dots}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentStep === index && styles.activeDot
              ]}
            />
          ))}
        </View>
        
        {/* 引导步骤 */}
        <View style={styles.stepsContainer}>
          {ONBOARDING_STEPS.map((step, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.step,
                {
                  opacity: currentStep === index ? 1 : 0.5,
                  transform: [
                    { scale: currentStep === index ? 1 : 0.95 }
                  ]
                }
              ]}
            >
              {step.icon}
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
        
        {/* 按钮 */}
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>立即开始</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>跳过引导</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default OnboardingScreen;
