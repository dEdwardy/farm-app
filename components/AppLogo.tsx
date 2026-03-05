import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, Defs, FeDropShadow, Filter, LinearGradient, Path, Rect, Stop, Svg } from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  style?: any;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 120, style }) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        <Defs>
          <LinearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="50%" stopColor="#43A047" />
            <Stop offset="100%" stopColor="#2196F3" />
          </LinearGradient>
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#E8F5E9" />
            <Stop offset="100%" stopColor="#FFFFFF" />
          </LinearGradient>
          <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <FeDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#000000" floodOpacity="0.1"/>
          </Filter>
        </Defs>
        
        {/* 背景 */}
        <Rect width="1024" height="1024" rx="180" fill="url(#bgGradient)" filter="url(#shadow)"/>
        
        {/* 装饰圆环 */}
        <Circle cx="512" cy="512" r="400" fill="none" stroke="#E0F2F1" strokeWidth="4"/>
        <Circle cx="512" cy="512" r="360" fill="none" stroke="#B2DFDB" strokeWidth="2" opacity="0.5"/>
        
        {/* 主Logo - 水滴形状 */}
        <Path d="M300,100 C420,100 500,150 500,300 C500,450 420,500 300,500 C180,500 100,450 100,300 C100,150 180,100 300,100 Z" 
              fill="url(#iconGradient)" transform="translate(512, 512) translate(-300, -300) scale(1.2)"/>
        
        {/* 内部鱼形 */}
        <Path d="M225,250 C275,200 375,200 425,250 C450,300 425,375 375,400 C325,425 250,400 225,350 C200,325 200,275 225,250 Z" 
              fill="white" opacity="0.95" transform="translate(512, 512) translate(-300, -300) scale(1.2)"/>
        
        {/* 鱼眼 */}
        <Path d="M250,238 C278,238 300,253 300,275 C300,297 278,312 250,312 C222,312 200,297 200,275 C200,253 222,238 250,238 Z" 
              fill="#E8F5E9" transform="translate(512, 512) translate(-300, -300) scale(1.2)"/>
        
        {/* 鱼尾 */}
        <Path d="M300,325 L325,350 L275,350 Z" fill="#2E7D32" transform="translate(512, 512) translate(-300, -300) scale(1.2)"/>
        
        {/* 鱼鳞装饰 */}
        <Path d="M260,280 Q280,268 300,280" stroke="#81C784" strokeWidth="4" fill="none" opacity="0.6" transform="translate(512, 512) translate(-300, -300) scale(1.2)"/>
        <Path d="M310,280 Q330,268 350,280" stroke="#81C784" strokeWidth="4" fill="none" opacity="0.6" transform="translate(512, 512) translate(-300, -300) scale(1.2)"/>
        
        {/* 底部装饰波浪 */}
        <Path d="M0,850 Q256,800 512,850 T1024,850 L1024,1024 L0,1024 Z" fill="#E8F5E9" opacity="0.3"/>
        <Path d="M0,900 Q256,850 512,900 T1024,900 L1024,1024 L0,1024 Z" fill="#C8E6C9" opacity="0.3"/>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
