import React, { ReactNode } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export interface ThemedViewProps extends ViewProps {
  children: ReactNode;
}

export function ThemedView({ children, style, ...props }: ThemedViewProps) {
  const { theme } = useTheme();

  const viewStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
  };

  return (
    <View style={[viewStyle, style]} {...props}>
      {children}
    </View>
  );
}
