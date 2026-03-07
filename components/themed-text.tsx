import React, { ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export interface ThemedTextProps extends TextProps {
  children: ReactNode;
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'caption';
}

export function ThemedText({ children, type = 'default', style, ...props }: ThemedTextProps) {
  const { theme } = useTheme();

  // 根据类型设置不同的样式
  const getTextStyle = (): TextStyle => {
    switch (type) {
      case 'title':
        return {
          fontSize: theme.fontSize.xl,
          color: theme.colors.text.primary,
          fontWeight: 'bold',
        };
      case 'subtitle':
        return {
          fontSize: theme.fontSize.lg,
          color: theme.colors.text.primary,
          fontWeight: '600',
        };
      case 'defaultSemiBold':
        return {
          fontSize: theme.fontSize.md,
          color: theme.colors.text.primary,
          fontWeight: '600',
        };
      case 'caption':
        return {
          fontSize: theme.fontSize.sm,
          color: theme.colors.text.secondary,
        };
      default:
        return {
          fontSize: theme.fontSize.md,
          color: theme.colors.text.primary,
        };
    }
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
}
