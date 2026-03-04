import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '@/styles/theme';

interface NoDataProps {
  icon?: string;
  text?: string;
  style?: object;
}

export function NoData({ 
  icon = '📄', 
  text = '暂无数据', 
  style 
}: NoDataProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
