import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

interface NoDataProps {
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  text?: string;
  style?: StyleProp<ViewStyle>;
}

export const NoData: React.FC<NoDataProps> = ({
  icon = 'folder-open',
  text = '暂无数据',
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        },
        style,
      ]}
    >
      <MaterialIcons
        name={icon}
        size={48}
        color={theme.colors.text.secondary}
        style={{ marginBottom: theme.spacing.sm }}
      />
      <Text
        style={{
          fontSize: theme.fontSize.md,
          color: theme.colors.text.secondary,
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  );
};
